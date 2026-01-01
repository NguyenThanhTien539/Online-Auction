import express from "express";
import categoryRoute from "./category.route.ts";
import applicationFormRoute from "./application-form.route.ts";
import * as authMiddleware from "../../middlewares/auth.middleware.ts";

const route = express.Router();

route.use(
  "/api/category",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  categoryRoute
);

route.use(
  "/api/application-form",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  applicationFormRoute
);

export default route;
