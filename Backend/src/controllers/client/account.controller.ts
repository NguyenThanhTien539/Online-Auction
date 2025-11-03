import { Request, Response } from "express";

export const registerPost = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    code: "success",
    message: "Thành công",
  });
};
