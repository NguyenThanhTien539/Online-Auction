import express from "express";
const route = express.Router();
import * as productController from "../../controllers/admin/product.controller.ts";

route.post("/list", productController.list);

route.post("/number-of-products", productController.calTotalProducts);

route.get("/detail/:id", productController.detail);

route.patch("/delete/:id", productController.deleteProduct);

route.patch("/restore/:id", productController.restoreProduct);

route.delete("/destroy/:id", productController.destroyProduct);

export default route;
