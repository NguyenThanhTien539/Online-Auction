import { Request, Response } from "express";
import * as categoriesModel from "../../models/categories.model.ts";
import {buildTree} from "../../helpers/category.helper.ts";
export async function getAllCategoriesLv1(_: Request, res: Response) {
  // Handle select all categories level 1
  const resultData = await categoriesModel.getAllCategoriesLv1();

  if (resultData === null) {
    return res.status(500).json({
      code: "error",
      message: "Lỗi máy chủ khi lấy danh mục cấp 1",
    });
  }

  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục cấp 1 thành công",
    data: resultData,
  });
}
export async function getAllCategoriesLv2NoSlug(req: Request, res: Response) {
  const id = req.query.cat_id;

  // Handle select all categories level 2 with lv1 id
  const resultData = await categoriesModel.getAllCategoriesLv2NoSlug( Number(id) );

  if (resultData === null) {
    return res.status(500).json({
      code: "error",
      message: "Lỗi máy chủ khi lấy danh mục cấp 2",
    });
  }
  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục cấp 2 thành công",
    data: resultData,
  });
}

export async function getAllCategoriesLv2(req: Request, res: Response) {
  const id = req.query.cat_id;
  const slug = req.query.cat_slug;


  // Handle select all categories level 2 with lv1 id
  

  const result = await categoriesModel.getAllCategoriesLv2(
    Number(id),
    String(slug)
  );
  let data, cat1_name;
  if (result){
    data = result.data;
    cat1_name = result.cat1_name;
  }

  if (data === null) {
    return res.status(400).json({
      code: "error",
      message: "Slug không khớp với tên danh mục cấp 1",
    });
  }

  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục cấp 2 thành công",
    data: data,
    cat1_name: cat1_name,
    
  });
}


export async function getCategoryLv2ById(req: Request, res: Response) {
  const cat2_id = req.query.cat2_id;

  // Handle select category level 2 by id
  const resultData = await categoriesModel.getCategoryLv2ById( Number(cat2_id) );

  if (resultData === null) {
    return res.status(500).json({
      code: "error",
      message: "Lỗi máy chủ khi lấy danh mục cấp 2",
    });
  }
  return res.status(200).json({
    code: "success",
    message: "Lấy danh mục cấp 2 thành công",
    data: resultData,
  });
}
export async function getAll(_: Request, res: Response) {
  const resultData = await categoriesModel.getAllCategories();
  if (resultData === null) {
    return res.status(500).json({
      code: "error",
      message: "Lỗi máy chủ khi lấy tất cả danh mục",
    });
  }


  const formattedData = buildTree(resultData);

 

  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục thành công",
    data: formattedData,
  });
}

