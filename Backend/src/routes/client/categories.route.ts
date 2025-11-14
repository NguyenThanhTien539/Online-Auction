import express from "express";
const route = express.Router();
import * as categoriesController from "../../controllers/client/categories.controller.ts";

route.get("/level1", categoriesController.getAllCategoriesLv1);
route.get("/level2", categoriesController.getAllCategoriesLv2);
route.get("/all", categoriesController.getAll);

export default route;
