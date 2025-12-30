import express from "express";
import categoryRoute from "./category.route.ts";
import applicationFormRoute from "./application-form.route.ts";

const route = express.Router();

route.use("/api/category",  categoryRoute);

route.use("/api/application-form", applicationFormRoute);


export default route;
