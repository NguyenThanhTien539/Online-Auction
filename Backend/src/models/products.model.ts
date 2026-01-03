
import db from "../config/database.config.ts";
import { slugify } from "../helpers/slug.helper.ts";
import { io } from "@/server.ts";
export async function isProductInBiddingTime(product_id: number) {
  // Set products with end_time >= now()
  const resultQuery = await db.raw(
    `
        select *
        from products
        where product_id = ? and end_time >= now()
    `,
    [product_id]
  );
  const result = await resultQuery.rows[0];

  return result ? true : false;
}

export async function extendBiddingTimeIfNeeded(product_id: number) {
  // Check product need to extend time
  const productQuery = await db.raw(`
        select *
        from products
        where auto_extended = true and product_id = ?
    `,[product_id]);
  
  if (productQuery.rows.length === 0) {
    return;
  }
  
  const product = productQuery.rows[0];
  
  // Get extend time settings
  const settingQuery = await db.raw(`
        select extend_time, threshold_time from extend_bidding_time limit 1
    `)
  const setting = await settingQuery.rows[0];
  if (!setting) {
    return;
  }
  const extend_time = setting.extend_time; // in minutes
  const threshold_time = setting.threshold_time; // in minutes
  

  const currentTime = new Date();
  const endTime = new Date(product.end_time);
  const timeDiff = (endTime.getTime() - currentTime.getTime()) / (1000 * 60); // in minutes
  console.log ("Time difference: ", timeDiff);
  if (timeDiff <= threshold_time) {
    // Extend bidding time
    const newEndTime = new Date(endTime.getTime() + extend_time * 60 * 1000);
    await db("products")
      .where({ product_id: product_id })
      .update({ end_time: newEndTime });
    
    const productInfo = await getProductById(product_id);
        io.to(`bidding_room_${product_id}`).emit("new_bid", {
          data: productInfo,
        });
  }

  return;

}

export async function getSellerOfProduct(product_id: number) {
  const query = await db.raw(
    `
        select  u.*, p.*
        from products p join
        users u on p.seller_id = u.user_id
        where p.product_id = ?`,
    [product_id]
  );
  const result = await query.rows[0];
  return result;
}

export async function getProductById(product_id: number) {
  let query = await db.raw(
    `
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id, u1.avatar AS price_owner_avatar,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id, u2.avatar AS seller_avatar,
            u2.rating AS seller_rating
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        WHERE p.product_id = ?
    `,
    [product_id]
  );
  let result = await query.rows[0];
  return result;
}

export async function getProductsPageList(
  cat2_id: number,
  page: number,
  priceFilter: string,
  timeFilter: string,
  searchKeyword: string
) {
  const itemsPerPage = 6;
  const offset = (page - 1) * itemsPerPage;

  let orderBy = [];
  if (priceFilter === "asc") {
    orderBy.push("p.current_price ASC");
  } else if (priceFilter === "desc") {
    orderBy.push("p.current_price DESC");
  }
  if (timeFilter === "asc") {
    orderBy.push("p.end_time ASC");
  } else if (timeFilter === "desc") {
    orderBy.push("p.end_time DESC");
  }
  // Modify search keyword for full-text search

  let searchCondition = "";
  const bindings : any = [cat2_id]; 


  if (searchKeyword && searchKeyword.trim() !== "") {

    searchCondition = "AND p.fts @@ websearch_to_tsquery('english', remove_accents(?))";
    bindings.push(searchKeyword);
  }


  bindings.push(itemsPerPage, offset);


  let query = await db.raw(
    `
      SELECT 
          p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
      FROM products p
      LEFT JOIN users u ON p.price_owner_id = u.user_id
      WHERE p.cat2_id = ? AND p.is_removed = false
      ${searchCondition}  
      ORDER BY ${
        orderBy.length > 0 ? orderBy.join(", ") : "p.product_id DESC"
      }
      LIMIT ? OFFSET ?
    `,
    bindings
  );

  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;

  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }

  return null;
}

export async function getMyFavoriteProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;

  let query = await db.raw(
    `
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join love_products lp on p.product_id = lp.product_id
        left join users u on p.price_owner_id = u.user_id
        where lp.user_id = ?
        order by p.created_at desc
        limit ? offset ?
        
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;

  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
}

export async function getMySellingProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;

  let query = await db.raw(
    `
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time > now()
        order by p.created_at desc
        limit ? offset ?
        
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
  return null;
}

export async function getMySoldProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;

  let query = await db.raw(
    `
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time < now() and p.price_owner_id is not null
        order by p.created_at desc
        limit ? offset ?
        
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
  return null;
}

export async function getMyWonProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;

  let query = await db.raw(
    `
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.price_owner_id = ? and p.end_time < now()
        order by p.created_at desc
        limit ? offset ?
        
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
  return null;
}

export async function getMyBiddingProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;

  // Then get paginated results
  let query = await db.raw(
    `
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
        LIMIT ? OFFSET ?
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;

  if (results) {
    return {
      data: results,
      numberOfPages:
        results.length > 0
          ? Math.ceil(results[0].total_count / itemsPerPage)
          : 0,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
  return null;
}

export async function getMyInventoryProducts(user_id: string, page: number) {
  const itemsPerPage = 4;
  const offset = (page - 1) * itemsPerPage;
  let query = await db.raw(
    `
        select p.*, u.username as price_owner_username, count(*) over() as total_count
        from products p
        left join users u on p.price_owner_id = u.user_id
        where p.seller_id = ? and p.end_time < now() and p.price_owner_id is null
        order by p.created_at desc
        limit ? offset ?
        `,
    [user_id, itemsPerPage, offset]
  );
  let results = await query.rows;
  let numberOfPages =
    results.length > 0 ? Math.ceil(results[0].total_count / itemsPerPage) : 0;
  if (results) {
    return {
      data: results,
      numberOfPages: numberOfPages,
      quantity: results.length > 0 ? results[0].total_count : 0,
    };
  }
  return null;
}

export async function getProductDetail(
  product_id: string,
  product_slug: string
) {
  // Check slug matches
  let queryName = await db.raw(
    `
        SELECT product_name
        FROM products
        WHERE product_id = ?
    `,
    [product_id]
  );
  const productName = await queryName.rows[0]?.product_name;
  const generatedSlug = slugify(productName || "");
  if (generatedSlug !== product_slug) {
    return null;
  }

  let query = await db.raw(
    `
        SELECT 
            p.*, u1.username AS price_owner_username, u1.user_id AS price_owner_id,
            u1.rating AS price_owner_rating,
            u2.username AS seller_username, u2.user_id AS seller_id,
            u2.rating AS seller_rating, u2.avatar AS seller_avatar
            FROM products p
        LEFT JOIN users u1 ON p.price_owner_id = u1.user_id
        LEFT JOIN users u2 on p.seller_id = u2.user_id
        WHERE p.product_id = ?
    `,
    [product_id]
  );
  let result = await query.rows[0];

  return result;
}

export async function postNewProduct(productData: any) {
  try {
    const result = await db("products").insert(productData);
    return result;
  } catch (e) {
    console.error("Error inserting new product: ", e);
    throw e; // Re-throw to let controller handle the error
  }
}

export async function searchProducts({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;
  let formatQuery = query.trim();

  let productsQuery = await db.raw(
    `
        SELECT 
            p.*, u.username AS price_owner_username, count(*) OVER() AS total_count
            FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE fts @@ websearch_to_tsquery('english', remove_accents(?))
        ORDER BY p.product_id DESC
        LIMIT ? OFFSET ?
    `,
    [formatQuery, limit, offset]
  );

  let results = await productsQuery.rows;
  return {
    data: results,
    numberOfPages:
      results.length > 0 ? Math.ceil(results[0].total_count / limit) : 0,
    quantity: results.length > 0 ? results[0].total_count : 0,
  };
}

export async function getLoveStatus(
  user_id: number | null,
  product_id: number
) {
  let query = await db.raw(
    `
            select count(*) as total, (exists (
                select 1 
                from love_products 
                where user_id = ? and product_id = ?
            )) as is_loved
            from love_products
            where user_id = ? and product_id = ?
        `,
    [user_id, product_id, user_id, product_id]
  );
  let result = await query.rows[0];

  return {
    total_loves: result.total,
    is_loved: result.is_loved,
  };
}

export async function updateLoveStatus(
  user_id: number,
  product_id: number,
  love_status: boolean
) {
  const currentStatusQuery = await db.raw(
    `
        select exists (
            select 1 
            from love_products 
            where user_id = ? and product_id = ?
        ) as is_loved
    `,
    [user_id, product_id]
  );
  const currentStatus = await currentStatusQuery.rows[0].is_loved;
  if (love_status && !currentStatus) {
    // Add to love
    await db("love_products").insert({
      user_id: user_id,
      product_id: product_id,
    });
  } else if (!love_status && currentStatus) {
    // Remove from love
    await db("love_products")
      .where({
        user_id: user_id,
        product_id: product_id,
      })
      .del();
  }
  return;
}

export async function getProductQuestions({
  product_id,
  page,
  limit,
}: {
  product_id: number;
  page: number;
  limit: number;
}) {
  const offset = (page - 1) * limit;

  // limit is the limit of parent question, and result include all children of these parents
  let query = await db.raw(
    `
        WITH ParentQuestions AS (
            SELECT pq.*, u.username, u.user_id
            FROM product_questions pq 
            LEFT JOIN users u ON pq.user_id = u.user_id
            WHERE pq.product_id = ? AND pq.question_parent_id IS NULL
            ORDER BY pq.created_at DESC
            LIMIT ? OFFSET ?
        ),
        TotalCount AS (
            SELECT count(*) as full_count 
            FROM product_questions 
            WHERE product_id = ? AND question_parent_id IS NULL
        )
        -- Gộp kết quả
        SELECT res.*, tc.full_count as total_count
        FROM (
            SELECT pq.*, u.username, u.user_id
            FROM product_questions pq
            LEFT JOIN users u ON pq.user_id = u.user_id
            WHERE pq.question_parent_id IN (SELECT question_id FROM ParentQuestions)
            
            UNION ALL
            
            SELECT * FROM ParentQuestions
        ) res
        CROSS JOIN TotalCount tc
        ORDER BY res.created_at DESC;
        `,
    [product_id, limit, offset, product_id]
  );
  let allQuestions = await query.rows;
  return {
    data: allQuestions,
    total_questions: allQuestions.length > 0 ? allQuestions[0].total_count : 0,
  };
}

export async function postProductQuestion({
  product_id,
  user_id,
  content,
  question_parent_id,
}: {
  product_id: number;
  user_id: number;
  content: string;
  question_parent_id?: number | null;
}) {
  const insertData: any = {
    product_id: product_id,
    user_id: user_id,
    content: content,
  };
  if (question_parent_id) {
    insertData.question_parent_id = question_parent_id;
  }
  let result = await db("product_questions").insert(insertData).returning("*");
  const newQuestions = await result[0];
  let query = await db.raw(
    `
        SELECT pq.*, u.username, u.user_id
        FROM product_questions pq
        LEFT JOIN users u ON pq.user_id = u.user_id
        WHERE pq.question_id = ?
    `,
    [newQuestions.question_id]
  );
  result = await query.rows[0];
  return result;
}

export async function getUserInParentQuestion(question_parent_id: number) {
  let query = await db.raw(
    `
        SELECT u.*
        FROM product_questions pq
        LEFT JOIN users u ON pq.user_id = u.user_id
        WHERE pq.question_id = ?
    `,
    [question_parent_id]
  );
  let result = await query.rows[0];
  return result;
}

export async function getRelatedProducts({
  category_id,
  product_id,
  limit,
}: {
  category_id?: number;
  product_id?: number | null;
  limit: number;
}) {
  if (!category_id) {
    return null;
  }

  const query = await db.raw(
    `
        SELECT 
            p.*,
            u.username AS price_owner_username
        FROM products p
        LEFT JOIN users u ON p.price_owner_id = u.user_id
        WHERE p.cat2_id = ?
            AND p.product_id != COALESCE(?, 1)
            AND p.is_removed = FALSE
        ORDER BY RANDOM()
        LIMIT ?
    `,
    [category_id, product_id, limit]
  );

  return query.rows;
}

export async function updateProductDescription({
  product_id,
  seller_id,
  new_description,
}: {
  product_id: number;
  seller_id: string;
  new_description: string;
}) {
  // Check if the product belongs to the seller
  const productQuery = await db.raw(
    `
        SELECT *
        FROM products
        WHERE product_id = ? AND seller_id = ?
    `,
    [product_id, seller_id]
  );
  const product = await productQuery.rows[0];
  if (!product) {
    return {
      status: "403",
      message: "You are not authorized to update this product.",
    };
  }
  // Update description
  await db("products")
    .where({ product_id: product_id })
    .update({ description: new_description });
  return {
    status: "200",
    message: "Product description updated successfully.",
  };
}

export const getProductWithOffsetLimit = async (
  offset: number,
  limit: number,
  filter: any,
  is_removed: boolean = false
) => {
  const q = db("products")
    .select("*")
    .orderBy("product_id", "asc")
    .where("is_removed", is_removed)
    .offset(offset)
    .limit(limit);

  if (filter?.creator) {
    q.andWhereILike("seller_id", `%${filter.creator}%`);
  }

  // date range (filter by created_at)
  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  if (filter?.search) {
    q.andWhereRaw("fts @@ websearch_to_tsquery('english', remove_accents(?))", [
      filter.search,
    ]);
  }

  return q;
};

export const calTotalProducts = async (
  filter: any = {},
  is_removed: boolean = false
) => {
  const q = db("products").where("is_removed", is_removed).count("* as total");

  // status = exact match (is_removed field)
  if (filter?.status && filter.status !== "all") {
    q.andWhere("is_removed", filter.status === "true");
  }

  if (filter?.creator) {
    q.andWhereILike("seller_id", `%${filter.creator}%`);
  }

  // date range (filter by created_at)
  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  if (filter?.search) {
    q.andWhereRaw("fts @@ websearch_to_tsquery('english', remove_accents(?))", [
      filter.search,
    ]);
  }

  const result = await q;
  return parseInt(result[0].total as string, 10);
};

export async function countProductsByCategories(
  categoryIds: number[]
): Promise<number> {
  if (categoryIds.length === 0) return 0;
  const query = await db.raw(
    `SELECT COUNT(*) as count FROM products WHERE cat2_id = ANY(?)`,
    [categoryIds]
  );
  return query.rows[0].count;
}

export async function deleteProductById(product_id: number) {
  await db("products")
    .where({ product_id: product_id })
    .update({ is_removed: true });
}

export async function restoreProductById(product_id: number) {
  await db("products")
    .where({ product_id: product_id })
    .update({ is_removed: false });
}

export async function destroyProductById(product_id: number) {
  await db("products").where({ product_id: product_id }).del();
}
