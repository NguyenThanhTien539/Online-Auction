import db from "../config/database.config.ts";

export async function registerSellerRequest(user_id: number, reason: string) {
    await db.raw(`
        insert into upgrade_to_sellers (user_id, reason, expiry_time)
        values (?, ?, now() + interval '7 days')
    `, [user_id, reason]);
}
export async function checkRegisterSellerRequest(user_id: number) {
    const result = await db.raw(`
        select *
        from upgrade_to_sellers
        where user_id = ? and expiry_time > now()
    `, [user_id]);
    return result.rows.length > 0;
}

export async function editUserProfile(data: any) {
    await db("users").where({ user_id: data.user_id }).update({
        email: data.email,
        full_name: data.full_name,
        address: data.address,
        date_of_birth: data.date_of_birth? new Date(data.date_of_birth) : null
    });

}