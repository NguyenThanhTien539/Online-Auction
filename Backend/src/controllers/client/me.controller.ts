import { Request, Response } from "express";



export function getMeInfo(req : Request, res : Response) {
    
    res.json({
        data : {
            user_id: (req as any).user.user_id,
            role: (req as any).user.role,
            email: (req as any).user.email,
            full_name: (req as any).user.full_name,
            username: (req as any).user.username,
        }
    });

}