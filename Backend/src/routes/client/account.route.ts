import * as accountController from "../../controllers/client/account.controller.ts";
import * as accountValidate from "../../validates/client/account.validate.ts";
import * as accountMiddleware from "../../middlewares/client/account.middleware.ts";
import express from "express";
const route = express.Router();

route.post(
  "/register",
  accountValidate.registerPost,
  accountController.registerPost
);

route.get("/verify-account", accountController.verifyAccount);

route.post(
  "/verify-register",
  // accountValidate.registerVerifyPost,
  accountMiddleware.verifyOtpToken,
  accountController.registerVerifyPost
);

route.post(
  "/forgot-password",
  // accountValidate.registerVerifyPost,
  accountController.forgotPasswordPost
);

route.post("/login", accountValidate.loginPost, accountController.loginPost);

// route.post("/refresh-token", accountController.refreshToken);

export default route;
