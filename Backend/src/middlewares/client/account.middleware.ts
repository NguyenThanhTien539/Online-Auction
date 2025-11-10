import { Request, Response, NextFunction } from "express";
import * as VerifyModel from "../../models/verify.model.ts";
import jwt, { JwtPayload } from "jsonwebtoken";

interface VerifiedOtpToken {
  email: string;
  otp?: string;
  fullName: string;
  address: string;
  password: string;
  username?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    verified_otp_token?: VerifiedOtpToken;
  }
}

export const verifyOtpToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await VerifyModel.deleteExpiredOTP();
    const verified_otp_token = req.cookies.verified_otp_token;
    if (!verified_otp_token) {
      res.json({ code: "error", message: "Có lỗi xảy ra ở đây" });
      return;
    }
    const decoded = jwt.verify(
      verified_otp_token,
      `${process.env.JWT_SECRET}`
    ) as JwtPayload;
    console.log(decoded);

    const existedOTP = await VerifyModel.findEmailAndOtp(
      decoded.email,
      decoded.otp
    );

    if (!existedOTP) {
      res.clearCookie("verified_otp_token");
      res.json({
        code: "error",
        message: "Có lỗi xảy ra ở đây",
      });
      return;
    }
    req.verified_otp_token = {
      email: decoded.email,
      otp: decoded.otp,
      fullName: decoded.fullName,
      address: decoded.address,
      password: decoded.password,
    };
    next();
  } catch (error) {
    res.clearCookie("verified_otp_token");
    res.json({
      code: "error",
      message: "Có lỗi xảy ra ở đây",
    });
  }
};
