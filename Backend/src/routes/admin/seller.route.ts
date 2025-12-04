import express from "express";
const route = express.Router();
import * as sellerController from "../../controllers/admin/seller.controller.ts";

route.get("/applications", sellerController.applications);

route.get("/application/detail/:id", sellerController.applicationDetail);
export default route;
