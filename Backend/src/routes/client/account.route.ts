import * as accountController from "../../controllers/client/account.controller.ts";
import * as accountValidate from "../../validates/client/account.validate.ts";
import express from "express";
const route = express.Router();

route.post(
  "/register",
  accountValidate.registerPost,
  accountController.registerPost
);

route.post(
  "/verify-register",
  // accountValidate.registerVerifyPost,
  accountController.registerVerifyPost
);

route.post("/login", accountValidate.loginPost, accountController.loginPost);

export default route;
