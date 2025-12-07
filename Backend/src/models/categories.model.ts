import db from "../config/database.config.ts";
import { slugify } from "../helpers/slug.helper.ts";

export const getAllCategoriesLv1 = async () => {
  const result = await db.raw("select * from categories where parent_id IS NULL");
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
}

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
  }
};

export const getCategoryLv2ById = async (cat2_id: number) => {
  const result = await db.raw("select * from categories where id = ?", [
    cat2_id,
  ]);
  const data = result.rows[0];
  if (!data) {
    return null;
  }
  return data;;
}

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

export const getCategoryWithID = async (id: number) => {
  return db("categories").select("*").where({ deleted: false, id: id });
};

export const updateCategoryWithID = async (id: number, data: any) => {
  return db("categories")
    .where({ deleted: false, id })
    .update(data);
};
