import { Response } from "express";
import { AccountRequest } from "../../interfaces/request.interface.ts";

export function getMeInfo(req: AccountRequest, res: Response) {
  res.json({
    data: {
      user_id: req.user.user_id,
      role: req.user.role,
      email: req.user.email,
      full_name: req.user.full_name,
      username: req.user.username,
      rating: req.user.rating,
      rating_count: req.user.rating_count,
      address: req.user.address,
      date_of_birth: req.user.date_of_birth
    },
  });
}
