import db from "../config/database.config.ts";
import normVietNamTime from "../helpers/formatDateTime.helper.ts";


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