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


// Rate user 
export async function rateUser({user_id, rater_id, score, comment}: {user_id: number, rater_id: number, score: number, comment: string}) {

  await db.raw(`
      insert into user_rating (user_id, rater_id, score, comment)
      values (?, ?, ?, ?)
  `, [user_id, rater_id, score, comment])
    
  // Update average rating 
  const allRatings = await db.raw(`
      select 
        count(*) as rating_count, 
        count(case when score >= 1 then 1 end) as positive_rating_count
      from user_rating
      where user_id = ?
    `, [user_id])
  const ratingCount = Number(allRatings.rows[0].rating_count);
  const positiveRatingCount = Number(allRatings.rows[0].positive_rating_count);
  const averageRating = (positiveRatingCount / ratingCount) * 5;

  await db.raw(`
      update users
      set rating = ?, rating_count = ?
      where user_id = ?
  `, [averageRating, ratingCount, user_id])
  
  return ({
    rating: averageRating,
    rating_count: ratingCount
  })
}

export async function getUserRatingCount({user_id, username}: {user_id: number, username: string}) {
  const ratingQuery = await db.raw(`
      select count (*) as rating_count,
        count (case when score >= 1 then 1 end) as positive_rating_count
      from user_rating ur
      left join users u on ur.user_id = u.user_id
      where ur.user_id = ? and u.username = ?
  `, [user_id, username]);
  return ratingQuery.rows[0];
}

export async function getUserRatingHistory({user_id, username, offset, limit}: {user_id: number, username: string, offset: number, limit: number}) {
  const ratingHistoryQuery = await db.raw(`
      select ur.*, rater.username as rater_username, rater.full_name as rater_full_name, count (*) over() as total_count
      from user_rating ur
      left join users rater on ur.rater_id = rater.user_id
      left join users u on ur.user_id = u.user_id
      where ur.user_id = ? and u.username = ?
      order by ur.created_at desc
      offset ? limit ?
  `, [user_id, username, offset, limit]);
  return ratingHistoryQuery.rows;
}



// Admin functions

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
