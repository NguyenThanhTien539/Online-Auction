import db from "./src/config/database.config.ts";
import { playBid, isMaxPriceValid } from "./src/models/bid.model.ts";

async function simulateAuction() {
  const productId = 19;
  const userIds = [18, 19];

  // Check if product exists, if not create test product
  let product = await db("products").where("product_id", productId).first();
  if (!product) {
    await db("products").insert({
      product_id: productId,
      product_name: "Test Auction Product",
      current_price: 1000000, // 1 triệu VNĐ
      step_price: 100000, // Bước giá 100k VNĐ
      seller_id: 19,
      start_time: new Date(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h sau
      description: "Test product for bid simulation",
      auto_extended: false,
      // Add other required fields as needed
    });
    product = await db("products").where("product_id", productId).first();
  } else {
  }

  // Simulate bids
  const bids = [
    {
      user_id: 18,
      max_price: 1200000,
      description: "Bid 1: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 1400000,
      description: "Bid 2: User 19 bids +200k",
    },
    {
      user_id: 18,
      max_price: 1600000,
      description: "Bid 3: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 1900000,
      description: "Bid 4: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 2100000,
      description: "Bid 5: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 3000000,
      description: "Bid 6: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 2600000,
      description: "Bid 7: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 2900000,
      description: "Bid 8: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 3100000,
      description: "Bid 9: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 3400000,
      description: "Bid 10: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 3600000,
      description: "Bid 11: User 18 bids +200k",
    },
    {
      user_id: 19,
      max_price: 3900000,
      description: "Bid 12: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 3800000,
      description: "Bid 13: User 18 reduces to +200k from previous",
    },
    {
      user_id: 19,
      max_price: 4100000,
      description: "Bid 14: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 4000000,
      description: "Bid 15: User 18 reduces to +200k",
    },
    {
      user_id: 19,
      max_price: 4300000,
      description: "Bid 16: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 4200000,
      description: "Bid 17: User 18 reduces to +200k",
    },
    {
      user_id: 19,
      max_price: 4500000,
      description: "Bid 18: User 19 bids +300k",
    },
    {
      user_id: 18,
      max_price: 4400000,
      description: "Bid 19: User 18 reduces to +200k",
    },
    {
      user_id: 19,
      max_price: 4700000,
      description: "Bid 20: User 19 bids +300k",
    },
  ];

  for (let i = 0; i < bids.length; i++) {
    const bid = bids[i];
    // Validate bid
    const isValid = await isMaxPriceValid(productId, bid.max_price);

    if (!isValid) {
      console.log("Skipping invalid bid\n");
      continue;
    }

    // Execute bid
    try {
      const result = await playBid(bid.user_id, productId, bid.max_price);
      console.log("Bid result:", result);

      // Check updated product state
      const updatedProduct = await db("products")
        .where("product_id", productId)
        .first();
      console.log(
        `Updated product: current_price = ${updatedProduct.current_price.toLocaleString()} VNĐ, price_owner_id = ${
          updatedProduct.price_owner_id
        }`
      );

      // Check bidding history
      const history = await db("bidding_history")
        .where("product_id", productId)
        .orderBy("created_at", "desc")
        .limit(3);
      console.log(
        "Recent bidding history:",
        history.map((h: any) => ({
          user_id: h.user_id,
          max_price: h.max_price,
          product_price: h.product_price,
          price_owner_id: h.price_owner_id,
        }))
      );
    } catch (error) {
      console.error("Error executing bid:", error);
    }

    console.log("");
  }

  console.log("=== Simulation Complete ===");

  // Cleanup (optional)
  // await db('bidding_history').where('product_id', productId).del();
  // await db('products').where('product_id', productId).del();
}

simulateAuction().catch(console.error);
