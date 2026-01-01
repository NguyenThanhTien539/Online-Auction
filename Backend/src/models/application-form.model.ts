import db from "../config/database.config.ts";

export const setApplicationStatus = async (
  application_id: number,
  status: string
) => {
  await db("upgrade_to_sellers")
    .update({ status: status })
    .where({ id: application_id });
};

// status=all&dateFrom=2026-01-08&dateTo=2026-01-09
export async function calTotalApplications(filter: any) {
  const q = db("upgrade_to_sellers as uts")
    .count("uts.id as count")
    .leftJoin("users as u", "uts.user_id", "u.user_id");

  // status = exact match
  if (filter?.status && filter.status !== "all") {
    q.andWhere("uts.status", filter.status);
  }

  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("uts.created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("uts.created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("uts.created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  // Search: slugify full_name hoặc email
  if (filter?.search) {
    q.andWhere(function (this: any) {
      this.whereRaw(
        `LOWER(REPLACE(TRANSLATE(u.full_name, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ', 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'), ' ', '-')) LIKE ?`,
        [`%${filter.search}%`]
      ).orWhereRaw(`LOWER(u.email) LIKE ?`, [`%${filter.search}%`]);
    });
  }

  const result = await q;
  return parseInt(result[0].count as string, 10);
}

export async function getAllSellerApplications(
  offset: number,
  limit: number,
  filter: any
) {
  const q = db("upgrade_to_sellers as uts")
    .select("uts.*")
    .leftJoin("users as u", "uts.user_id", "u.user_id")
    .orderBy("uts.id", "asc")
    .offset(offset)
    .limit(limit);

  if (filter?.status && filter.status !== "all") {
    q.andWhere("uts.status", filter.status);
  }

  // date range (giả sử lọc theo created_at)
  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("uts.created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("uts.created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("uts.created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  // Search: slugify full_name hoặc email
  if (filter?.search) {
    q.andWhere(function (this: any) {
      this.whereRaw(
        `LOWER(REPLACE(TRANSLATE(u.full_name, 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ', 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'), ' ', '-')) LIKE ?`,
        [`%${filter.search}%`]
      ).orWhereRaw(`LOWER(u.email) LIKE ?`, [`%${filter.search}%`]);
    });
  }

  return q;
}

export async function getSellerApplicationById(id: number) {
  return await db("upgrade_to_sellers").select("*").where({ id }).first();
}
