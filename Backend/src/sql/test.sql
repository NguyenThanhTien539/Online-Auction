








--- FTS for products
alter table products
drop column if exists fts;

alter table
  products
add column
  fts tsvector generated always as (to_tsvector('english', remove_accents(product_name))) stored;

create index products_fts on products using gin (fts);


select * FROM products WHERE fts @@ to_tsquery('english', 'dien  thoai' );


 SELECT 
            p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE p.cat2_id = 8 and p.is_removed = false
            and p.fts @@ websearch_to_tsquery('english', remove_accents(''))
        -- ORDER BY ${
        --   orderBy.length > 0 ? orderBy.join(", ") : "p.product_id DESC"
        -- }
        LIMIT 100 OFFSET 0


select p.* from products p 
left join users u on p.seller_id = u.user_id
where u.username = 'Siuu1412';


-------------- Check is selling products 
 select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time > now()
        order by p.created_at desc


---------------- Check is sold products
select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = 43 and p.end_time < now() and p.price_owner_id is not null
        order by p.created_at desc



---------------- Check is won products 
select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.price_owner_id = ? and p.end_time < now()
        order by p.created_at desc

      
 ------------------- Check is bidding products 

SELECT
            p.*,
            u.username AS price_owner_username, count(*) OVER() AS total_count
        FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE
            p.end_time > NOW()
            AND p.product_id IN (
                SELECT DISTINCT product_id
                FROM bidding_history
                WHERE user_id = ?
            )
        ORDER BY p.created_at DESC     

------------------------ Check inventory products



select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = 43 and p.end_time < now() and p.price_owner_id is null
        order by p.created_at desc


------------- Reset bidding data for a product (for testing purposes)
DO $$
DECLARE
    v_product_id INT := 300;
BEGIN
   
    DELETE FROM bidding_history WHERE product_id = v_product_id;

  
    DELETE FROM bidding_ban_user WHERE product_id = v_product_id;

    DELETE FROM orders WHERE product_id = v_product_id;   

    UPDATE products 
    SET price_owner_id = NULL, 
        current_price = start_price, 
        bid_turns = 0,
        end_time = NOW() + INTERVAL '5 day' ,
        auction_end_email_sent = false
    WHERE product_id = v_product_id;
    
END $$;

select * from bidding_history where product_id = 300;
------------- Reset ALL products that have bidding activity (for cleaning up after bot testing)
DO $$
DECLARE
    affected_products INT;
BEGIN
    -- Get count of products that will be reset
    SELECT COUNT(DISTINCT product_id) INTO affected_products
    FROM bidding_history;
    
    RAISE NOTICE 'Resetting % products with bidding activity', affected_products;
    
    -- Delete all bidding history
    DELETE FROM bidding_history;
    
    -- Delete all ban records
    DELETE FROM bidding_ban_user;
    
    -- Delete all orders
    DELETE FROM orders;
    
    -- Reset all products that had bidding activity (bid_turns > 0 or price_owner_id is not null)
    UPDATE products 
    SET price_owner_id = NULL, 
        current_price = start_price, 
        bid_turns = 0,
        end_time = NOW() + INTERVAL '5 day',
        auction_end_email_sent = false
    WHERE bid_turns > 0 OR price_owner_id IS NOT NULL;
    
    RAISE NOTICE 'Reset complete!';
END $$;






select * from products where product_id = 54;

select count(*) from users


select * from bidding_history where product_id = 178 order by created_at desc;



select * from product_questions where user_id = 78


-- update role for user id 
update users set role = 'seller' where user_id = 18;




