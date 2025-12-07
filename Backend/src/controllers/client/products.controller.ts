import { Request, Response } from "express";
import * as productsModel from "../../models/products.model.ts";
import { uploadToCloudinary } from "../../config/cloud.config.ts";
import fs from "fs";



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
    let {data, numberOfPages} = result;
    return  res.status(200).json({message: "Success", data: data, numberOfPages: numberOfPages});

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
                if (user.role !== "seller" && user.role !== "admin"){
                    return res.status(403).json({
                        status: "error",
                        message: "Access denied: insufficient permissions"
                    });
            }
                result = await productsModel.getMySellingProducts(user.user_id, page);
                break;
            case "my-sold":
                if (user.role !== "seller" && user.role !== "admin"){
                    return res.status(403).json({
                        status: "error",
                        message: "Access denied: insufficient permissions"
                    });
                }
                result = await productsModel.getMySoldProducts(user.user_id, page);
                break;
            case "my-won":
                result = await productsModel.getMyWonProducts(user.user_id, page);
                break;
            case "my-bidding":
                result = await productsModel.getMyBiddingProducts(user.user_id, page);
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
        let {data, numberOfPages} = result ;
        return  res.status(200).json({
            status: "success",
            data: data,
            numberOfPages: numberOfPages
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
        const limit = 4;
        const result = await productsModel.searchProducts({query : query, page: page, limit: limit});
        return res.status(200).json({
            status: "success",
            data: {
                products: result.data,
                total_pages: result.numberOfPages
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