const app = require("./app");
const { sequelize } = require("./db/models");
const { dbHint } = require("./scripts/dbHints");

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query("SELECT 1 FROM brands LIMIT 1");
    console.log("Database connected");
  } catch (error) {
    console.error(`Unable to start server: ${error.message}\nHint: ${dbHint(error)}`);
    process.exit(1);
  }

  app
    .listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
    .on("error", (error) => {
      const hint = error.code === "EADDRINUSE" ? `Port ${PORT} is busy, change PORT in .env` : "";
      console.error(`Unable to start server: ${error.message}${hint ? `\nHint: ${hint}` : ""}`);
      process.exit(1);
    });
})();
