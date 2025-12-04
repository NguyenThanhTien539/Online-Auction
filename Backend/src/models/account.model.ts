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

export const updatePassword = async (email: string, newPassword: string) => {
  return db("users").where({ email: email }).update({ password: newPassword });
};

export const findAcountById = async (user_id: number) => {
  // const sql = db("users").select("*").where({ user_id }).first();
  const results = await db.raw(
    `
    select *, TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth
    from users
    where user_id = ?
  `,
    [user_id]
  );
  return results.rows[0];
};

export const insertOtpAndEmail = async (email: string, otp: string) => {
  return db("otp_codes").insert({ email: email, otp: otp });
};
