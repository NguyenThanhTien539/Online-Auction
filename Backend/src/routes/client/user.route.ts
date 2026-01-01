import express from "express";
import * as userController from "../../controllers/client/user.controller.ts";
import { verifyToken } from "../../middlewares/auth.middleware.ts";
const route = express.Router();


route.post("/register-seller", verifyToken, userController.registerSellerRequest);




export default route;