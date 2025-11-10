import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
import accountRoutes from "./account.route.ts";
import categoriesRoutes from "./categories.route.ts";
route.use("/", homeRoute);

route.use("/accounts", accountRoutes);

route.use("/api/categories", categoriesRoutes);

export default route;
