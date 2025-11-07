import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Verify JWT token middlewares
export default function verifyToken(req: Request, res: Response, next: NextFunction){
    // Get Token from cookies
    const token = req.cookies.accessToken;
    if (!token){
    return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err : any, user : any) => {
    if (err){
        return res.status(403).json({ message: 'Invalid access token' });
    }
    (req as any).user = user; // Attach user info to request object
    next();
    });

}

