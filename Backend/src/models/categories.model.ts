import db from "../config/database.config.ts";
import { slugify } from "../helpers/slug.helper.ts";

export const getAllCategoriesLv1 = async () => {
  const result = await db.raw("select * from categories_1");
  const data = result.rows;
  if (!data) {
    return null;
  }
  return data;
};

export const getAllCategoriesLv2 = async (catId: number, catSlug: string) => {
  // Check catSlug match
  const checkData = await db.raw(
    "select name from categories_1 where cat1_id = ?",
    [catId]
  );
  const nameCategory = checkData.rows[0]?.name;
  if (!nameCategory || slugify(nameCategory) !== catSlug) {
    console.log("Slug does not match the category name");
    return null;
  }
  const result = await db.raw("select * from categories_2 where cat1_id = ?", [
    catId,
  ]);
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
