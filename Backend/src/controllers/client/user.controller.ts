import { Request, Response } from "express";
import * as userModel from "../../models/users.model.ts";

export async function registerSellerRequest(req : Request, res : Response){
    const {reason} = req.body;
    const user =  (req as any).user;
    // check if they have already sent a request
    const existingRequest = await userModel.checkRegisterSellerRequest(user.user_id);
    if (existingRequest){
        return  res.status(400).json({
            status: "error",
            message: "Bạn đã gửi yêu cầu nâng cấp lên người bán. Vui lòng chờ xử lý."
        });
    }
    await user.registerSellerRequest(user.user_id, reason);
    return res.status(200).json({
        status: "success",
        message: "Yêu cầu nâng cấp lên người bán đã được gửi thành công."
    });
} 