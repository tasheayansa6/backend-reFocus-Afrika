const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Always load backend/.env (works even if run from another folder)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

async function init() {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  };

  if (!config.user) {
    throw new Error("DB_USER is missing in .env (use eyai, not root on Ubuntu).");
  }

  const connection = await mysql.createConnection(config);

  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await connection.query(sql);
  await connection.end();

  console.log("✅ Database ready.");
  console.log(`   User: ${config.user}`);
  console.log(`   DB:   ${process.env.DB_NAME || "eyai_registration"}`);
}

init().catch((err) => {
  console.error("❌ DB init failed:", err.message);
  console.error("   Check backend/.env DB_USER / DB_PASSWORD / DB_HOST");
  process.exit(1);
});
