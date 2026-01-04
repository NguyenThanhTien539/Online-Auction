import { Request, Response } from "express";
import { uploadToCloudinary } from "../../config/cloud.config.ts";
import * as orderModel from "../../models/order.model.ts";
import fs from "fs";

export async function createOrder(req: Request, res: Response) {
  try {
    const data = req.body;
    const file = req.file as Express.Multer.File;
    if (file) {
      const uploadResult = await uploadToCloudinary(file.path, "payment_proof");
      fs.unlinkSync(file.path);

      data.payment_proof_image_url = uploadResult.secure_url;
    }
    data.user_id = (req as any).user.user_id;

    await orderModel.createOrder(data);

    return res
      .status(200)
      .json({ status: "success", message: "Hóa đơn đã được tạo thành công" });
  } catch (error) {}
}
export async function getOrderDetail(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.query.product_id as string;
    const orderDetail = await orderModel.getOrderDetail(
      user_id,
      Number(product_id)
    );
    return res.status(200).json({
      status: "success",
      message: "Lấy chi tiết đơn hàng thành công",
      data: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi khi lấy chi tiết đơn hàng",
    });
  }
}

export async function getSellerOrderView(req: Request, res: Response) {
  try {
    const product_id = req.query.product_id as string;
    const orderDetail = await orderModel.getSellerOrderView(Number(product_id));
    return res.status(200).json({
      status: "success",
      message: "Lấy chi tiết đơn hàng cho người bán thành công",
      data: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi khi lấy chi tiết đơn hàng cho người bán",
    });
  }
}

export async function rejectOrder(req: Request, res: Response) {
  try {
    const product_id = req.query.product_id as string;
    const existedOrder = await orderModel.getOrderByProductId(
      Number(product_id)
    );

    if (!existedOrder) {
      return res.status(404).json({
        status: "error",
        message: "Đơn hàng không tồn tại",
      });
    }

    if (existedOrder.order_status !== "pending") {
      return res.status(400).json({
        status: "error",
        message: "Chỉ có thể từ chối đơn hàng đang chờ xử lý",
      });
    }

    await orderModel.updateOrderStatus(existedOrder.order_id, "rejected");

    return res.status(200).json({
      status: "success",
      message: "Đơn hàng đã được từ chối thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi khi từ chối đơn hàng",
    });
  }
}

export async function approveOrder(req: Request, res: Response) {
  try {
    const product_id = req.query.product_id as string;
    const existedOrder = await orderModel.getOrderByProductId(
      Number(product_id)
    );
    if (!existedOrder) {
      return res.status(404).json({
        status: "error",
        message: "Đơn hàng không tồn tại",
      });
    }
    if (existedOrder.order_status !== "pending") {
      return res.status(400).json({
        status: "error",
        message: "Chỉ có thể duyệt đơn hàng đang chờ xử lý",
      });
    }

    const file = req.file as Express.Multer.File;
    let shipping_label_image_url = "";
    if (file) {
      const uploadResult = await uploadToCloudinary(
        file.path,
        "shipping_label"
      );
      fs.unlinkSync(file.path);

      shipping_label_image_url = uploadResult.secure_url;
    }

    await orderModel.updateOrderStatus(
      existedOrder.order_id,
      "finished",
      shipping_label_image_url
    );


    return res.status(200).json({
      status: "success",
      message: "Đơn hàng đã được duyệt thành công",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi khi duyệt đơn hàng",
    });
  }
}
