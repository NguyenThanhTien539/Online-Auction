import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
import accountRoutes from "./account.route.ts";
import categoriesRoutes from "./categories.route.ts";
import productsRoutes from "./products.route.ts";  
import meRoutes from "./me.route.ts";
import bidRoutes from "./bid.route.ts";
import profileRoutes from "./profile.route.ts";
import {verifyToken} from "../../middlewares/auth.middleware.ts";
route.use("/", homeRoute);

route.use("/accounts", accountRoutes);

route.use("/api/categories", categoriesRoutes);

route.use("/api/products", productsRoutes);

route.use("/api/me", meRoutes);

route.use("/api/bid", bidRoutes);

route.use("/api/profile", verifyToken, profileRoutes);

export default route;
