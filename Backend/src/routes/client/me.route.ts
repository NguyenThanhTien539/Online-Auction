import express from "express";
const route = express.Router();
import verifyToken from "../../middlewares/jwt_validation.middlewares.ts";

import  * as meController from "../../controllers/client/me.controller.ts";

route.get("/", verifyToken, meController.getMeInfo);

export default route;