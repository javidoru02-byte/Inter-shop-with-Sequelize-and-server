const path = require("path");
const { execFileSync } = require("child_process");
const { Client } = require("pg");
const config = require("../config/config").development;
const { dbHint } = require("./dbHints");

const root = path.resolve(__dirname, "../..");
const cli = require.resolve("sequelize-cli/lib/sequelize");
const runCli = (...args) => execFileSync(process.execPath, [cli, ...args], { cwd: root, stdio: "inherit" });

const connect = async (database) => {
  const client = new Client({
    user: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
    database,
  });
  await client.connect();
  return client;
};

(async () => {
  try {
    const admin = await connect("postgres");
    const { rowCount } = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [config.database]);
    if (rowCount) {
      console.log(`Database "${config.database}" already exists`);
    } else {
      await admin.query(`CREATE DATABASE "${config.database.replace(/"/g, '""')}"`);
      console.log(`Database "${config.database}" created`);
    }
    await admin.end();

    runCli("db:migrate");

    const db = await connect(config.database);
    const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM brands");
    await db.end();
    if (rows[0].count) {
      console.log("Seed data already present, skipping seeders (use npm run db:reset to recreate)");
    } else {
      runCli("db:seed:all");
    }
    console.log("Database is ready");
  } catch (error) {
    if (error.status !== undefined) process.exit(1);
    console.error(`\nSetup failed: ${error.message}\nHint: ${dbHint(error)}`);
    process.exit(1);
  }
})();
