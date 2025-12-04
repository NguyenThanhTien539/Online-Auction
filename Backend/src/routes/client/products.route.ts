import express from "express";
import * as productsController from "../../controllers/client/products.controller.ts";
import {verifyToken} from "../../middlewares/auth.middleware.ts";
import {verifyRole} from "../../middlewares/auth.middleware.ts";
import upload from "../../helpers/uploadImage.helper.ts";
const route = express.Router();

route.get("/page_list",  productsController.getProductsPageList);
route.get("/detail", productsController.getProductDetailBySlugId);
route.post("/post-product", verifyToken, verifyRole("seller", "admin"), upload.array("product_images", 10) ,productsController.postNewProduct);
route.get("/my-products", verifyToken, productsController.getMyProductsList);
export default route;