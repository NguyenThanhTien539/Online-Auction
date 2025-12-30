import {Response, Request} from 'express';
import * as topProductsModel from '../../models/top_products.model.ts';



export async function getTopHighestPriceProducts(req: Request, res: Response) {
    try{
        const limit = parseInt(req.query.limit as string) || 5;
        const products =  await topProductsModel.fetchTopHighestPriceProducts(limit);
        return  res.status(200).json({status: 'success', data: products});
    }
    catch (err){
        return res.status(500).json({status: 'error', message: 'Internal server error'});
    }
}

export async function getTopMostBidProducts(req: Request, res: Response) {
    try{
        const limit = parseInt(req.query.limit as string) || 5;
        const products =  await topProductsModel.fetchTopMostBidProducts(limit);
        return  res.status(200).json({status: 'success', data: products});
    }
    catch (err){
        return res.status(500).json({status: 'error', message: 'Internal server error'});
    }
}


export async function getTopEndingSoonProducts(req: Request, res: Response) {
    try{
        const limit = parseInt(req.query.limit as string) || 5;
        const products =  await topProductsModel.fetchTopEndingSoonProducts(limit);
        return  res.status(200).json({status: 'success', data: products});
    }
    catch (err){
        return res.status(500).json({status: 'error', message: 'Internal server error'});
    }
}