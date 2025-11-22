import express from "express"
const route = express.Router();
import * as bidController from "../../controllers/client/bid.controller.ts";






route.post("/play", bidController.playBid);
route.get("/history", bidController.getBidHistoryByProductId);

export default route;