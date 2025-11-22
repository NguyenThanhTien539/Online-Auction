import { Request, Response } from "express";

import * as categoryHelper from "../../helpers/category.helper.ts";
import * as categoriesModel from "../../models/categories.model.ts";

export async function buildTree(_: Request, res: Response) {
  const categories = await categoriesModel.getAllCategory();
  const buildTree = categoryHelper.buildTree(categories, null);
  res.json({ code: "success", message: "Thành công", tree: buildTree });
}

export async function createPost(req: Request, res: Response) {
  await categoriesModel.insertCategory(req.body);
  res.json({ code: "success", message: "Thành công" });
}
