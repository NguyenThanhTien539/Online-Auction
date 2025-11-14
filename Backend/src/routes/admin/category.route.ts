import express from "express";
const route = express.Router();
import * as categoriesController from "../../controllers/admin/categories.controller.ts";

route.get("/build-tree", categoriesController.buildTree);

route.post("/create", categoriesController.createPost);

export default route;
