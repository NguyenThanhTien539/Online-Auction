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
    let numberOfPages = await db.raw(`
        SELECT COUNT(*) AS total
        FROM products
        WHERE cat2_id = ?`
    , [cat2_id]);
    console.log("Number of Pages Query Result: ", numberOfPages);
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
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    })
    console.log("Formatted Products: ", results);
    
    if (results) {
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
    
    return null;
}

export async function getMyFavoriteProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    let numberOfPages = await db.raw(`
        select count(*) as total
        from love_products lp
        where lp.user_id = ?`, [user_id]);
    let query = await db.raw(`
        select p.*, u.username as price_owner_username
        from products p
        left join love_products lp on p.product_id = lp.product_id
        left join users u on p.price_owner_id = u.user_id
        where lp.user_id = ?
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    results = results.map((product: any) => {
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    });
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
} 

export async function getMySellingProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    let numberOfPages = await db.raw(`
        select count(*) as total
        from products p
        where p.seller_id = ? and p.end_time > now()`, [user_id]);
    let query = await db.raw(`
        select p.*, u.username as price_owner_username
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time > now()
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    results = results.map((product: any) => {
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    });
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
} 

export async function getMySoldProducts(user_id: string, page: number){
    const itemsPerPage = 4;
    const offset = (page - 1) * itemsPerPage;
    let numberOfPages = await db.raw(`
        select count(*) as total
        from products p
        where p.seller_id = ? and p.end_time < now() and p.price_owner_id is not null`, [user_id]);
    let query = await db.raw(`
        select p.*, u.username as price_owner_username
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time < now() and p.price_owner_id is not null
        limit ? offset ?
        `, [user_id, itemsPerPage, offset])
    let results = await query.rows;
    results = results.map((product: any) => {
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    });
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
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
    results = results.map((product: any) => {
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    });
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
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
    results = results.map((product: any) => {
        return {
            ...product,
            start_time: normVietNamTime(product.start_time),
            end_time: normVietNamTime(product.end_time)
        };
    });
    if (results){
        return {
            data: results,
            numberOfPages: Math.ceil(numberOfPages.rows[0].total / itemsPerPage)
        }
    }
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