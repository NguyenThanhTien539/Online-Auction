import express from "express";
const route = express.Router();
import * as categoriesController from "../../controllers/admin/categories.controller.ts";

route.get("/build-tree", categoriesController.buildTree);

route.post("/create", categoriesController.createPost);

route.post("/number-of-categories", categoriesController.calTotalCategories);

route.post("/list", categoriesController.list);

route.get("/edit/:id", categoriesController.edit);

route.patch("/edit/:id", categoriesController.editPatch);

route.patch("/delete/:id", categoriesController.deleteCategory);

route.patch("/restore/:id", categoriesController.restoreCategory);

route.delete("/destroy/:id", categoriesController.destroyCategory);

export default route;
