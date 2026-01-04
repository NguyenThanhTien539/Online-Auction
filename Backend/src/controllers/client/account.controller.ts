import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as AccountModel from "../../models/account.model.ts";
import * as VerifyModel from "../../models/verify.model.ts";
import { generateOTP } from "../../helpers/generate.helper.ts";
import { sendMail } from "../../helpers/mail.helper.ts";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";

dotenv.config();

type GoogleIdTokenPayload = {
  email: string;
  name: string;
};

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

// async function verifyCaptcha(token: string) {
//   try {
//     const secretKey = process.env.CAPTCHA_SECRET_KEY as string;

//     const response = await fetch(
//       "https://www.google.com/recaptcha/api/siteverify",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: `secret=${secretKey}&response=${token}`,
//       }
//     );
//     const data = await response.json();
//     console.log("Captcha verification data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error verifying CAPTCHA:", error);
//     return null;
//   }
// }

export async function verifyCaptcha(token: string) {
  try {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;

    // Kiểm tra xem có key chưa, tránh lỗi ngớ ngẩn
    if (!secretKey) {
      console.error("Thiếu CAPTCHA_SECRET_KEY trong file .env");
      return false;
    }

    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    // Log để debug xem Google trả về gì
    // console.log("Google ReCaptcha Response:", data);

    // Chỉ cần trả về true/false cho gọn
    return (data as any).success === true;
  } catch (error) {
    console.error("Lỗi verify CAPTCHA:", error);
    return false; // Có lỗi thì coi như verify thất bại
  }
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
      full_name: req.body.full_name,
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

  const existedRecord = await VerifyModel.findEmailAndOtp(
    `${decoded.email}`,
    req.body.otp
  );

  if (!existedRecord) {
    res.json({
      code: "otp error",
      message: "OTP không hợp lệ!",
    });
    return;
  }

  decoded.password = await hashPassword(decoded.password);

  const finalData = {
    full_name: decoded.full_name,
    email: decoded.email,
    password: decoded.password,
    address: decoded.address,
    username: decoded.full_name,
  };

  await AccountModel.insertAccount(finalData);
  await VerifyModel.deletedOTP(finalData.email);
  res.clearCookie("verified_otp_token");
  res.json({
    code: "success",
    message: "Chúc mừng bạn đã đăng ký thành công",
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const captchaResponse = await verifyCaptcha(req.body.captchaToken);

  if (!captchaResponse) {
    res.json({ code: "error", message: "Captcha không hợp lệ" });
    return;
  }

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

  if (existedAccount.status === "inactive") {
    res.json({
      code: "error",
      message:
        "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
    });
    return;
  }
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
    role: existedAccount.role,
    message: "Chúc mừng bạn đã đến website của chúng tôi!",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const existedEmail = await AccountModel.findEmail(req.body.email);
  if (!existedEmail) {
    res.json({ code: "error", message: "Email không tồn tại" });
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
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "5m",
    }
  );

  const title = "Mã OTP để lấy lại mật khẩu";
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

export const forgotPasswordVerify = async (req: Request, res: Response) => {
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

  const existedRecord = await VerifyModel.findEmailAndOtp(
    `${decoded.email}`,
    req.body.otp
  );

  if (!existedRecord) {
    res.json({
      code: "otp error",
      message: "OTP không hợp lệ!",
    });
    return;
  }
  res.json({
    code: "success",
    message: "Vui lòng nhập lại mật khẩu",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const newPassword = await hashPassword(password);
  await AccountModel.updatePassword(email, newPassword);
  await VerifyModel.deletedOTP(email);

  res.clearCookie("verified_otp_token");
  res.json({
    code: "success",
    message: "Đã đặt lại mật khẩu thành công",
  });
};

export const logoutPost = async (_: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.json({ code: "success", message: "Đăng xuất thành công", data: null });
};

export const googleLoginPost = async (req: Request, res: Response) => {
  try {
    console.log("Google Login Request Body:", req.body);
    const { credential } = req.body;
    const infoUser = jwtDecode<GoogleIdTokenPayload>(credential);

    const existedAccount = await AccountModel.findEmail(
      (infoUser as any).email
    );

    if (existedAccount) {
      console.log("Existed Account:", existedAccount);
      if (existedAccount.password) {
        res.json({
          code: "error",
          message:
            "Tài khoản đã được đăng ký bằng email và mật khẩu. Vui lòng đăng nhập bằng phương thức đó.",
        });
        return;
      }

      const accessToken = generateAccessToken(
        { user_id: existedAccount.user_id, role: existedAccount.role },
        req.body.rememberMe
      );

      res.cookie("accessToken", accessToken, {
        maxAge: req.body.rememberMe
          ? 3 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000, //3 days or 1 days
        httpOnly: true,
        secure: false, //https sets true and http sets false
        sameSite: "lax", //allow send cookie between domains
      });

      res.json({
        code: "success",
        role: existedAccount.role,
        message: "Chúc mừng bạn đã đến website của chúng tôi!",
      });
    } else {
      const finalData: any = {
        full_name: infoUser.name,
        email: infoUser.email,
        username: infoUser.name,
        address: null, // Có thể cập nhật sau
      };

      await AccountModel.insertAccount(finalData);

      const newAccount = await AccountModel.findEmail(infoUser.email);
      const accessToken = generateAccessToken(
        { user_id: newAccount.user_id, role: newAccount.role },
        req.body.rememberMe
      );

      res.cookie("accessToken", accessToken, {
        maxAge: req.body.rememberMe
          ? 3 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000, //3 days or 1 days
        httpOnly: true,
        secure: false, //https sets true and http sets false
        sameSite: "lax", //allow send cookie between domains
      });

      res.json({
        code: "success",
        role: newAccount.role,
        message: "Chúc mừng bạn đã đến website của chúng tôi!",
      });
    }
  } catch (error) {
    console.error("googleLoginPost error:", error);
    res.status(500).json({ code: "error", message: "Internal server error" });
  }
};

// [POST] /accounts/change-password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user_id = (req as any).user.user_id;

    // Kiểm tra user tồn tại
    const existedAccount = await AccountModel.findAcountById(user_id);
    if (!existedAccount) {
      res.json({ code: "error", message: "Tài khoản không tồn tại" });
      return;
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await comparePassword(
      currentPassword,
      existedAccount.password
    );

    if (!isPasswordValid) {
      res.json({
        code: "error",
        message: "Mật khẩu hiện tại không đúng",
      });
      return;
    }

    // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
    const isSamePassword = await comparePassword(
      newPassword,
      existedAccount.password
    );

    if (isSamePassword) {
      res.json({
        code: "error",
        message: "Mật khẩu mới phải khác mật khẩu hiện tại",
      });
      return;
    }

    // Xóa OTP hết hạn
    await VerifyModel.deleteExpiredOTP();

    // Xóa OTP cũ của email này (nếu có)
    await VerifyModel.deletedOTP(existedAccount.email);

    // Xóa cookie change_password_token cũ (nếu có)
    res.clearCookie("change_password_token");

    // Tạo OTP
    const length = 6;
    const otp = generateOTP(length);

    // Lưu OTP vào DB
    await VerifyModel.insertOtpAndEmail(existedAccount.email, otp);

    // Tạo token chứa thông tin để verify sau
    const change_password_token = jwt.sign(
      {
        otp: otp,
        email: existedAccount.email,
        user_id: user_id,
        newPassword: newPassword,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "5m",
      }
    );

    // Gửi email OTP
    const title = "Mã OTP xác nhận đổi mật khẩu";
    const content = `Mã OTP của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai`;
    sendMail(existedAccount.email, title, content);

    // Set cookie
    res.cookie("change_password_token", change_password_token, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      code: "success",
      message: "Mã OTP đã được gửi đến email của bạn",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

// [POST] /accounts/verify-change-password
export const verifyChangePassword = async (req: Request, res: Response) => {
  try {
    await VerifyModel.deleteExpiredOTP();

    const change_password_token = req.cookies.change_password_token;
    if (!change_password_token) {
      res.json({ code: "error", message: "Phiên làm việc đã hết hạn" });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(
      change_password_token,
      `${process.env.JWT_SECRET}`
    ) as JwtPayload;

    // Kiểm tra OTP có đúng không
    const existedRecord = await VerifyModel.findEmailAndOtp(
      decoded.email,
      req.body.otp
    );

    if (!existedRecord) {
      res.json({
        code: "otp error",
        message: "OTP không hợp lệ!",
      });
      return;
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await hashPassword(decoded.newPassword);

    // Cập nhật mật khẩu mới vào DB
    await AccountModel.updatePassword(decoded.email, hashedNewPassword);

    // Xóa OTP đã sử dụng
    await VerifyModel.deletedOTP(decoded.email);

    // Xóa cookie
    res.clearCookie("change_password_token");

    res.json({
      code: "success",
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Verify change password error:", error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};
