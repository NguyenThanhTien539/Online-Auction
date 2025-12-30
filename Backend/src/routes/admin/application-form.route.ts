import express from "express";
const route = express.Router();
import * as sellerController from "../../controllers/admin/application-form.controller.ts";

route.get("/list", sellerController.applications);

route.get("/detail/:id", sellerController.applicationDetail);

route.patch("/set-status/:id", sellerController.setStatus);

export default route;
