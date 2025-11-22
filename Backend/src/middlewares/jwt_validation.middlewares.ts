import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import * as accountModel from "../models/account.model.ts";
// Verify JWT token middlewares

export default async function verifyToken(req: Request, res: Response, next: NextFunction){
    // Get Token from cookies
    const token = req.cookies.accessToken;
    if (!token){
    return res.status(401).json({ message: 'Access token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    const account = await accountModel.findAcountById(decoded?.user_id);
    
    if (!account){
        return res.status(403).json({ message: 'Invalid access token' });
    }

    (req as any).user = account; // Attach user info to request object
    next();


}

