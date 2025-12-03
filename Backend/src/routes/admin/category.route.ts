import express from "express";
const route = express.Router();
import * as categoriesController from "../../controllers/admin/categories.controller.ts";
import * as authMiddleware from "../../middlewares/auth.middleware.ts";

route.get("/build-tree", categoriesController.buildTree);

route.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  categoriesController.createPost
);

route.get("/list", categoriesController.list);

route.get("/edit/:id", categoriesController.edit);

route.patch("/edit/:id", categoriesController.editPatch);

export default route;
