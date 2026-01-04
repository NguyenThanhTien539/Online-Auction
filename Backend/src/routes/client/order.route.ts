import express from "express";
const route = express.Router();
import * as authMiddleware from "../../middlewares/auth.middleware.ts";
import * as orderController from "../../controllers/client/order.controller.ts";
import upload from "../../helpers/uploadImage.helper.ts";

route.post(
  "/create",
  authMiddleware.verifyToken,
  upload.single("payment_proof"),
  orderController.createOrder
);


route.get("/status", authMiddleware.verifyToken, orderController.getOrderDetail);



export default route;
