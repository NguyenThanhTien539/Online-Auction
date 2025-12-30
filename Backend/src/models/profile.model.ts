import db from "../config/database.config.ts";

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

export async function editUserProfile(data: any) {
  const sql = await db("users")
    .where({ user_id: data.user_id })
    .update({
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      address: data.address,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
    })
    .returning("*");
  return sql;
}

export async function getAllSellerApplications() {
  return await db("upgrade_to_sellers").select("*");
}
export async function getSellerApplicationById(id: number) {
  return await db("upgrade_to_sellers").select("*").where({ id }).first();
}

export async function updateUserRole(user_id: number, role: string) {
  return await db("users").where({ user_id }).update({ role });
}

export async function getUserProfileDetail(params: {
  username: string;
  user_id: number;
  current_user_id: number | null;
}) {
  const isOwner = params.current_user_id === params.user_id;
  const sql = `
  select *
  from users u
  where u.username = ? and u.user_id = ?
  `;
  const result = await db.raw(sql, [params.username, params.user_id]);

  const data = await result.rows[0];
  console.log("Fetched user profile data: ", data);
  if (!data) {
    return null;
  }
  return {
    data: data,
    is_owner: isOwner,
  };
}
