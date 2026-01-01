import express from "express";
const route = express.Router();
import * as categoriesController from "../../controllers/admin/categories.controller.ts";

route.get("/build-tree", categoriesController.buildTree);

route.post("/create", categoriesController.createPost);

route.get("/number-of-categories", categoriesController.calTotalCategories);

route.get("/list", categoriesController.list);

route.get("/edit/:id", categoriesController.edit);

route.patch("/edit/:id", categoriesController.editPatch);

export default route; 
