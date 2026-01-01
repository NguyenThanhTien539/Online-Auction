import { Request, Response } from "express";
import * as productsModel from "../../models/products.model.ts";
import * as usersModel from "../../models/users.model.ts";
import { uploadToCloudinary } from "../../config/cloud.config.ts";
import {sendMail} from "../../helpers/mail.helper.ts";
import fs from "fs";
import {slugify} from "../../helpers/slug.helper.ts";


export async function getProductsPageList(req: Request, res: Response){

    // Extract query parameters
    const cat2_id = req.query.cat2_id as string;
    const page = parseInt(req.query.page as string) || 1;
    const priceFilter = req.query.price as string || "";
    const timeFilter = req.query.time as string || "";
    
    
    // Validate cat2_id
    if (!cat2_id){
        return res.status(400).json({message: "cat2_id is required"});
    }

    const result = await productsModel.getProductsPageList(parseInt(cat2_id), page, priceFilter, timeFilter);

    if (result === null){
        
        return res.status(500).json({message: "Error in fetching products"});
    }
    let {data, numberOfPages, quantity} = result;
    return  res.status(200).json({message: "Success", data: data, numberOfPages: numberOfPages, quantity: quantity});

}


export async function getProductDetailBySlugId (req: Request, res: Response) {
    try{
        // Check slugid parameters
        const product_id = req.query.product_id as string;
        const product_slug = req.query.product_slug as string;
        if (!product_id || !product_slug){
            return res.status(400).json({
                status: "error",
                message: "product_id and product_slug are required"
            });
        }

        
        // Find product by product_id
        const productDetail = await productsModel.getProductDetail(product_id, product_slug);
        if (!productDetail){
            return res.status(404).json({
                status: "error",
                message: "Sản phẩm không tồn tại"
            });
        }
        return res.status(200).json({
            status: "success",
            data: productDetail
        });


    }
    catch (e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}



export async function postNewProduct (req: Request, res: Response) {
    try {
        const files = req.files as Express.Multer.File[];
        for (let file of files){
            const uploadResult = await uploadToCloudinary(file.path, "product_images");
            // delete local file 
            fs.unlinkSync(file.path);
            
            file.path = uploadResult.secure_url; // Update file path to Cloudinary URL
        }
        const user = (req as any).user;



        const newProductData = {
            product_name : req.body.product_name,
            seller_id: user.user_id,
            step_price: parseFloat(req.body.step_price),
            start_price: parseFloat(req.body.start_price),
            buy_now_price: parseFloat(req.body.buy_now_price),
            current_price: parseFloat(req.body.start_price),
            cat2_id : parseInt(req.body.cat2_id),
            start_time: (req.body.start_time),
            bid_turns : 0,
            end_time: (req.body.end_time),
            description: req.body.description,
            auto_extended: req.body.auto_extended === "true" ? true : false,
            product_images: files.map(file => file.path) // Assuming 'path' contains the file URL or path

        }
        await productsModel.postNewProduct(newProductData);
        return res.status(201).json({
            status: "success",
            message: "Sản phẩm đã được đăng thành công"
        });

  
    }
    catch (e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}

export async function getMyProductsList (req: Request, res: Response) {
    try {
        const user = (req as any).user;
        const type = req.query.type as string;
        const page = parseInt(req.query.page as string) || 1;

        let result;
        switch (type) {
            case "my-favorites":    
                result = await productsModel.getMyFavoriteProducts(user.user_id, page);     
                break;
            case "my-selling":
                result = await productsModel.getMySellingProducts(user.user_id, page);
                break;
            case "my-sold":
                result = await productsModel.getMySoldProducts(user.user_id, page);
                break;
            case "my-won":
                result = await productsModel.getMyWonProducts(user.user_id, page);
                break;
            case "my-bidding":
                result = await productsModel.getMyBiddingProducts(user.user_id, page);
                break;
            case "my-inventory":
                result = await productsModel.getMyInventoryProducts(user.user_id, page);
                break;
            default: 
                return res.status(400).json({
                    status: "error",
                    message: "Invalid type parameter"
                });
        }

        if (!result){
            return res.status(404).json({
                status: "error",
                message: "No products found"
            });
        }
        let {data, numberOfPages, quantity} = result ;
        return  res.status(200).json({
            status: "success",
            data: data,
            numberOfPages: numberOfPages,
            quantity: quantity
        });

    }
    catch (e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}

export async function searchProducts (req: Request, res: Response) {
    try {
        const query = req.query.query as string;
        console.log("Search query received: ", query);
        const page = parseInt(req.query.page as string) || 1;
        const limit = 6;
        const result = await productsModel.searchProducts({query : query, page: page, limit: limit});
        return res.status(200).json({
            status: "success",
            data: {
                products: result.data,
                total_pages: result.numberOfPages,
                quantity: result.quantity 
            }
        });

    }
    catch (e){
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}

export async function getLoveStatus (req: Request, res: Response) {
    try {
        const user = (req as any).user;
        const product_id = req.query.product_id as string;
        if (!product_id){
            return res.status(400).json({
                status: "error",
                message: "product_id is required"
            });
        }
        let isLoved = false;
        let total = 0;
        const loveStatus = await productsModel.getLoveStatus(user ? user.user_id : null, parseInt(product_id));
        if (loveStatus){
            isLoved = loveStatus.is_loved;
            total = Number(loveStatus.total_loves);
        }

        
        
        return res.status(200).json({
            status: "success",
            data: {
                is_loved: isLoved,
                total_loves: total
            }
        });
    }
    catch (e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }

}


export async function updateLoveStatus (req: Request, res: Response) {
    try {
        const user = (req as any).user;
        const product_id = req.body.product_id as string;
        const love_status = req.body.love_status as boolean;

        await productsModel.updateLoveStatus(user.user_id, parseInt(product_id), love_status);
        return res.status(200).json({
            status: "success",
            message: "Cập nhật trạng thái yêu thích thành công"
        });
    }
    catch (e){
        console.error(e);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}


export async function getProductQuestions (req: Request, res: Response) {

    const product_id = req.query.product_id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    if (!product_id){
        return res.status(400).json({
            status: "error",
            message: "product_id is required"
        });
    }

    const result = await productsModel.getProductQuestions({product_id: parseInt(product_id), page: page, limit: limit});
    if (!result){
        return res.status(500).json({
            status: "error",
            message: "Error in fetching questions"
        });
    }

    return res.status(200).json({
        status: "success",
        data: result.data,
        totalQuestions: result.total_questions,
    });

}

export async function postProductQuestion (req: Request, res: Response) {

    const user = (req as any).user;
    const product_id = req.body.product_id as string;
    const content = req.body.content as string;
    const question_parent_id = req.body.question_parent_id ? parseInt(req.body.question_parent_id as string) : null;

    if (!product_id || !content){
        return res.status(400).json({
            status: "error",
            message: "product_id and content are required"
        });
    }

    const result = await productsModel.postProductQuestion({
        product_id: parseInt(product_id),
        user_id: user.user_id,
        content: content,
        question_parent_id: question_parent_id
    });


    // Email notificcation to seller 
    const sellerInfo = await productsModel.getSellerOfProduct(parseInt(product_id));
    if (sellerInfo && sellerInfo.user_id !== user.user_id){
        
        const product_name = sellerInfo.product_name;
        const product_name_slug = slugify(product_name);
        const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
        
        const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f4f8;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <!-- Main Container -->
                            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                                
                                <!-- Header with gradient -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #6dd5b8 0%, #52b69a 100%); padding: 32px 40px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">
                                            Câu hỏi mới về sản phẩm
                                        </h1>
                                    </td>
                                </tr>
                                
                                <!-- Content Body -->
                                <tr>
                                    <td style="padding: 40px 40px 30px;">
                                        <p style="margin: 0 0 20px; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                                            Xin chào <strong style="color: #34495e;">${sellerInfo.full_name}</strong>
                                        </p>
                                        
                                        <p style="margin: 0 0 24px; color: #5a6c7d; font-size: 15px; line-height: 1.6;">
                                            Bạn có một câu hỏi mới về sản phẩm:
                                        </p>
                                        
                                        <!-- Product Name Badge -->
                                        <div style="background: linear-gradient(135deg, #e8f5f1 0%, #d4ede5 100%); border-left: 4px solid #52b69a; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
                                            <p style="margin: 0; color: #1a5f4d; font-size: 15px; font-weight: 600;">
                                                ${product_name}
                                            </p>
                                        </div>
                                        
                                        <!-- Question Box -->
                                        <div style="background-color: #fafbfc; border: 1px solid #e1e8ed; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
                                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                Nội dung câu hỏi
                                            </p>
                                            <p style="margin: 0; color: #2c3e50; font-size: 15px; line-height: 1.7; font-style: italic;">
                                                "${content}"
                                            </p>
                                        </div>
                                        
                                        <p style="margin: 0 0 28px; color: #5a6c7d; font-size: 15px; line-height: 1.6;">
                                            Vui lòng trả lời câu hỏi này để tương tác tốt hơn với khách hàng của bạn.
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td align="center" style="padding: 0 0 28px;">
                                                    <a href="${productUrl}" style="display: inline-block; background: linear-gradient(135deg, #6dd5b8 0%, #52b69a 100%); color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 10px rgba(82, 182, 154, 0.3); transition: all 0.3s;">
                                                        Xem sản phẩm và trả lời
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative Link -->
                                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 0;">
                                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 13px;">
                                                Hoặc sao chép đường link sau:
                                            </p>
                                            <p style="margin: 0; word-break: break-all;">
                                                <a href="${productUrl}" style="color: #52b69a; font-size: 13px; text-decoration: none;">${productUrl}</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 28px 40px; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 8px; color: #95a5a6; font-size: 14px; line-height: 1.5;">
                                            Trân trọng,
                                        </p>
                                        <p style="margin: 0; color: #2c3e50; font-size: 15px; font-weight: 600;">
                                            Đội ngũ Online Auction
                                        </p>
                                        <p style="margin: 16px 0 0; color: #95a5a6; font-size: 12px; line-height: 1.5;">
                                            Email này được gửi tự động, vui lòng không trả lời trực tiếp.
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
        sendMail(sellerInfo.email, "Câu hỏi mới về sản phẩm của bạn", emailContent);
    }

    // Email notification to user if seller answered them 
    let userInParentQuestion = null;
    if (question_parent_id){
        userInParentQuestion = await productsModel.getUserInParentQuestion(question_parent_id);
    }
    if (userInParentQuestion // This is a reply to a question
        && userInParentQuestion.user_id !== sellerInfo.user_id // Not seller reply to their own question
        && user.user_id === sellerInfo.user_id // The replier is the seller
    ){
        const product_name = sellerInfo.product_name;
        const product_name_slug = slugify(product_name);
        const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
        
        const emailContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f4f8;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <!-- Main Container -->
                            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                                
                                <!-- Header with gradient -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #6dd5b8 0%, #52b69a 100%); padding: 32px 40px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">
                                            Người bán đã trả lời câu hỏi của bạn
                                        </h1>
                                    </td>
                                </tr>
                                
                                <!-- Content Body -->
                                <tr>
                                    <td style="padding: 40px 40px 30px;">
                                        <p style="margin: 0 0 20px; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                                            Xin chào <strong style="color: #34495e;">${userInParentQuestion.full_name}</strong>
                                        </p>
                                        
                                        <p style="margin: 0 0 24px; color: #5a6c7d; font-size: 15px; line-height: 1.6;">
                                            Người bán <strong>${sellerInfo.full_name}</strong> đã trả lời câu hỏi của bạn về sản phẩm:
                                        </p>
                                        
                                        <!-- Product Name Badge -->
                                        <div style="background: linear-gradient(135deg, #e8f5f1 0%, #d4ede5 100%); border-left: 4px solid #52b69a; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
                                            <p style="margin: 0; color: #1a5f4d; font-size: 15px; font-weight: 600;">
                                                ${product_name}
                                            </p>
                                        </div>
                                        
                                        <!-- Your Question Box -->
                                        <div style="background-color: #f8f9fa; border: 1px solid #e1e8ed; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
                                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                Câu hỏi của bạn
                                            </p>
                                            <p style="margin: 0; color: #5a6c7d; font-size: 15px; line-height: 1.7; font-style: italic;">
                                                "${userInParentQuestion.content}"
                                            </p>
                                        </div>
                                        
                                        <!-- Seller's Answer Box -->
                                        <div style="background-color: #fafbfc; border: 1px solid #52b69a; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
                                            <p style="margin: 0 0 8px; color: #52b69a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                Câu trả lời từ người bán
                                            </p>
                                            <p style="margin: 0; color: #2c3e50; font-size: 15px; line-height: 1.7;">
                                                "${content}"
                                            </p>
                                        </div>
                                        
                                        <p style="margin: 0 0 28px; color: #5a6c7d; font-size: 15px; line-height: 1.6;">
                                            Bạn có thể xem chi tiết và tiếp tục trao đổi với người bán tại trang sản phẩm.
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td align="center" style="padding: 0 0 28px;">
                                                    <a href="${productUrl}" style="display: inline-block; background: linear-gradient(135deg, #6dd5b8 0%, #52b69a 100%); color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 10px rgba(82, 182, 154, 0.3); transition: all 0.3s;">
                                                        Xem trang sản phẩm
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Alternative Link -->
                                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 0;">
                                            <p style="margin: 0 0 8px; color: #7f8c8d; font-size: 13px;">
                                                Hoặc sao chép đường link sau:
                                            </p>
                                            <p style="margin: 0; word-break: break-all;">
                                                <a href="${productUrl}" style="color: #52b69a; font-size: 13px; text-decoration: none;">${productUrl}</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 28px 40px; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 8px; color: #95a5a6; font-size: 14px; line-height: 1.5;">
                                            Trân trọng,
                                        </p>
                                        <p style="margin: 0; color: #2c3e50; font-size: 15px; font-weight: 600;">
                                            Đội ngũ Online Auction
                                        </p>
                                        <p style="margin: 16px 0 0; color: #95a5a6; font-size: 12px; line-height: 1.5;">
                                            Email này được gửi tự động, vui lòng không trả lời trực tiếp.
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
        sendMail(userInParentQuestion.email, "Người bán đã trả lời câu hỏi của bạn", emailContent);
    }

    if (!result){
        return res.status(500).json({
            status: "error",
            message: "Error in posting question"
        });
    }

    return res.status(201).json({
        status: "success",
        message: "Question posted successfully",
        data: result
    });

}


export async function getRelatedProducts (req: Request, res: Response) {
    try{
        const category_id = req.query.category_id as string;
        const product_id = req.query.product_id as string;
        const limit = req.query.limit ? parseInt (req.query.limit as string) : 5;
        if (!category_id){
            return res.status(400).json({
                status: "error",
                message: "category_id is required"
            });
        }
        const products = await productsModel.getRelatedProducts({
            category_id: parseInt(category_id),
            product_id: product_id ? parseInt(product_id) : null,
            limit: limit
        })
        return res.status(200).json({
            status: "success",
            data: products
        });
    }
    catch (err){
    }
}


export async function updateProductDescription (req: Request, res: Response) {
    try{
        const user = (req as any).user;
        const product_id = req.body.product_id as number;
        const newDescription = req.body.description as string;
        const promise = await productsModel.updateProductDescription({
            product_id: product_id,
            seller_id: user.user_id,
            new_description: newDescription
        });

        if (!promise){
            return res.status(500).json({
                status: "error",
                message: "Error in updating product description"
            });
        }
        if (promise.status === "403"){
            return res.status(403).json({
                status: "error",
                message: promise.message
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Cập nhật mô tả sản phẩm thành công"
        });
    }   
    catch (err){
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Lỗi máy chủ"
        });
    }
}