import * as accountController from "../../controllers/client/account.controller.ts";
import * as accountValidate from "../../validates/client/account.validate.ts";
import { verifyToken } from "../../middlewares/auth.middleware.ts";
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

route.patch("/change-password", verifyToken, accountController.changePassword);
route.post(
  "/verify-change-password",
  verifyToken,
  accountController.verifyChangePassword
);

route.post("/login", accountValidate.loginPost, accountController.loginPost);

route.post("/google-login", accountController.googleLoginPost);

route.post("/logout", verifyToken, accountController.logoutPost);

// route.post("/refresh-token", accountController.refreshToken);

export default route;
