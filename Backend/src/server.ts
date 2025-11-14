import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import clientRoutes from "./routes/client/index.route.ts";

import adminRoutes from "./routes/admin/index.route.ts";

import variableConfig from "./config/variable.config.ts";
import cookieParser from "cookie-parser";
const app = express();
const port = 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", //allow send cookie so set specific domain
    credentials: true, //allow send cookie
  })
);

var pathAdmin: String = variableConfig.pathAdmin; //set global variable for admin routes
app.use("/", clientRoutes);
app.use(`/${pathAdmin}`, adminRoutes);

app.listen(port, () => {
  console.log(`Your website is running at port: http://localhost:${port}`);
});
//
