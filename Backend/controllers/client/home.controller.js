const db = require("../../config/database.config");

module.exports.home = async (req, res) => {
  const categories = await db("categories");
  console.log("Danh sách categories:", categories);
  res.send("hello");
};
