import express from "express";
import * as profileController from "../../controllers/client/profile.controller.ts";
const route = express.Router();


route.post("/register-seller", profileController.registerSellerRequest);
route.put("/edit", profileController.editUserProfile);
export default route;