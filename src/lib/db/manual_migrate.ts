import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  console.log("Creating lovanaris_submissions table...");
  
  const sql = `
    CREATE TABLE IF NOT EXISTS lovanaris_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(10) NOT NULL UNIQUE,
      story TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      admin_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await connection.execute(sql);
    console.log("Table lovanaris_submissions created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await connection.end();
  }
}

migrate();
