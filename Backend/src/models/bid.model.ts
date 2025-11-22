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
    return false;
}

export async function isMaxPriceValid (product_id: number, max_price: number) {
    // max_bid must >= current_price + step_price
    const findCurrentPrice = await db.raw(`
        select current_price, step_price
        from products
        where product_id = ?
    `, [product_id]);
    const currentPrice = await findCurrentPrice.rows[0].current_price;
    const stepPrice = await findCurrentPrice.rows[0].step_price;

    if (max_price < currentPrice + stepPrice){
        return false;
    }
    return true;
}


export async function playBid (user_id: number, product_id: number, max_price: number) {
    


    // Update current price in products table
    // find max_price in bidding_history
    const findMaxPriceHistory = await db.raw(`
        select MAX(max_price) as highest_price, product_price, user_id
        from bidding_history
        where product_id = ?
        LIMIT 1 offset 0
    `, [product_id]);
    console.log("Find Max Price History: ", findMaxPriceHistory.rows);
    const maxPriceHistory = await findMaxPriceHistory.rows[0].highest_price;
    const maxProductPrice = await findMaxPriceHistory.rows[0].product_price;
    const maxUserId = await findMaxPriceHistory.rows[0].user_id;

    //  Handle product_price update
    let newProductPrice = maxProductPrice;
    let newPriceOwnerId = maxUserId;
    // First bid
    if (maxPriceHistory === null){
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
        if (max_price <= maxProductPrice){
            // the first person is priority (current bidder lose)
            newProductPrice = Number(max_price);
        }
        else {
            // increase by step_price (current bidder win)
            const findStepPrice = await db.raw(`
                select step_price
                from products   
                where product_id = ?
            `, [product_id]);
            const stepPrice = await findStepPrice.rows[0].step_price;
            newProductPrice = Number(maxPriceHistory) + Number(stepPrice);
            newPriceOwnerId = user_id;
        }
    }
    

    // Insert new bid
    await db.execute(`
        insert into bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
        values (?, ?, ?, ?)
    `, [user_id, product_id, max_price, newProductPrice, newPriceOwnerId]);

    // Update products table
    await db.execute (`
        update products
        set current_price = ?, price_owner_id = ?
        where product_id = ?
    `, [newProductPrice, newPriceOwnerId, product_id]);
    
    return {
        product_id: product_id,
        new_current_price: newProductPrice,
        your_max_price: max_price
    };
}




export function getBidHistoryByProductId (product_id: number, isSeller: boolean){
    if (isSeller){
        const query =  db.raw(`
            select *
            from bidding_history
            where product_id = ? 
        `, [product_id]);
        return query.rows;
    }
    else {
        // Only show user_id, product_price, created_at
        const query =  db.raw(`
            select user_id, product_price, created_at
            from bidding_history
            where product_id = ? 
        `, [product_id]);
        console.log("Bid History : ", query.rows);
        return query.rows;
    }
}


