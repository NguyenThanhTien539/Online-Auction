import { NextFunction, Request, Response } from "express";



export default function verifyRole(...allowedRoles: string[]){

    return (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).user){
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if(!allowedRoles.includes((req as any).user.role)){
            return  res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    }
}



