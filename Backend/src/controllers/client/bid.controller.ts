import { Request, Response } from "express";
import * as bidModels from "../../models/bid.model.ts";
import * as userModels from "../../models/users.model.ts";
import { io } from "@/server.ts";
import * as productModels from "@/models/products.model.ts";
import {getBidderBannedTemplate, 
        sendMail, 
        getBidSuccessTemplate, 
        getBuyNowSuccessTemplate,
        getOutbidNotificationTemplate
      } from "../../helpers/mail.helper.ts"
import { slugify } from "@/helpers/slug.helper.ts";



export async function buyNowProduct(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const buy_price = req.body.buy_price;
    // check seller is not buyer
    const isSeller = await bidModels.checkUserIsSeller(user_id, product_id);
    if (isSeller) {
      return res.status(400).json({
        status: "error",
        message: "Người bán không thể mua sản phẩm của chính họ",
      });
    }

    // check product is in buy now time
    const isInBuyNowTime = await productModels.isProductInBiddingTime(
      product_id
    );
    if (!isInBuyNowTime) {
      return res.status(400).json({
        status: "error",
        message: "Sản phẩm không trong thời gian mua ngay",
      });
    }

    // process buy now
    const order = await bidModels.buyNowProduct(user_id, product_id, buy_price);

    const productInfo = await productModels.getProductById(product_id);

    // Send email to buyer
    const email = (req as any).user.email;
    const username = (req as any).user.username;
    const product_name_slug = slugify(productInfo.product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
    const emailContent = getBuyNowSuccessTemplate({
      buyer_username: username,
      product_name: productInfo.product_name,
      product_link: productUrl,
      buy_now_price: buy_price,
    });
    sendMail(
      email,
      "Bạn đã mua ngay thành công sản phẩm",
      emailContent
    );

    // Emit socket with updated product info
    io.to(`bidding_room_${product_id}`).emit("new_bid", {
      data: productInfo,
    });

    return res.status(200).json({
      status: "success",
      order_id: order.order_id,
      end_time: order.end_time,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ khi mua ngay sản phẩm",
    });
  }
}

export async function handleNewUserPlayBid(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const user_id = (req as any).user.user_id;
    const userInfo = await userModels.getUserById(user_id);
    if (userInfo.rating_count === 0) {
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ kiểm tra tài khoản đấu giá",
    });
  }
}

export async function autoExtendBiddingTime(product_id: number) {
  try {
    await productModels.extendBiddingTimeIfNeeded(product_id);
  } catch (e) {
    console.error(e);
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

    // Check if price >= buy now price
    const isBuyNowExceeded = await bidModels.isBidExceedBuyNowPrice(
      product_id,
      max_price
    );
    if (isBuyNowExceeded.result) {
      // Process buy now
      await bidModels.buyNowProduct(
        user_id,
        product_id,
        isBuyNowExceeded.buy_now_price!
      );

      // Get updated product info AFTER buyNow completes
      const productInfo = await productModels.getProductById(product_id);

      // Send email to buyer
      const email = (req as any).user.email;
      const username = (req as any).user.username;
      const product_name_slug = slugify(productInfo.product_name);
      const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
      const emailContent = getBuyNowSuccessTemplate({
        buyer_username: username,
        product_name: productInfo.product_name,
        product_link: productUrl,
        buy_now_price: isBuyNowExceeded.buy_now_price!,
      });
      
      sendMail(
        email,
        "Bạn đã mua ngay thành công sản phẩm",
        emailContent
      );

      // Emit socket with updated product info
      io.to(`bidding_room_${product_id}`).emit("new_bid", {
        data: productInfo,
      });
    } else {
      // Play bid
      autoExtendBiddingTime(product_id);
      const result = await bidModels.playBid(user_id, product_id, max_price);

      // Get updated product info AFTER playBid completes
      const productInfo = await productModels.getProductById(product_id);

      // Send email to bidder
      const email = (req as any).user.email;
      const username = (req as any).user.username;
      const product_name_slug = slugify(productInfo.product_name);
      const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
      const emailContent = getBidSuccessTemplate({
        bidder_username: username,
        product_name: productInfo.product_name,
        product_link: productUrl,
        max_price: max_price,
        current_price: productInfo.current_price,
      });
      
      // sendMail(
      //   email,
      //   "Bạn đã đặt giá thành công",
      //   emailContent
      // );

      // Send mail to outbidded old bidder if any
      if (result && result.isOldBidderOutbidded && result.oldPriceOwnerId) {
        const oldBidderInfo = await userModels.getUserById(result.oldPriceOwnerId);
        const oldBidderEmailContent = getOutbidNotificationTemplate({
          bidderUsername: oldBidderInfo.username,
          productName: productInfo.product_name,
          productUrl: productUrl,
          newCurrentPrice: productInfo.current_price,
          yourMaxBid: result?.oldPriceOwnerBid,
        })
        sendMail(
          oldBidderInfo.email,
          "Bạn đã bị vượt giá thầu",
          oldBidderEmailContent
        );
      }

      // Emit socket with updated product info
      io.to(`bidding_room_${product_id}`).emit("new_bid", {
        data: productInfo,
      });
    }

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

export async function banBidder(req: Request, res: Response) {
  try {
    const ban_user_id = req.body.banned_user_id;
    const product_id = req.body.product_id;
    const reason = req.body.reason;
    

    
    const isAlreadyBanned = await bidModels.isBannedBidder(product_id, ban_user_id);
    if (isAlreadyBanned){
      return res.status(400).json({
        status: "error",
        message: "Người đấu giá đã bị cấm trước đó",
      });
    }
    const data = await bidModels.banBidder(product_id, ban_user_id, reason);

    // Get information of banned user and seller and product
    const bannedUserInfo =  await userModels.getUserById(ban_user_id);
    const productInfo = await productModels.getProductById(product_id);
    const seller_id = productInfo.seller_id; 
    const sellerInfo =  await userModels.getUserById(seller_id);
   
    
    // Send email to banned bidder
    const product_name_slug = slugify(productInfo.product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
    
    const emailContent = getBidderBannedTemplate({
      bidder_username: bannedUserInfo.username,
      seller_username: sellerInfo.username,
      product_name: productInfo.product_name,
      product_link: productUrl,
      reason: reason,
    });
    sendMail(
      bannedUserInfo.email,
      "Bạn đã bị cấm đấu giá trên sản phẩm",
      emailContent
    );
    // Socket IO notify to bidder
    
    io.to(`bidding_room_${product_id}`).emit("new_bid", {
      data: productInfo,
    });
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ khi cấm người đấu giá",
    });
  }
}

export async function checkBannedBidder(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const isBanned = await bidModels.isBannedBidder(product_id, user_id);
    if (isBanned) {
      return res.status(403).json({
        status: "error",
        message: "Bạn đã bị cấm đấu giá sản phẩm này",
      });
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ khi kiểm tra người đấu giá bị cấm",
    });
  }
}

export async function checkRatingUser(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const user_id = (req as any).user.user_id;
    const currentUserRating = await bidModels.checkRatingUser(user_id, 4);
    if (!currentUserRating) {
      return res.status(400).json({
        status: "error",
        message: "Người dùng không đủ điều kiện để đặt giá (rating < 4)",
      });
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ khi kiểm tra đánh giá người dùng",
    });
  }
}
