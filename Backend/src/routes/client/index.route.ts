import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
route.use("/", homeRoute);



export default route;
