
import db from "../config/database.config.ts";

import { slugify } from "../helpers/slug.helper.ts";

export async function getProductsPageList(cat2_id : number, page: number, priceFilter: string, timeFilter: string) {
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    
    let orderBy = [];
    if (priceFilter === "asc") {
        orderBy.push("p.current_price ASC");
    }
    else if (priceFilter === "desc") {
        orderBy.push("p.current_price DESC");
    }
    if (timeFilter === "asc") {
        orderBy.push("p.end_time ASC");
    }
    else if (timeFilter === "desc") {
        orderBy.push("p.end_time DESC");
    }
    
    console.log("Order By Clauses: ", orderBy);

    let query = await db.raw(`
        SELECT 
            p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE p.cat2_id = ?
        ORDER BY ${orderBy.length > 0 ? orderBy.join(", ") : "p.product_id DESC"}
        LIMIT ? OFFSET ?
    `, [cat2_id, itemsPerPage, offset]);
    
    let results = await query.rows;
    let numberOfPages = results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;

    console.log("Formatted Products: ", results);
    
    if (results) {
        return {
            data: results,
            numberOfPages: numberOfPages
        }
    }
    
    return null;
}

export async function getMyFavoriteProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;

    let query = await db.raw(`
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join love_products lp on p.product_id = lp.product_id
        left join users u on p.price_owner_id = u.user_id
        where lp.user_id = ?
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    let numberOfPages = results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;

    if (results){
        return {
            data: results,
            numberOfPages: numberOfPages
        }
    }
} 

export async function getMySellingProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;

    let query = await db.raw(`
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time > now()
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    let numberOfPages = results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
    if (results){
        return {
            data: results,
            numberOfPages: numberOfPages
        }
    }
    return null;
} 

export async function getMySoldProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;

    let query = await db.raw(`
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time < now() and p.price_owner_id is not null
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    let numberOfPages = results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
    if (results){
        return {
            data: results,
            numberOfPages: numberOfPages
        }
    }
    return null;
} 

export async function getMyWonProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    let numberOfPages = await db.raw(`
        select count(*) as total
        from products p
        where p.price_owner_id = ? and p.end_time < now()`, [user_id]);
    let query = await db.raw(`
        select p.*, u.username as price_owner_username
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.price_owner_id = ? and p.end_time < now()
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
    return null;
} 

export async function getMyBiddingProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    let numberOfPages = await db.raw(`
        select count(*) as total
        from products p
        join bidding_history bh on p.product_id = bh.product_id
        where bh.user_id = ? and p.end_time > now()`, [user_id]
        );

    let query = await db.raw(`
        select distinct p.*, u.username as price_owner_username
        from products p
        join bidding_history bh on p.product_id = bh.product_id
        left join users u on p.price_owner_id = u.user_id
        where bh.user_id = ? and p.end_time > now()
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
    return null;
} 





export async function getProductDetail(product_id: string, product_slug: string) {
    // Check slug matches
    let queryName = await db.raw(`
        SELECT product_name
        FROM products
        WHERE product_id = ?
    `, [product_id]);
    const productName = await queryName.rows[0]?.product_name;
    const generatedSlug = slugify(productName || "");

    if (generatedSlug !== product_slug){
        return null;
    }

    let query = await db.raw(`
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id,
            u2.rating AS seller_rating
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        WHERE p.product_id = ?
    `, [product_id]);
    let result = await query.rows[0];


    return result;

}

export async function postNewProduct (productData: any) {
    try {
        console.log("Inserting product data:", productData);
        const result = await db('products').insert(productData);
        console.log("Insert result:", result);
        return result;
    } catch (e) {
        console.error("Error inserting new product: ", e);
        throw e; // Re-throw to let controller handle the error
    }
}

export async function searchProducts({query, page, limit} : {query: string, page: number, limit: number}) {

    const offset = (page - 1) * limit;
    const formatQuery = query.trim();
    console.log ("Formatted Search Query:", formatQuery, ":");
    let productsQuery = await db.raw(`
        SELECT 
            p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE fts @@ websearch_to_tsquery('english', remove_accents(?))
        ORDER BY p.product_id DESC
        LIMIT ? OFFSET ?
    `, [formatQuery, limit, offset])

    let results = await productsQuery.rows;
    return {
        data: results,
        numberOfPages: results.length > 0 ? Math.ceil(results[0].total_count / limit) : 0
    }

}

export async function getLoveStatus(user_id: number | null, product_id: number) {
    let query = await db.raw (`
            select count(*) as total, (exists (
                select 1 
                from love_products 
                where user_id = ? and product_id = ?
            )) as is_loved
            from love_products

        `, [user_id, product_id]);
    let result = await query.rows[0];

    return {
        total_loves: result.total,
        is_loved: result.is_loved
    };

}

export async function updateLoveStatus(user_id: number, product_id: number, love_status: boolean) {
    // Check current status 
    console.log ("Updating love status for user_id:", user_id, " product_id:", product_id, " to ", love_status);
    const currentStatusQuery = await db.raw(`
        select exists (
            select 1 
            from love_products 
            where user_id = ? and product_id = ?
        ) as is_loved
    `, [user_id, product_id]);
    const currentStatus = currentStatusQuery.rows[0].is_loved;
    if (love_status && !currentStatus){
        // Add to love
        await db('love_products').insert({
            user_id: user_id,
            product_id: product_id
        });
    }
    else if (!love_status && currentStatus){
        // Remove from love
        await db('love_products')
            .where({
                user_id: user_id,
                product_id: product_id
            })
            .del();
    }
    return;
}