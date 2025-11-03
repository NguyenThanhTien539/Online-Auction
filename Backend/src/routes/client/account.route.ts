import express from "express";
const route = express.Router();

import * as accountController from "../../controllers/client/account.controller.ts"

route.post("/register", accountController.registerPost);

export default route;
