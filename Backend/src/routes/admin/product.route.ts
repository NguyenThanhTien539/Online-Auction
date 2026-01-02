import express from "express";
const route = express.Router();
import * as productController from "../../controllers/admin/product.controller.ts";

route.get("/list", productController.list);

route.get("/number-of-products", productController.calTotalProducts);

route.get("/detail/:id", productController.detail);

export default route;
