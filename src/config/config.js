const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const base = {
  username: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD ?? ""),
  database: process.env.DB_NAME || "internet_shop_seq",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
  logging: false,
  define: { underscored: true },
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
