import { Request, Response } from "express";
import * as productsModel from "../../models/products.model.ts";


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
    console.log("Products fetched: ", result);
    return  res.status(200).json({message: "Success", data: result});

}