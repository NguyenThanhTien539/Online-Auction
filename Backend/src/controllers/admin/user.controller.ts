import * as userModel from "../../models/users.model.ts";
import { Request, Response } from "express";

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
    const { role } = req.body;
    const user = await userModel.getUserById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ code: "error", message: "Người dùng không tồn tại" });
    }
    await userModel.updateUserRole(user_id, role);
    res.json({ code: "success", message: "Cập nhật vai trò thành công" });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi máy chủ" });
  }
}
