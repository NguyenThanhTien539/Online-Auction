import db from "../config/database.config.ts";

export const setApplicationStatus = async (
  application_id: number,
  status: string
) => {
  await db("upgrade_to_sellers")
    .update({ status: status })
    .where({ id: application_id });
};
