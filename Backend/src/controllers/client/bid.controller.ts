import {Request, Response} from "express";
import * as bidModels from "../../models/bid.model.ts";
export async function playBid(req: Request, res: Response){
    try{
        const user_id = (req as any).user.user_id;
        const product_id = req.body.product_id;
        const max_price = req.body.max_price;

        // Validate max_price
        const isValid = await bidModels.isMaxPriceValid(product_id, max_price);
        if (!isValid){
            return res.status(400).json({
                status: "error",
                message: "Giá đặt không hợp lệ"
            });
        }

        // Seller can't bid on their own product_id
        const isSeller = await bidModels.checkUserIsSeller(user_id, product_id);
        if (isSeller){
            return res.status(400).json({
                status: "error",
                message: "Người bán không thể đặt giá sản phẩm của chính họ"
            });
        }
        // Play bid
        const result = await bidModels.playBid(user_id, product_id, max_price);
        console.log("Bid Result: ", result);
        return res.status(200).json({
            status: "success",
            
        });

    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}

export async function getBidHistoryByProductId (req: Request, res: Response) {
    try{
        const product_id = req.query.product_id;
        const user_id = (req as any).user.user_id;
        const isSeller = await bidModels.checkUserIsSeller(user_id, Number(product_id));
        const bidHistory = await bidModels.getBidHistoryByProductId(Number(product_id));
        return res.status(200).json({
            status: "success",
            data: bidHistory,
            isSeller: isSeller
        })
    }
    catch (e)
    {
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}