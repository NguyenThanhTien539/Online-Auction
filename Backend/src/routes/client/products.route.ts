import express from "express";
import * as productsController from "../../controllers/client/products.controller.ts";
const route = express.Router();

route.get("/page_list",  productsController.getProductsPageList);

export default route;