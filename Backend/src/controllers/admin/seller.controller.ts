import { Request, Response } from "express";
import * as profileModel from "../../models/profile.model.ts";
import * as userModel from "../../models/account.model.ts";

export async function applications(req: Request, res: Response) {
  const list = await profileModel.getAllSellerApplications();
  for (const application of list) {
    const user = await userModel.findAcountById(application.user_id);
    application.full_name = user.full_name;
    application.email = user.email;
  }
  res.json({ code: "success", message: "Thành công", list: list });
}

export async function applicationDetail(req: Request, res: Response) {
  console.log(req.params.id);
  const applicationDetail = await profileModel.getSellerApplicationById(
    Number(req.params.id)
  );
  const userInfo = await userModel.findAcountById(applicationDetail.user_id);
  const applicationInfo = {
    ...applicationDetail,
    full_name: userInfo.full_name,
    email: userInfo.email,
    username: userInfo.username,
  };
  console.log("Application Info:", applicationInfo);
  res.json({ code: "success", message: "Thành công", applicationInfo: applicationInfo });
}
