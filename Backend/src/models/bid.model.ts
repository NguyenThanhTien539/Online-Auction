import db from "../config/database.config.ts";

export async function checkUserIsSeller (user_id: number, product_id: number) {

    const query = await db.raw (
        `select *
        from products
        where product_id = ? and seller_id = ?`,
        [product_id, user_id]
    );
    const result = await query.rows;
    if (!result || result.length === 0){
        return false;
    }
    return true;
}

export async function isMaxPriceValid (product_id: number, max_price: number) {
    // max_bid must >= current_price + step_price and (max_price - current_price) % step_price === 0
    const findCurrentPrice = await db.raw(`
        select current_price, step_price
        from products
        where product_id = ?
    `, [product_id]);
    const currentPrice = await findCurrentPrice.rows[0].current_price;
    let stepPrice = await findCurrentPrice.rows[0].step_price;
    stepPrice = stepPrice ? stepPrice : 0;

    if (max_price < currentPrice + stepPrice){
        return false;
    }
    if (stepPrice && (max_price - currentPrice) % stepPrice !== 0){
        return false;
    }

    return true;
}

export async function getHighestBidByProductId (product_id: number) {
    const findMaxPriceHistory = await db.raw(`
        select MAX(max_price) as highest_price
        from bidding_history
        where product_id = ?
        LIMIT 1 offset 0
    `, [product_id]);
    const maxPriceHistory = await findMaxPriceHistory.rows[0].highest_price;
    return maxPriceHistory;
}

export async function isCurrentPriceOwner (user_id: number, product_id: number) {
    const findPriceOwner = await db.raw(`
        select price_owner_id
        from products
        where product_id = ?
    `, [product_id]);
    const priceOwnerId = await findPriceOwner.rows[0].price_owner_id;
    console.log(`Current price owner id for product ${product_id} is ${priceOwnerId}`);
    return priceOwnerId == user_id;
}

export async function playBid (user_id: number, product_id: number, max_price: number) {
    

    
    // Update current price in products table
    // find max_price in bidding_history (newest highest bid)
    const isPriceOwner = await isCurrentPriceOwner(user_id, product_id);

    if (isPriceOwner){
        console.log(`Updating max_price for existing bid of user ${user_id}`);
        //  just update max_price in bidding_history (no update timestamp)
        await db.raw(`
            update bidding_history
            set max_price = ?
            where product_id = ? and user_id = ? and created_at = 
            (select MAX(created_at) from bidding_history where product_id = ? and user_id = ?)
        `, [max_price, product_id, user_id, product_id, user_id]);
        return;
    }

    const findMaxPriceHistory = await db.raw(`
        select *
        from bidding_history bh
        where bh.product_id = ?
        ORDER BY bh.max_price DESC, bh.created_at DESC
        LIMIT 1 offset 0
    `, [product_id]);
    console.log("Find Max Price History: ", findMaxPriceHistory.rows);
    const maxPriceHistoryRow = await findMaxPriceHistory.rows[0];
    const oldMaxPrice = maxPriceHistoryRow ? maxPriceHistoryRow.max_price : null;
    const oldProductPrice = maxPriceHistoryRow ? maxPriceHistoryRow.product_price : null;
    const oldPriceOwnerId = maxPriceHistoryRow ? maxPriceHistoryRow.price_owner_id : null;

    //  Handle product_price update
    let newProductPrice = oldProductPrice
    let newPriceOwnerId = oldPriceOwnerId;
    
    // First bid
    if (oldMaxPrice === null){
        // get current_price 
        const findCurrentPrice = await db.raw(`
            select current_price
            from products
            where product_id = ?
        `, [product_id]);
        const currentPrice = await findCurrentPrice.rows[0].current_price;
        newProductPrice = Number(currentPrice);
        newPriceOwnerId = user_id;
  
    }
    else{
        if (max_price <= oldMaxPrice){
            // the first person is priority (current bidder lose)
            newProductPrice = Number(max_price);
        }
        else {
            // increase by step_price (current bidder win)
            const findStepPrice = await db.raw(`
                select step_price, bid_turns
                from products   
                where product_id = ?
            `, [product_id]);
            const stepPrice = await findStepPrice.rows[0].step_price;

            // Update bid_turns in products table
            newProductPrice = Number(oldMaxPrice) + Number(stepPrice);
            newPriceOwnerId = user_id;
        }
    }
    

    // Insert new bid
    await db.raw(`
        insert into bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
        values (?, ?, ?, ?, ?)
    `, [user_id, product_id, max_price, newProductPrice, newPriceOwnerId]);

    // Update bid_turns in products table
    const bidTurnsQuery = await db.raw(`
        select count(*) as bid_turns
        from bidding_history
        where product_id = ?
    `, [product_id]);
    const bidTurns = await bidTurnsQuery.rows[0].bid_turns;
    console.log(`Total bid turns for product ${product_id} is ${bidTurns}`);
    // Update products table
    await db.raw(`
        update products
        set current_price = ?, price_owner_id = ?, bid_turns = ?
        where product_id = ?
    `, [newProductPrice, newPriceOwnerId, bidTurns, product_id]);
    
}




export async function getBidHistoryByProductId (product_id: number){
   const bidHistory = await db.raw(`
        select bh.*, u1.username as username, u1.user_id as user_id,
               u2.username as price_owner_username
        from bidding_history as bh
        left join users u1 on bh.user_id = u1.user_id
        left join users u2 on bh.price_owner_id = u2.user_id
        where bh.product_id = ?
        order by bh.created_at desc
   `, [product_id]);
    
    return bidHistory.rows;
}


export async function checkRatingUser (user_id : number, valid_rating: number){

    const query = await db.raw (`
            select *
            from users
            where user_id = ?
        `, [user_id]);
    const result = await query.rows;
    if (result[0].rating_count === 0) // Skip new user account with no rating
        return true;
    const user_rating = result[0].rating;
    if (user_rating < valid_rating)
        return false;
    return true;
}

export async function isBidExceedBuyNowPrice (product_id: number, bid_price: number) {
    const query = await db.raw (`
            select buy_now_price
            from products
            where product_id = ?
        `, [product_id]);
    const result = await query.rows;
    const buy_now_price = result[0].buy_now_price;
    if (buy_now_price === null)
        return { result: false, buy_now_price: null };
    return {
        result: bid_price >= buy_now_price,
        buy_now_price: buy_now_price
    }
}

export async function buyNowProduct (user_id: number, product_id : number, buy_price : number) {
    // SET endtime = now(), current_price = buy_now_price, price_owner_id = user_id, bid_turns = bid_turns + 1
    await db.raw(`
        update products
        set end_time = NOW(),
            current_price = ?,
            price_owner_id = ?,
            bid_turns = COALESCE(bid_turns, 0) + 1
        where product_id = ?
    `, [buy_price, user_id, product_id]);

    const isPriceOwner = await isCurrentPriceOwner(user_id, product_id);

    if (isPriceOwner){
        console.log(`Updating max_price for existing bid of user ${user_id}`);
        //  just update max_price in bidding_history (no update timestamp)
        await db.raw(`
            update bidding_history
            set max_price = ?, product_price = ?
            where product_id = ? and user_id = ? and created_at = 
            (select MAX(created_at) from bidding_history where product_id = ? and user_id = ?)
        `, [buy_price, buy_price, product_id, user_id, product_id, user_id]);
        
    }
    else {
        // Insert new bid
        await db.raw(`
            insert into bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
            values (?, ?, ?, ?, ?)
        `, [user_id, product_id, buy_price, buy_price, user_id]);
    }



    // Create order for the user
    const newOrder = await db.raw(`
        insert into orders (user_id, product_id)
        values (?, ?)
        RETURNING order_id
    `, [user_id, product_id]);
    const order_id = newOrder.rows[0].order_id;
    return {
        order_id: order_id,
        end_time: new Date().toISOString(),
    }
}