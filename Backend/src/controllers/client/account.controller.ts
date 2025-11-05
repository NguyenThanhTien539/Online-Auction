import { Request, Response } from "express";


export const registerPost = async (req: Request, res: Response) => {
  console.log(req.body);

  res.json({
    code: "error",
    message: "Email đã tồn tại trong hệ thống!",
  });
};


export const loginPost = async (req: Request, res: Response) => {
  console.log(req.body);

  res.json({
    code: "error",
    message: "Email đã tồn tại trong hệ thống!",
  });
};
