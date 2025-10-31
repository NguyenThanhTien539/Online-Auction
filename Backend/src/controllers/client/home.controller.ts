// import { Request, Response } from "express";
// import db from "../../config/database.config.ts";

// var home = async ( _ : Request, res : Response) => {
//   const categories = await db("categories");
//   console.log("Danh sách categories:", categories);
//   res.send("hello");
// };
var home : any = async ( _ : any, res : any) => {
  res.send("hello");
}

export default home;