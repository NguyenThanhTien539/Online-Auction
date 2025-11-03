import express from "express";
import dotenv from "dotenv";
dotenv.config();

import clientRoutes from "./routes/client/index.route.ts";

import adminRoutes from "./routes/admin/index.route.ts";

import variableConfig from "./config/variable.config.ts";

const app = express();
const port = 5000;

// Middlewares
app.use(express.json());


var pathAdmin : String = variableConfig.pathAdmin;//set global variable for admin routes



console.log(pathAdmin); 
app.use("/", clientRoutes);
app.use(`${pathAdmin}/`, adminRoutes);

app.listen(port, () => {
  console.log(`Your website is running at port: http://localhost:${port}`);
});
//
