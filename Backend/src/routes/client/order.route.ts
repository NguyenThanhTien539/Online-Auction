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

route.get(
  "/status",
  authMiddleware.verifyToken,
  orderController.getOrderDetail
);

route.get(
  "/seller-view",
  authMiddleware.verifyToken,
  orderController.getSellerOrderView
);

route.post("/reject", authMiddleware.verifyToken, orderController.rejectOrder);

route.post(
  "/approve",
  authMiddleware.verifyToken,
  upload.single("shipping_label"),
  orderController.approveOrder
);
export default route;
