import { Request } from "express";
export interface AccountRequest extends Request {
  user?: any;
}
