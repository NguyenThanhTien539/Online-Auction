import { Request, Response } from "express";
import * as profileModel from "../../models/profile.model.ts";
import * as userModel from "../../models/account.model.ts";
import * as applicationFormModel from "../../models/application-form.model.ts";

export async function applications(req: Request, res: Response) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const filter = {};
  if (req.query.status) {
    Object.assign(filter, { status: req.query.status });
  }
  if (req.query.dateFrom) {
    Object.assign(filter, { dateFrom: req.query.dateFrom });
  }
  if (req.query.dateTo) {
    Object.assign(filter, { dateTo: req.query.dateTo });
  }
  if (req.query.search) {
    Object.assign(filter, { search: req.query.search });
  }
  const list = await applicationFormModel.getAllSellerApplications(
    (page - 1) * limit,
    limit,
    filter
  );

  for (const application of list) {
    const user = await userModel.findAccountById(application.user_id);
    application.full_name = user.full_name;
    application.email = user.email;
  }
  res.json({ code: "success", message: "Thành công", list: list });
}

export async function applicationDetail(req: Request, res: Response) {
  try {
    const applicationDetail =
      await applicationFormModel.getSellerApplicationById(
        Number(req.params.id)
      );
    const userInfo = await userModel.findAcountById(applicationDetail.user_id);
    const applicationInfo = {
      ...applicationDetail,
      full_name: userInfo.full_name,
      email: userInfo.email,
      username: userInfo.username,
    };
    res.json({
      code: "success",
      message: "Thành công",
      applicationInfo: applicationInfo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: "error", message: "Đơn chi tiết không tồn tại" });
  }
}

export async function setStatus(req: Request, res: Response) {
  try {
    const applicationId = Number(req.params.id);
    const { status } = req.body;
    await applicationFormModel.setApplicationStatus(applicationId, status);
    if (status === "accepted") {
      const application = await applicationFormModel.getSellerApplicationById(
        applicationId
      );
      await profileModel.updateUserRole(application.user_id, "seller");
    }
    res.json({ code: "success", message: "Đã xác nhận đơn thành công" });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Lỗi khi xác nhận đơn" });
  }
}

export async function calTotalApplications(req: Request, res: Response) {
  const filter = {};
  if (req.query.status) {
    Object.assign(filter, { status: req.query.status });
  }

  if (req.query.dateFrom) {
    Object.assign(filter, { dateFrom: req.query.dateFrom });
  }
  if (req.query.dateTo) {
    Object.assign(filter, { dateTo: req.query.dateTo });
  }
  if (req.query.search) {
    Object.assign(filter, { search: req.query.search });
  }
  const total = await applicationFormModel.calTotalApplications(filter);
  res.json({ code: "success", message: "Thành công", total: total });
}
