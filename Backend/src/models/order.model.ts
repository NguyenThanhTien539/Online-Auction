import db from "../config/database.config.ts";

export async function createOrder(data: any) {
  try {
    await db("orders").insert(data);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getOrderDetail(user_id: number, product_id: number) {
  try {
    const orderDetail = await db("orders")
      .where({ user_id, product_id })
      .first();
    return orderDetail;
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
}
