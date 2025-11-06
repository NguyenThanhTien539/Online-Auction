import express from "express";
const route = express.Router();



import homeController from "../../controllers/client/home.controller.ts";


route.get("/", homeController);

export default route;


