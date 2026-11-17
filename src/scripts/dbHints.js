const fs = require("fs");
const path = require("path");
const config = require("../config/config").development;

const dbHint = (error) => {
  if (!fs.existsSync(path.resolve(__dirname, "../../.env"))) {
    return "File .env not found. Create it: cp .env.example .env and put your PostgreSQL credentials there";
  }
  const code = error.original?.code || error.parent?.code || error.code;
  const target = `${config.username}@${config.host}:${config.port}/${config.database}`;
  switch (code) {
    case "28P01":
    case "28000":
      return `Wrong DB_USER / DB_PASSWORD for ${target}. Put credentials of YOUR local PostgreSQL into .env`;
    case "3D000":
      return `Database "${config.database}" does not exist. Run: npm run db:setup`;
    case "ECONNREFUSED":
      return `PostgreSQL is not reachable at ${config.host}:${config.port}. Start PostgreSQL or fix DB_HOST / DB_PORT in .env`;
    case "42P01":
      return "Tables do not exist. Run: npm run db:setup";
    default:
      return "Check .env (see .env.example) and run: npm run db:setup";
  }
};

module.exports = { dbHint };
