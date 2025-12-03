import express from "express";
import * as productsController from "../../controllers/client/products.controller.ts";
import verifyToken from "../../middlewares/jwt_validation.middlewares.ts";
import upload from "../../helpers/uploadImage.helper.ts";
const route = express.Router();

route.get("/page_list",  productsController.getProductsPageList);
route.get("/detail", productsController.getProductDetailBySlugId);
route.post("/post_product", verifyToken, upload.array("product_images", 10) ,productsController.postNewProduct);
export default route;