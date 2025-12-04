import express from "express";
import categoryRoute from "./category.route.ts";
import sellerRoute from "./seller.route.ts";

const route = express.Router();

route.use("/api/category",  categoryRoute);

route.use("/api/seller", sellerRoute);


export default route;
