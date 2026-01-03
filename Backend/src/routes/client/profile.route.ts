import express from "express";
import * as profileController from "../../controllers/client/profile.controller.ts";
import { justDecodeToken } from "../../middlewares/auth.middleware.ts";
import upload from "../../helpers/uploadImage.helper.ts";
const route = express.Router();



route.patch("/edit", upload.single("avatar"), profileController.editUserProfile);
route.get("/detail", justDecodeToken, profileController.getUserProfileDetail);
export default route;