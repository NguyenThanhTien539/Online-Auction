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
  const q = db("upgrade_to_sellers").count("id as count");

  // status = exact match
  if (filter?.status && filter.status !== "all") {
    q.andWhere("status", filter.status);
  }

  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  if (filter?.search) {
    q.andWhereILike("name", `%${filter.search}%`);
  }

  const result = await q;
  return parseInt(result[0].count as string, 10);
}

export async function getAllSellerApplications(
  offset: number,
  limit: number,
  filter: any
) {
  const q = db("upgrade_to_sellers")
    .select("*")
    .orderBy("id", "asc")
    .offset(offset)
    .limit(limit);

  if (filter?.status && filter.status !== "all") {
    q.andWhere("status", filter.status);
  }

  // date range (giả sử lọc theo created_at)
  if (filter?.dateFrom && filter?.dateTo) {
    q.andWhereBetween("created_at", [
      `${filter.dateFrom} 00:00:00`,
      `${filter.dateTo} 23:59:59`,
    ]);
  } else if (filter?.dateFrom) {
    q.andWhere("created_at", ">=", `${filter.dateFrom} 00:00:00`);
  } else if (filter?.dateTo) {
    q.andWhere("created_at", "<=", `${filter.dateTo} 23:59:59`);
  }

  return q;
}

export async function getSellerApplicationById(id: number) {
  return await db("upgrade_to_sellers").select("*").where({ id }).first();
}
