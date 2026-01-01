import db from "../config/database.config.ts";
import { slugify } from "../helpers/slug.helper.ts";

export const getAllCategoriesLv1 = async () => {
  const result = await db.raw(
    "select * from categories where parent_id IS NULL"
  );
  const data = result.rows;
  if (!data) {
    return null;
  }
  return data;
};
export const getAllCategoriesLv2NoSlug = async (catId: number) => {
  const result = await db.raw("select * from categories where parent_id = ?", [
    catId,
  ]);
  const data = result.rows;
  if (!data) {
    return null;
  }
  return data;
};

export const getAllCategoriesLv2 = async (catId: number, slug: string) => {
  // Verify slug matches the category name
  const lv1Result = await db.raw("select * from categories where id = ?", [
    catId,
  ]);
  const lv1Data = lv1Result.rows[0];
  console.log("Level 1 Category Data: ", lv1Data);
  if (!lv1Data) {
    return null;
  }
  const expectedSlug = slugify(lv1Data.name);
  if (expectedSlug !== slug) {
    return null;
  }
  const result = await db.raw("select * from categories where parent_id = ?", [
    catId,
  ]);

  const data = result.rows;

  if (!data) {
    return null;
  }
  return {
    data: data,
    cat1_name: lv1Data.name,
  };
};

export const getCategoryLv2ById = async (cat2_id: number) => {
  const result = await db.raw("select * from categories where id = ?", [
    cat2_id,
  ]);
  const data = result.rows[0];
  if (!data) {
    return null;
  }
  return data;
};

export const getAllCategories = async () => {
  const result = await db.raw(
    `select * from categories
    where status = 'active' and deleted = false`
  );
  const data = result.rows;

  if (!data) {
    return null;
  }
  return data;
};

export const insertCategory = async (data: object) => {
  await db("categories").insert(data);
};

export const getAllCategory = async () => {
  return db("categories").select("*").where({ deleted: false });
};

export const getCategoryWithOffsetLimit = async (
  offset: number,
  limit: number,
  filter: any
) => {
  const q = db("categories")
    .select("*")
    .where({ deleted: false })
    .orderBy("id", "asc")
    .offset(offset)
    .limit(limit);

  // status = exact match
  if (filter?.status && filter.status !== "all") {
    q.andWhere("status", filter.status);
  }

  if (filter?.creator) {
    q.andWhereILike("created_by", `%${filter.creator}%`);
  }

  // date range (giả sử lọc theo created_at)
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
    q.andWhereILike("name", `%${filter.search}%`);
  }

  return q;
};

export const calTotalCategories = async (filter: any = {}) => {
  const q = db("categories").count("* as total").where({ deleted: false });

  // status = exact match
  if (filter?.status && filter.status !== "all") {
    q.andWhere("status", filter.status);
  }

  if (filter?.creator) {
    q.andWhereILike("created_by", `%${filter.creator}%`);
  }

  // date range (giả sử lọc theo created_at)
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
    q.andWhereILike("name", `%${filter.search}%`);
  }

  const result = await q;
  return parseInt(result[0].total as string, 10);
};

export const getCategoryWithID = async (id: number) => {
  return db("categories").select("*").where({ deleted: false, id: id });
};

export const updateCategoryWithID = async (id: number, data: any) => {
  return db("categories").where({ deleted: false, id }).update(data);
};
