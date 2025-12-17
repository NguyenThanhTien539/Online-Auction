import express from "express";
import * as productsController from "../../controllers/client/products.controller.ts";
import {verifyToken} from "../../middlewares/auth.middleware.ts";
import {verifyRole} from "../../middlewares/auth.middleware.ts";
import { justDecodeToken } from "../../middlewares/auth.middleware.ts";
import upload from "../../helpers/uploadImage.helper.ts";
const route = express.Router();

route.get("/page_list",  productsController.getProductsPageList);
route.get("/detail", productsController.getProductDetailBySlugId);
route.post("/post-product", verifyToken, verifyRole("seller", "admin"), upload.array("product_images", 10) ,productsController.postNewProduct);
route.get("/my-products", verifyToken, productsController.getMyProductsList);
route.get("/search", productsController.searchProducts);
route.get("/love_status", justDecodeToken, productsController.getLoveStatus);
route.post("/update_love_status", verifyToken, productsController.updateLoveStatus);
route.get("/questions", productsController.getProductQuestions);
route.post("/questions", verifyToken, productsController.postProductQuestion);
export default route;