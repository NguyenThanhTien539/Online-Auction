import { Request, Response } from "express";
import * as userModel from "../../models/users.model.ts";

export async function registerSellerRequest(req: Request, res: Response) {
  const { reason } = req.body;
  const user = (req as any).user;
  // check if they have already sent a request
  const existingRequest = await userModel.checkRegisterSellerRequest(
    user.user_id
  );
  if (existingRequest) {
    return res.status(400).json({
      status: "error",
      message: "Bạn đã gửi yêu cầu nâng cấp lên người bán. Vui lòng chờ xử lý.",
    });
  }
  await userModel.registerSellerRequest(user.user_id, reason);
  return res.status(200).json({
    status: "success",
    message: "Yêu cầu nâng cấp lên người bán đã được gửi thành công.",
  });
}

export async function rateUser(req: Request, res: Response) {
  try {
    const rater_id = (req as any).user.user_id;
    const { user_id, score, comment } = req.body;
    await userModel.rateUser({ user_id, rater_id, score, comment });
    return res.status(200).json({
      status: "success",
      message: "Đánh giá người dùng thành công.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi đánh giá người dùng.",
    });
  }
}

export async function getUserRatingCount(req: Request, res: Response) {
  try {
    const user_id = parseInt(req.query.user_id as string);
    const username = req.query.username as string;
    const ratingData = await userModel.getUserRatingCount({
      user_id,
      username,
    });
    return res.status(200).json({
      status: "success",
      data: ratingData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi lấy dữ liệu đánh giá người dùng.",
    });
  }
}

export async function getUserRatingHistory(req: Request, res: Response) {
  try {
    const user_id = parseInt(req.query.user_id as string);
    const username = req.query.username as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const offset = (page - 1) * limit;
    const ratingHistory = await userModel.getUserRatingHistory({
      user_id,
      username,
      offset,
      limit,
    });
    return res.status(200).json({
      status: "success",
      data: ratingHistory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi khi lấy lịch sử đánh giá người dùng.",
    });
  }
}
