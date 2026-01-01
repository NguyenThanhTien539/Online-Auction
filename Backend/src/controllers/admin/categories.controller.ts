import { Request, Response } from "express";
import * as accountModel from "../../models/account.model.ts";
import * as categoryHelper from "../../helpers/category.helper.ts";
import * as categoriesModel from "../../models/categories.model.ts";
import { AccountRequest } from "../../interfaces/request.interface.ts";

export async function buildTree(_: Request, res: Response) {
  const categories = await categoriesModel.getAllCategory();
  const buildTree = categoryHelper.buildTree(categories, null);
  res.json({ code: "success", message: "Thành công", tree: buildTree });
}

export async function createPost(req: AccountRequest, res: Response) {
  try {
    req.body.created_by = req.user.user_id;
    req.body.updated_by = req.user.user_id;
    await categoriesModel.insertCategory(req.body);
    res.json({ code: "success", message: "Tạo danh mục mới thành công" });
  } catch (error) {
    res.json({ code: "error", message: "Có lỗi xảy ra" });
  }
}

export async function calTotalCategories(req: Request, res: Response) {
  const filter = {};
  if (req.query.status) {
    Object.assign(filter, { status: req.query.status });
  }
  if (req.query.creator) {
    Object.assign(filter, { creator: req.query.creator });
  }
  if (req.query.dateFrom) {
    Object.assign(filter, { dateFrom: req.query.dateFrom });
  }
  if (req.query.dateTo) {
    Object.assign(filter, { dateTo: req.query.dateTo });
  }
  if (req.query.search) {
    Object.assign(filter, { search: req.query.search as string });
  }

  const total = await categoriesModel.calTotalCategories(filter);
  res.json({ code: "success", message: "Thành công", total: total });
}

export async function list(req: AccountRequest, res: Response) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const filter = {};
  if (req.query.status) {
    Object.assign(filter, { status: req.query.status });
  }
  if (req.query.creator) {
    Object.assign(filter, { creator: req.query.creator });
  }
  if (req.query.dateFrom) {
    Object.assign(filter, { dateFrom: req.query.dateFrom });
  }
  if (req.query.dateTo) {
    Object.assign(filter, { dateTo: req.query.dateTo });
  }
  if (req.query.search) {
    Object.assign(filter, { search: req.query.search as string });
  }
  const list = await categoriesModel.getCategoryWithOffsetLimit(
    (page - 1) * limit,
    limit,
    filter
  );
  for (const category of list) {
    const detailedAccount = await accountModel.findAcountById(
      category.created_by
    );
    category.created_by = detailedAccount
      ? detailedAccount.full_name
      : "Không xác định";
    const detailedAccountUpdated = await accountModel.findAcountById(
      category.updated_by
    );
    category.updated_by = detailedAccountUpdated
      ? detailedAccountUpdated.full_name
      : "Không xác định";
  }

  res.json({
    code: "success",
    message: "Thành công",
    list: list,
  });
}

export async function edit(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const list = await categoriesModel.getCategoryWithID(Number(id));
    const item = list.length > 0 ? list[0] : null;

    res.json({ code: "success", item });
  } catch (error) {
    res.json({ code: "error", item: null });
  }
}

export async function editPatch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await categoriesModel.updateCategoryWithID(Number(id), req.body);

    res.json({ code: "success", message: "Cập nhật thành công" });
  } catch (error) {
    res.json({ code: "error", message: "Có lỗi xảy ra ở đây" });
  }
}
