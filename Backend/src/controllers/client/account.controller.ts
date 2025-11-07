import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AccountModel from "../../models/account.model.ts";
import * as VerifyModel from "../../models/verify.model.ts";
import { generateOTP } from "../../helpers/generate.helper.ts";
import { sendMail } from "../../helpers/mail.helper.ts";

// import database from "../../config/database.config.ts";



// Hasing password function
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string>{
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean>{
  return await bcrypt.compare(password, hashedPassword);
}


//  JWT token generation functions

type userPayLoad = {
  id: number;
  role: string;
}


export function generateAccessToken(user : userPayLoad, rememberMe?: boolean){
  const payload = {
    id: user.id,
    role: user.role
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
   { expiresIn: rememberMe ? "3d" : "1d" }
  );
}

const sectionType = ["long", "short"];
export function generateRefreshToken(user : userPayLoad, rememberMe: boolean){
  const payload = {
    id: user.id,
    role: user.role,
    section: rememberMe ? sectionType[0] : sectionType[1]
  };
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
   { expiresIn: rememberMe ? "7d" : "1d" }
  );
}





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

  const title = "Mã OTP xác nhận đăng ký";
  const content = `Mã OTP của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai`;
  sendMail(req.body.email, title, content);

  res.json({
    code: "success",
    message: "Vui lòng nhập mã OTP",
  });
};

export const registerVerifyPost = async (req: Request, res: Response) => {
  await VerifyModel.deleteExpiredOTP();

  const existedRecord = await VerifyModel.findEmailAndOtp(
    req.body.email,
    req.body.otp
  );

  if (!existedRecord) {
    res.json({
      code: "error",
      message: "OTP không hợp lệ!",
    });
    return;
  }

  // const salt = await bcrypt.genSalt(10);
  // req.body.password = await bcrypt.hash(req.body.password, salt);
  req.body.password = await hashPassword(req.body.password);

  delete req.body.otp;
  req.body.username = req.body.fullName;
  console.log(req.body);

  await AccountModel.insertAccount(req.body);


  // Insert into databbase logic here 
  

  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đăng ký thành công",
  });
};

export const forgotPasswordPost = async (req: Request, res: Response) => {
  console.log(req.body);

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


  const accessToken = generateAccessToken (
    {id: existedAccount.id_user, role: existedAccount.role}, req.body.rememberMe
  );


  res.cookie("accessToken", accessToken, {
    maxAge: req.body.rememberMe ? 3 * 24 * 60 * 60 * 1000 :  24 * 60 * 60 * 1000, //3 days or 1 days
    httpOnly: true,
    secure: false, //https sets true and http sets false
    sameSite: "lax", //allow send cookie between domains
  });


  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đến website của chúng tôi!",
  });
};



// export const newTokenRequest = async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken){
//     return res.status(400).json({ code: 'error', message: 'Refresh token is missing' });
//   }   
//   jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err : any, user : any) => {
//     if (err){
//       return res.status(403).json({ code: 'error', message: 'Invalid refresh token' });
//     }
//     const userPayload = { id: (user as any).id, role: (user as any).role };
//     const newAccessToken = generateAccessToken(userPayload);
//     const newRefreshToken = generateRefreshToken(userPayload, (user as any).section === sectionType[0] ? true : false);
    
//     res.cookie('accessToken', newAccessToken, {
//       maxAge: 20 * 60 * 1000, //20 minutes
//       httpOnly: true,
//       secure: false, //https sets true and http sets false
//       sameSite: "lax", //allow send cookie between domains
//     });

//     res.json({
//       code: 'success',
//       message: 'Token refreshed successfully',
//     });
//   });
// }