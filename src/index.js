require("dotenv").config({ quiet: true });
const app = require("./app");
const { sequelize } = require("./db/models");

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
})();
