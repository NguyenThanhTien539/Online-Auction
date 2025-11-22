import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as AccountModel from "../../models/account.model.ts";
import * as VerifyModel from "../../models/verify.model.ts";
import { generateOTP } from "../../helpers/generate.helper.ts";
import { sendMail } from "../../helpers/mail.helper.ts";
import dotenv from "dotenv";
dotenv.config();

// Hasing password function
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

//  JWT token generation functions

type userPayLoad = {
  user_id: number;
  role: string;
};

export function generateAccessToken(user: userPayLoad, rememberMe?: boolean) {
  const payload = {
    user_id: user.user_id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: rememberMe ? "3d" : "1d",
  });
}

const sectionType = ["long", "short"];
export function generateRefreshToken(user: userPayLoad, rememberMe: boolean) {
  const payload = {
    id: user.user_id,
    role: user.role,
    section: rememberMe ? sectionType[0] : sectionType[1],
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
}

export const verifyAccount = async (req: Request, res: Response) => {
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
  res.json({
    code: "success",
    message: "Mã PIN tồn tại trong 5 phút",
  });
};

export const registerPost = async (req: Request, res: Response) => {
  const existedEmail = await AccountModel.findEmail(req.body.email);
  if (existedEmail) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!",
    });
    return;
  }

  await VerifyModel.deleteExpiredOTP();
  const existedOTP = await VerifyModel.findEmail(req.body.email);

  if (existedOTP) {
    res.json({
      code: "existedOTP",
      message: "OTP đã được gửi và có hạn trong vòng 5 phút!",
    });
    return;
  }

  const length = 6;
  const otp = generateOTP(length);

  await VerifyModel.insertOtpAndEmail(req.body.email, otp);

  const verified_otp_token = jwt.sign(
    {
      otp: otp,
      email: req.body.email,
      fullName: req.body.fullName,
      address: req.body.address,
      password: req.body.password,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "5m",
    }
  );

  const title = "Mã OTP xác nhận đăng ký";
  const content = `Mã OTP của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai`;
  sendMail(req.body.email, title, content);

  res.cookie("verified_otp_token", verified_otp_token, {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    secure: false, //https sets true and http sets false
    sameSite: "lax", //allow send cookie between domains
  });

  res.json({
    code: "success",
    message: "Vui lòng nhập mã OTP",
  });
};

export const registerVerifyPost = async (req: Request, res: Response) => {
  if (!req.verified_otp_token) {
    return res.json({ code: "error", message: "OTP chưa xác thực" });
  }

  await VerifyModel.deleteExpiredOTP();
  const existedRecord = await VerifyModel.findEmailAndOtp(
    `${req.verified_otp_token.email}`,
    req.body.otp
  );
  console.log(req.verified_otp_token.email);
  console.log(req.verified_otp_token.otp);
  if (!existedRecord) {
    res.json({
      code: "otp error",
      message: "OTP không hợp lệ!",
    });
    return;
  }

  req.verified_otp_token.password = await hashPassword(
    req.verified_otp_token.password
  );

  delete req.verified_otp_token.otp;
  req.verified_otp_token.username = req.verified_otp_token.fullName;

  await AccountModel.insertAccount(req.verified_otp_token);

  res.clearCookie("verified_otp_token");
  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đăng ký thành công",
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  const existedEmail = AccountModel.findEmail(req.body.email);
  if (!existedEmail) {
    res.json({
      code: "error",
      message: "Email không hợp lệ",
    });
    return;
  }

  await VerifyModel.deleteExpiredOTP();
  const existedOTP = await VerifyModel.findEmail(req.body.email);

  if (existedOTP) {
    res.json({
      code: "error",
      message: "OTP đã được gửi và có hạn trong vòng 5 phút!",
    });
    return;
  }

  const length = 5;
  const otp = generateOTP(length);

  await VerifyModel.insertOtpAndEmail(req.body.email, otp);

  const title = "Mã OTP đặt lại mật khẩu";
  const content = `Mã OTP của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai`;
  sendMail(req.body.email, title, content);

  res.json({
    code: "success",
    message: "Vui lòng nhập mã OTP",
  });
};

export const loginPost = async (req: Request, res: Response) => {
  console.log(req.body);

  const existedAccount = await AccountModel.findEmail(req.body.email);
  if (!existedAccount) {
    res.json({ code: "error", message: "Email chưa tồn tại trong hệ thống" });
    return;
  }

  const isPasswordValidate = await comparePassword(
    req.body.password,
    existedAccount.password
  );

  if (!isPasswordValidate) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng",
    });
    return;
  }
  console.log ("Login success for user: ", existedAccount);
  const accessToken = generateAccessToken(
    { user_id: existedAccount.user_id, role: existedAccount.role },
    req.body.rememberMe
  );

  res.cookie("accessToken", accessToken, {
    maxAge: req.body.rememberMe ? 3 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, //3 days or 1 days
    httpOnly: true,
    secure: false, //https sets true and http sets false
    sameSite: "lax", //allow send cookie between domains
  });

  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đến website của chúng tôi!",
  });
};

