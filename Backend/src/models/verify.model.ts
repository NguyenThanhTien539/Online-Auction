import db from "../config/database.config.ts";

export const insertOtpAndEmail = async (email: string, otp: string) => {
  return db("otp_codes").insert({ email: email, otp: otp });
};

export const findEmail = async (email: string) => {
  return db("otp_codes").select("*").where({ email }).first();
};

  export const findEmailAndOtp = async (email: string, otp: string) => {
    return db("otp_codes").select("*").where({ email, otp }).first();
  };

export const deleteExpiredOTP = async () => {
  return db("otp_codes")
    .whereRaw("otp_expiry + interval '2 minutes' < now()")
    .del();
};
