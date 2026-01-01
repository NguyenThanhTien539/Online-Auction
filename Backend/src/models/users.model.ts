import db from "../config/database.config.ts";

export async function getUserById(user_id: number) {
  const query = await db.raw(
    `
        select * from users where user_id = ?`,
    [user_id]
  );
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

export async function calTotalUsers(filter: any) {
  const q = db("users").whereNot({ role: "admin" }).count("user_id as count");

  if (filter?.search) {
    q.andWhere(function (this: any) {
      this.whereRaw(
        `LOWER(REPLACE(TRANSLATE(full_name, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ', 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'), ' ', '-')) LIKE ?`,
        [`%${filter.search}%`]
      ).orWhereRaw(`LOWER(email) LIKE ?`, [`%${filter.search}%`]);
    });
  }

  if (filter?.status && filter.status !== "all") {
    q.andWhere("role", filter.status);
  }
  const result = await q;
  return parseInt(result[0].count as string, 10);
}

export async function getUsersWithOffsetLimit(
  offset: number,
  limit: number,
  filter: any
) {
  const q = db("users")
    .select("*")
    .whereNot({ role: "admin" })
    .orderBy("user_id", "asc")
    .offset(offset)
    .limit(limit);

  if (filter?.search) {
    q.andWhere(function (this: any) {
      this.whereRaw(
        `LOWER(REPLACE(TRANSLATE(full_name, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ', 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'), ' ', '-')) LIKE ?`,
        [`%${filter.search}%`]
      ).orWhereRaw(`LOWER(email) LIKE ?`, [`%${filter.search}%`]);
    });
  }

  if (filter?.status && filter.status !== "all") {
    q.andWhere("role", filter.status);
  }

  const result = await q;
  return result;
}

export async function updateUserRole(user_id: number, role: string) {
  await db("users").where({ user_id }).update({ role });
}
