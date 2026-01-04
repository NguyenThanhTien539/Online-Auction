import * as userModel from "../../models/users.model.ts";
import { Request, Response } from "express";
import { sendMail } from "@/helpers/mail.helper.ts";
import bcrypt from "bcryptjs";

export async function list(req: Request, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const filter = {};
    if (req.query.status) {
      Object.assign(filter, { status: req.query.status });
    }

    if (req.query.search) {
      Object.assign(filter, { search: req.query.search });
    }

    const list = await userModel.getUsersWithOffsetLimit(
      (page - 1) * limit,
      limit,
      filter
    );
    res.json({
      code: "success",
      message: "Thành công",
      list: list,
    });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}

export async function calNumberOfUsers(req: Request, res: Response) {
  try {
    const filter = {};
    if (req.query.search) {
      Object.assign(filter, { search: req.query.search });
    }

    if (req.query.status) {
      Object.assign(filter, { status: req.query.status });
    }

    const total = await userModel.calTotalUsers(filter);
    res.json({ code: "success", message: "Thành công", total: total });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}

export async function detail(req: Request, res: Response) {
  try {
    const user_id = Number(req.params.user_id);
    const user = await userModel.getUserById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ code: "error", message: "Người dùng không tồn tại" });
    }
    res.json({ code: "success", message: "Thành công", user: user });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}

export async function editRole(req: Request, res: Response) {
  try {
    const user_id = Number(req.params.user_id);
    const { role, status } = req.body;
    const user = await userModel.getUserById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ code: "error", message: "Người dùng không tồn tại" });
    }
    await userModel.updateUserRole(user_id, role);
    await userModel.updateUserStatus(user_id, status);
    res.json({ code: "success", message: "Cập nhật vai trò thành công" });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}

const NEW_PASSWORD = "OnlineAuction123@";
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const user_id = Number(req.params.user_id);
    const user = await userModel.getUserById(user_id);

    if (!user) {
      return res
        .status(404)
        .json({ code: "error", message: "Người dùng không tồn tại" });
    }

    const title = "Tài khoản của bạn đã được yêu cầu đặt lại mật khẩu";
    const content = `Mật khẩu mới của bạn là: ${NEW_PASSWORD}. Vui lòng đăng nhập và thay đổi mật khẩu ngay lập tức.`;
    sendMail(user.email, title, content);
    const hashedPassword = await hashPassword(NEW_PASSWORD);
    await userModel.resetUserPassword(user_id, hashedPassword);
    // res.clearCookie("accessToken");
    res.json({ code: "success", message: "Reset mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}
