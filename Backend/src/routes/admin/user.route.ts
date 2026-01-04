import express from "express";
const route = express.Router();
import * as userController from "../../controllers/admin/user.controller.ts";

route.get("/list", userController.list);

route.get("/number-of-users", userController.calNumberOfUsers);

route.get("/detail/:user_id", userController.detail);

route.patch("/edit-role/:user_id", userController.editRole);

route.patch("/reset-password/:user_id", userController.resetPassword);

export default route;
