import db from "../config/database.config.ts";



export async function getUserById(user_id: number) {
    const query = await db.raw(`
        select * from users where user_id = ?`, [user_id]);
    const result = await query.rows[0];
    return result;
}