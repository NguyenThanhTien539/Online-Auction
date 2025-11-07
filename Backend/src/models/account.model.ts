import db from "../config/database.config.ts";

export const insertAccount = async (data: Object) => {
  await db("users").insert(data);
};

export const findEmail = async (email: string) => {
  return db("users").select("*").where({ email }).first();
};

export const findPassword = async (password: string) => {
  return db("users").select("*").where({ password }).first();
};




export const insertOtpAndEmail = async (email: string, otp: string) => {
  return db("otp_codes").insert({ email: email, otp: otp });
};
