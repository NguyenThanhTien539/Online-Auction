import express from "express"
const route = express.Router();
import * as bidController from "../../controllers/client/bid.controller.ts";
import verifyToken from "../../middlewares/jwt_validation.middlewares.ts";





route.post("/play", verifyToken, bidController.playBid);
route.get("/history", verifyToken, bidController.getBidHistoryByProductId);

export default route;