import { Request, Response } from "express";
import * as bidModels from "../../models/bid.model.ts";
import * as userModels from "../../models/users.model.ts";
import { io } from "@/server.ts";
import * as productModels from "@/models/products.model.ts";





export async function handleNewUserPlayBid(req: Request, res: Response, next: Function) {
  try {
    const user_id = (req as any).user.user_id;
    const userInfo = await userModels.getUserById(user_id);
    if (userInfo.rating_count === 0){

    }
    next();
  }
  catch (e){
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ kiểm tra tài khoản đấu giá",
    });
  }
}

export async function playBid(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const max_price = req.body.max_price;

    // Check end time of product
    const isValidTime = await productModels.isProductInBiddingTime(product_id);
    if (!isValidTime) {
      return res.status(400).json({
        status: "error",
        message: "Sản phẩm không trong thời gian đấu giá",
      });
    }
    // Validate max_price
    const isValid = await bidModels.isMaxPriceValid(product_id, max_price);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Giá đặt không hợp lệ",
      });
    }

    // Seller can't bid on their own product_id
    const isSeller = await bidModels.checkUserIsSeller(user_id, product_id);
    if (isSeller) {
      return res.status(400).json({
        status: "error",
        message: "Người bán không thể đặt giá sản phẩm của chính họ",
      });
    }

    // Check rating of user 
    const currentUserRating = await bidModels.checkRatingUser(user_id, 4); // Follow 5 star rating system
    if (!currentUserRating) {
      return res.status(400).json({
        status: "error",
        message: "Người dùng không đủ điều kiện để đặt giá (rating < 4)",
      });
    }

    // Play bid
    await bidModels.playBid(user_id, product_id, max_price);

    const productInfo = await productModels.getProductById(product_id);
    io.to(`bidding_room_${product_id}`).emit("new_bid", {
      data: productInfo,
    });

    return res.status(200).json({
      status: "success",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}

export async function getBidHistoryByProductId(req: Request, res: Response) {
  try {
    const product_id = req.query.product_id;
    const user_id = (req as any).user.user_id;
    const isSeller = await bidModels.checkUserIsSeller(
      user_id,
      Number(product_id)
    );
    const bidHistory = await bidModels.getBidHistoryByProductId(
      Number(product_id)
    );
    return res.status(200).json({
      status: "success",
      data: bidHistory,
      isSeller: isSeller,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
    });
  }
}
