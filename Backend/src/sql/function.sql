-- ==============================================================================
-- Function: ban_auction_user
-- Purpose: Ban a user from an auction and recalculate the winner and price
-- Author: Database Engineering Team
-- Created: 2026-01-05
-- ==============================================================================

CREATE OR REPLACE FUNCTION ban_auction_user(
    p_product_id BIGINT,
    p_user_id BIGINT,
    p_reason TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_step_price DOUBLE PRECISION;
    v_starting_price DOUBLE PRECISION;
    v_new_price DOUBLE PRECISION;
    v_new_winner_id BIGINT;
    v_top_bid RECORD;
    v_second_bid RECORD;
    v_bid_count INTEGER;
    v_distinct_bidders INTEGER;
    v_seller_id BIGINT;
    v_user_max_price DOUBLE PRECISION;
    v_result JSON;
BEGIN
    -- ============================================================================
    -- STEP 1: Ban the user - Insert into bidding_ban_user table
    -- ============================================================================
    INSERT INTO bidding_ban_user (product_id, user_id, reason, created_at)
    VALUES (p_product_id, p_user_id, p_reason, NOW());

    RAISE NOTICE 'User % has been banned from product %', p_user_id, p_product_id;

    -- ============================================================================
    -- STEP 2: Invalidate all bids from the banned user
    -- ============================================================================
    UPDATE bidding_history
    SET status = 'BANNED'
    WHERE product_id = p_product_id 
      AND user_id = p_user_id
      AND (status IS NULL OR status = 'VALID');

    RAISE NOTICE 'All bids from user % on product % have been marked as BANNED', p_user_id, p_product_id;

    -- ============================================================================
    -- STEP 3: Get product information (step_price, starting_price)
    -- ============================================================================
    SELECT step_price, start_price, seller_id
    INTO v_step_price, v_starting_price, v_seller_id
    FROM products
    WHERE product_id = p_product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product % not found', p_product_id;
    END IF;

    -- ============================================================================
    -- STEP 4: Count remaining valid bidders
    -- ============================================================================
    SELECT COUNT(DISTINCT user_id)
    INTO v_distinct_bidders
    FROM bidding_history
    WHERE product_id = p_product_id
      AND (status IS NULL OR status = 'VALID');

    RAISE NOTICE 'Remaining valid bidders: %', v_distinct_bidders;

    -- ============================================================================
    -- STEP 5: Recalculate winner and price based on remaining valid bids
    -- ============================================================================

    IF v_distinct_bidders = 0 THEN
        -- ========================================================================
        -- SCENARIO C: No valid bidders remain
        -- Reset to starting price, no winner (price_owner_id = NULL)
        -- History record will use seller_id as user_id but price_owner_id stays NULL
        -- ========================================================================
        v_new_price := v_starting_price;
        v_new_winner_id := NULL;  -- No winner, price_owner_id will be NULL
        
        RAISE NOTICE 'SCENARIO C: No bidders remain. Reset to starting price: %, winner: NULL', v_new_price;

    ELSIF v_distinct_bidders = 1 THEN
        -- ========================================================================
        -- SCENARIO B: Only one bidder remains
        -- Winner = highest bidder, Price = starting_price (no competition)
        -- ========================================================================
        SELECT user_id, max_price
        INTO v_top_bid
        FROM bidding_history
        WHERE product_id = p_product_id
          AND (status IS NULL OR status = 'VALID')
        ORDER BY max_price DESC, created_at ASC
        LIMIT 1;

        v_new_winner_id := v_top_bid.user_id;
        v_new_price := v_starting_price;

        RAISE NOTICE 'SCENARIO B: Only 1 bidder (%) remains. Price reset to starting price: %', 
                     v_new_winner_id, v_new_price;

    ELSE
        -- ========================================================================
        -- SCENARIO A: Multiple bidders remain (at least 2)
        -- Winner = highest bidder
        -- Price = 2nd highest bid + step_price (capped at winner's max bid)
        -- ========================================================================
        
        -- Get the TOP 2 distinct bids (by user)
        -- We need the highest bid from each user, then take the top 2
        WITH ranked_bids AS (
            SELECT DISTINCT ON (user_id)
                user_id,
                max_price,
                created_at
            FROM bidding_history
            WHERE product_id = p_product_id
              AND (status IS NULL OR status = 'VALID')
            ORDER BY user_id, max_price DESC, created_at ASC
        )
        SELECT user_id, max_price, created_at
        INTO v_top_bid
        FROM ranked_bids
        ORDER BY max_price DESC, created_at ASC
        LIMIT 1;

        -- Get second highest bid
        WITH ranked_bids AS (
            SELECT DISTINCT ON (user_id)
                user_id,
                max_price,
                created_at
            FROM bidding_history
            WHERE product_id = p_product_id
              AND (status IS NULL OR status = 'VALID')
              AND user_id != v_top_bid.user_id  -- Exclude the winner
            ORDER BY user_id, max_price DESC, created_at ASC
        )
        SELECT user_id, max_price, created_at
        INTO v_second_bid
        FROM ranked_bids
        ORDER BY max_price DESC, created_at ASC
        LIMIT 1;

        v_new_winner_id := v_top_bid.user_id;

        -- Calculate new price: 2nd bid + step_price, but not exceeding winner's max bid
        IF v_second_bid.max_price + v_step_price > v_top_bid.max_price THEN
            v_new_price := v_top_bid.max_price;
        ELSE
            v_new_price := v_second_bid.max_price + v_step_price;
        END IF;

        RAISE NOTICE 'SCENARIO A: Winner=%, Top bid=%, Second bid=%, New price=%', 
                     v_new_winner_id, v_top_bid.max_price, v_second_bid.max_price, v_new_price;
    END IF;

    -- ============================================================================
    -- STEP 6: Update the products table with new winner and price
    -- ============================================================================
    UPDATE products
    SET current_price = v_new_price,
        price_owner_id = v_new_winner_id
    WHERE product_id = p_product_id;

    RAISE NOTICE 'Product % updated: new_price=%, new_winner=%', 
                 p_product_id, v_new_price, v_new_winner_id;

    -- ============================================================================
    -- STEP 6.5: Get the correct max_price for the history record
    -- If winner exists: get their latest max_price from bidding_history
    -- If no winner (seller): use starting_price
    -- ============================================================================
    IF v_new_winner_id IS NOT NULL THEN
        -- Get the latest max_price for the winner from their bidding history
        SELECT max_price
        INTO v_user_max_price
        FROM bidding_history
        WHERE product_id = p_product_id
          AND user_id = v_new_winner_id
          AND (status IS NULL OR status = 'VALID')
        ORDER BY created_at DESC
        LIMIT 1;
        
        -- If not found (shouldn't happen), default to v_new_price
        v_user_max_price := COALESCE(v_user_max_price, v_new_price);
        
        RAISE NOTICE 'Winner % max_price retrieved: %', v_new_winner_id, v_user_max_price;
    ELSE
        -- No winner, seller takes over, use starting price
        v_user_max_price := v_starting_price;
        
        RAISE NOTICE 'No winner, using starting_price as max_price: %', v_user_max_price;
    END IF;

    -- ============================================================================
    -- STEP 7: Log the system correction in bidding_history
    -- For SCENARIO C (no winner): user_id = seller_id, price_owner_id = NULL
    -- For other scenarios: user_id = winner_id, price_owner_id = winner_id
    -- ============================================================================
    INSERT INTO bidding_history (
        user_id,
        product_id,
        max_price,
        product_price,
        price_owner_id,
        status,
        created_at
    )
    VALUES (
        COALESCE(v_new_winner_id, v_seller_id),  -- Use seller_id if no winner
        p_product_id,
        v_user_max_price,  -- Use the retrieved max_price from history
        v_new_price,
        v_new_winner_id,  -- NULL if no winner, winner_id otherwise
        null,
        NOW()
    );

    ----------- Update bid_turns in products table -----------
    UPDATE products
    SET bid_turns = bid_turns + 1
    WHERE product_id = p_product_id;

    RAISE NOTICE 'System correction logged in bidding_history';

    -- ============================================================================
    -- STEP 8: Return success result
    -- ============================================================================
    v_result := json_build_object(
        'status', 'success',
        'message', 'User banned and price recalculated successfully',
        'banned_user_id', p_user_id,
        'product_id', p_product_id,
        'new_winner_id', v_new_winner_id,
        'new_price', v_new_price,
        'remaining_bidders', v_distinct_bidders
    );

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        -- Rollback is automatic in PostgreSQL for failed functions
        RAISE EXCEPTION 'Error in ban_auction_user: % - %', SQLERRM, SQLSTATE;
        
        RETURN json_build_object(
            'status', 'error',
            'message', SQLERRM
        );
END;
$$;

-- ==============================================================================
-- Usage Example:
-- ==============================================================================
-- SELECT ban_auction_user(123, '550e8400-e29b-41d4-a716-446655440000', 'Violated terms of service');

-- ==============================================================================
-- Notes:
-- ==============================================================================
-- 1. The function uses DISTINCT ON to get the highest bid per user
-- 2. In SCENARIO A, the new price is calculated as: 2nd_highest + step_price
--    but capped at the winner's max_price to avoid exceeding their budget
-- 3. All operations are wrapped in a transaction (implicit in function)
-- 4. If any step fails, PostgreSQL automatically rolls back the entire function
-- 5. The status column in bidding_history should be: NULL, 'VALID', 'BANNED', 'SYSTEM_CORRECTION'
-- ==============================================================================
