import { Request, Response } from "express";
import * as profileModel from "../../models/profile.model.ts";

export async function registerSellerRequest(req : Request, res : Response){
    const {reason} = req.body;
    const user =  (req as any).user;
    // check if they have already sent a request
    const existingRequest = await profileModel.checkRegisterSellerRequest(user.user_id);
    if (existingRequest){
        return  res.status(400).json({
            status: "error",
            message: "Bạn đã gửi yêu cầu nâng cấp lên người bán. Vui lòng chờ xử lý."
        });
    }
    await profileModel.registerSellerRequest(user.user_id, reason);
    return res.status(200).json({
        status: "success",
        message: "Yêu cầu nâng cấp lên người bán đã được gửi thành công."
    });
} 

export async function editUserProfile(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        let data = req.body;
        data.user_id = user.user_id;
        console.log("Received profile edit request from user:", user.user_id);
        await profileModel.editUserProfile(data);
    }
    catch (e){
        console.error("Error editing user profile:", e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ khi cập nhật hồ sơ người dùng."
        });
    }
    return res.status(200).json({
        status: "success",
        message: "Hồ sơ người dùng đã được cập nhật thành công."
    });
}
