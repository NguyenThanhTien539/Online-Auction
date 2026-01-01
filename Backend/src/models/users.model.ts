import db from "../config/database.config.ts";



export async function getUserById(user_id: number) {
    const query = await db.raw(`
        select * from users where user_id = ?`, [user_id]);
    const result = await query.rows[0];
    return result;
}



export async function registerSellerRequest(user_id: number, reason: string) {
  await db.raw(
    `
        insert into upgrade_to_sellers (user_id, reason, expiry_time)
        values (?, ?, now() + interval '7 days')
    `,
    [user_id, reason]
  );
}
export async function checkRegisterSellerRequest(user_id: number) {
  const result = await db.raw(
    `
        select *
        from upgrade_to_sellers
        where user_id = ? and expiry_time > now()
    `,
    [user_id]
  );
  return result.rows.length > 0;
}
