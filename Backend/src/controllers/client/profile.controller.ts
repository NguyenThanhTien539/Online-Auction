import { Request, Response } from "express";
import * as profileModel from "../../models/profile.model.ts";
import { uploadToCloudinary } from "../../config/cloud.config.ts";
import fs from "fs";


export async function editUserProfile(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        let data = req.body;
        data.user_id = user.user_id;
        console.log("Received profile edit request from user:", user.user_id);


        const file = req.file as Express.Multer.File;
        if (file){
            const uploadResult = await uploadToCloudinary(file.path, "avatar");
            // delete local file 
            fs.unlinkSync(file.path);
            
            data.avatar = uploadResult.secure_url; // Update avatar to Cloudinary URL
        }

        const results = await profileModel.editUserProfile(data);

        res.status(200).json({
            status: "success",
            message: "Hồ sơ người dùng đã được cập nhật thành công.",
            data: results[0]
        });
    }
    catch (e){
        console.error("Error editing user profile:", e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ khi cập nhật hồ sơ người dùng."
        });
    }
}

export async function getUserProfileDetail (req : Request, res : Response) {
    try {
        const username = req.query.username as string;
        const user_id = req.query.user_id as string;
        // To define is this the owner of the profile
        const user = (req as any).user;
        if (!username || !user_id){
            return res.status(400).json({
                status: "error",
                message: "username và user_id là bắt buộc"
            });
        }
        const profileDetail = await profileModel.getUserProfileDetail(
            {
                username: username,
                user_id: parseInt(user_id),
                current_user_id: user ? user.user_id : null
            }
        )
        if (!profileDetail){
            return res.status(404).json({
                status: "error",
                message: "Không tìm thấy hồ sơ người dùng"
            });
        }
        console.log ("Profile Data: ", profileDetail);
        return res.status(200).json({
            status: "success",
            data: profileDetail.data,
            is_owner: profileDetail.is_owner
        });

    }
    catch (e){

    }
}