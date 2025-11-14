import express from "express";
import categoryRoute from "./category.route.ts";

const route = express.Router();

route.use("/api/category", categoryRoute);

export default route;
