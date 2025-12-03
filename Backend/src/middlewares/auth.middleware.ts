import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as accountModel from "../models/account.model.ts";
// Verify JWT token middlewares

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  const account = await accountModel.findAcountById(decoded?.user_id);

  if (!account) {
    return res.status(403).json({ message: "Invalid access token" });
  }

  (req as any).user = account; // Attach user info to request object
  next();
}

export function verifyRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!allowedRoles.includes((req as any).user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
}
