import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AccountModel from "../../models/account.model.ts";
import * as VerifyModel from "../../models/verify.model.ts";
import { generateOTP } from "../../helpers/generate.helper.ts";
import { sendMail } from "../../helpers/mail.helper.ts";

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

  const length = 5;
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

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  delete req.body.otp;
  req.body.username = req.body.fullName;
  console.log(req.body);

  await AccountModel.insertAccount(req.body);

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

  const isPasswordValidate = await bcrypt.compare(
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

  const token = jwt.sign(
    {
      id: existedAccount.id_user,
      email: existedAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    { expiresIn: req.body.rememberPassword ? "2d" : "1d" }
  );

  res.cookie("token", token, {
    maxAge: req.body.rememberPassword
      ? 2 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, //https sets true and http sets false
    sameSite: "lax", //allow send cookie between domains
  });

  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đến website của chúng tôi!",
  });
};
