import { create } from "domain";
import db from "../config/database.config.ts";
import normVietNamTime from "../helpers/formatDateTime.helper.ts";
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
            p.*, u.username AS price_owner_username
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE p.cat2_id = ?
        ORDER BY ${orderBy.length > 0 ? orderBy.join(", ") : "p.product_id DESC"}
        LIMIT ? OFFSET ?
    `, [cat2_id, itemsPerPage, offset]);
    
    let results = await query.rows;

    console.log("Raw Products: ", results);
    // Format start_time and end_time
    results = results.map((product: any) => {
        console.log("Original Times: ", typeof(product.start_time));
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    })
    console.log("Formatted Products: ", results);

    if (results) {
        return results;
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


    // Format start_time and end_time
    if (result){
        result = {
            ...result,

            start_time: normVietNamTime(result.start_time),
            end_time: normVietNamTime(result.end_time)
        };
        // console.log("Formatted Product Detail: ", result);
        return result;
    }
    return null;

}