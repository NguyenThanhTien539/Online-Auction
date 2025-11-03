import express from "express";
const route = express.Router();

import accountRoute from "./account.route.ts";
// route.use("/", accountRoute);

route.use("/accounts", accountRoute);

export default route;
