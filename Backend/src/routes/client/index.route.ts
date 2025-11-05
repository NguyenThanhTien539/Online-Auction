import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
import accountRoutes from "./account.route.ts";

route.use("/", homeRoute);

route.use("/accounts", accountRoutes);

export default route;
