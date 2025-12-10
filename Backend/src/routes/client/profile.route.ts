import express from "express";
import * as profileController from "../../controllers/client/profile.controller.ts";
import { justDecodeToken } from "../../middlewares/auth.middleware.ts";
const route = express.Router();


route.post("/register-seller", profileController.registerSellerRequest);
route.patch("/edit", profileController.editUserProfile);
route.get("/detail", justDecodeToken, profileController.getUserProfileDetail);
export default route;