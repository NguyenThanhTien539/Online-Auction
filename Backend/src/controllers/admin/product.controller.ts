import { Request, Response } from "express";
import * as productModel from "../../models/products.model.ts";
import * as accountModel from "../../models/account.model.ts";
import { AccountRequest } from "../../interfaces/request.interface.ts";

export async function calTotalProducts(req: Request, res: Response) {
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

  const total = await productModel.calTotalProducts(filter);
  res.json({ code: "success", message: "Thành công", total: total });
}

export async function list(req: AccountRequest, res: Response) {
  try {
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

    const list = await productModel.getProductWithOffsetLimit(
      (page - 1) * limit,
      limit,
      filter
    );

    for (const product of list) {
      const creator = await accountModel.findAccountById(product.seller_id);
      product.creator_name = creator ? creator.full_name : "Unknown";
    }

    res.json({
      code: "success",
      message: "Thành công",
      list: list,
    });
  } catch (error) {
    console.error("Error in product list controller:", error);
    res.json({ code: "error", message: "Có lỗi xảy ra", list: [] });
  }
}

export async function detail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(Number(id));

    if (!product) {
      return res.json({ code: "error", message: "Không tìm thấy sản phẩm" });
    }

    // Lấy thông tin người bán
    const seller = await accountModel.findAccountById(product.seller_id);
    if (seller) {
      product.seller_name = seller.full_name;
    }

    res.json({
      code: "success",
      message: "Thành công",
      product: product,
    });
  } catch (error) {
    console.error("Error in product detail controller:", error);
    res.json({ code: "error", message: "Có lỗi xảy ra" });
  }
}
