import * as accountController from "../../controllers/client/account.controller.ts";
import * as accountValidate from "../../validates/client/account.validate.ts";
import express from "express";
const route = express.Router();

// This route is /
route.post(
  "/register",
  accountValidate.registerPost,
  accountController.registerPost
);

route.post("/login", accountValidate.loginPost, accountController.loginPost);

route.post("/refresh-token", accountController.refreshToken);

export default route;
