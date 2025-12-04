import * as accountController from "../../controllers/client/account.controller.ts";
import * as accountValidate from "../../validates/client/account.validate.ts";
import express from "express";
const route = express.Router();

route.post(
  "/register",
  accountValidate.registerPost,
  accountController.registerPost
);

route.get("/verify-account", accountController.verifyAccount);

route.post("/verify-register", accountController.registerVerifyPost);

route.patch("/verify-forgot-password", accountController.forgotPasswordVerify);

route.post("/forgot-password", accountController.forgotPassword);

route.post("/reset-password", accountController.resetPassword);

route.post("/login", accountValidate.loginPost, accountController.loginPost);

route.post("/logout", accountController.logoutPost);

// route.post("/refresh-token", accountController.refreshToken);

export default route;
