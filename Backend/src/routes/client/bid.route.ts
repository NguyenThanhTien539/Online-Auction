import express from "express"
const route = express.Router();
import * as bidController from "../../controllers/client/bid.controller.ts";






route.post("/play", bidController.checkBannedBidder, bidController.checkRatingUser, bidController.playBid);
route.get("/history",  bidController.getBidHistoryByProductId);
route.post("/buy_now", bidController.checkBannedBidder, bidController.checkRatingUser, bidController.buyNowProduct);
route.post("/ban_bidder", bidController.banBidder);
export default route;