import { Request, Response } from "express";
import * as categoriesModel from "../../models/categories.model.ts";

export async function getAllCategoriesLv1(_: Request, res: Response) {
  // Handle select all categories level 1
  const resultData = await categoriesModel.getAllCategoriesLv1();
  console.log("Fetched Level 1 Categories: ", resultData);
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

export async function getAllCategoriesLv2(req: Request, res: Response) {
  const id = req.query.cat_id;
  const slug = req.query.cat_slug;

  console.log("Category ID received: ", id);
  console.log("Category Slug received: ", slug);

  // Handle select all categories level 2 with lv1 id

  const resultData = await categoriesModel.getAllCategoriesLv2(
    Number(id),
    String(slug)
  );
  if (resultData === null) {
    return res.status(400).json({
      code: "error",
      message: "Slug không khớp với tên danh mục cấp 1",
    });
  }
  console.log("Fetched Level 2 Categories: ", resultData);
  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục cấp 2 thành công",
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
  // format data into nested structure
  const formattedData: any[] = [];
  const categoryMap: { [key: number]: any } = {};
  resultData.forEach((item: any) => {
    if (!categoryMap[item.cat1_id]) {
      categoryMap[item.cat1_id] = {
        cat1_id: item.cat1_id,
        name: item.cat1_name,
        items: [],
      };
      formattedData.push(categoryMap[item.cat1_id]);
    }
    categoryMap[item.cat1_id].items.push({
      cat2_id: item.cat2_id,
      name: item.cat2_name,
      image: item.cat2_image,
    });
  });
  console.log(
    "Formatted Categories Data: ",
    JSON.stringify(formattedData, null, 2)
  );

  return res.status(200).json({
    code: "success",
    message: "Lấy tất cả danh mục thành công",
    data: formattedData,
  });
}

