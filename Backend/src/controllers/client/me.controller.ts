import { Request, Response } from "express";



export function getMeInfo(req : Request, res : Response) {
    
    res.json({
        data : {
            user_id: (req as any).user.user_id,
            role: (req as any).user.role,
        }
    });

}