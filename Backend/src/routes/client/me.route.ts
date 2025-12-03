import express from "express";
const route = express.Router();
import * as authMiddleware from "../../middlewares/auth.middleware.ts";

import * as meController from "../../controllers/client/me.controller.ts";

route.get("/", authMiddleware.verifyToken, meController.getMeInfo); 
export default route;
