import db from "../config/database.config.ts";


export async function fetchTopHighestPriceProducts(limit: number) {
    let query = await db.raw(`
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id,
            u2.rating AS seller_rating
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        where p.is_removed = false
        ORDER BY p.current_price DESC
        LIMIT ? OFFSET 0
    `, [limit]);
    let result = await query.rows;
    return result;
}

export async function fetchTopMostBidProducts(limit: number) {
    let query = await db.raw(`
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id,
            u2.rating AS seller_rating
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        where p.is_removed = false
        ORDER BY p.bid_turns DESC
        LIMIT ? OFFSET 0
    `, [limit]);
    let result = await query.rows;
    return result;
}


export async function fetchTopEndingSoonProducts(limit: number) {
    let query = await db.raw(`
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id,
            u2.rating AS seller_rating
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        where p.is_removed = false and p.end_time > NOW()
        ORDER BY p.end_time DESC
        LIMIT ? OFFSET 0
    `, [limit]);
    let result = await query.rows;
    console.log ("Ending Soon Products: ", result);
    return result;
}