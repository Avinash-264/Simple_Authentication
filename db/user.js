import { db } from "./index.js";

export async function createSchema() {
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100) NOT NULL,
        age INT NOT NULL
      )`
    );
    console.log("Table created");
  } catch (err) {
    console.error("Schema error:", err.message);
  }
}

createSchema();

