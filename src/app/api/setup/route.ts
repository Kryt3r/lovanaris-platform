import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { createHash } from "crypto";
import { lovanarisAdmins } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 Starte robustes Datenbank-Setup für Lovanaris...");
    
    // 1. Tabellen erstellen (falls nicht vorhanden)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE,
        story TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        admin_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        attempts INT DEFAULT 0,
        last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        blocked_until TIMESTAMP NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lovanaris_contact_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        story_code VARCHAR(20),
        security_token VARCHAR(100),
        validation_note TEXT,
        message TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Spalten-Migrationen
    const migrations = [
      "ALTER TABLE lovanaris_submissions ADD COLUMN user_reply TEXT AFTER admin_message",
      "ALTER TABLE lovanaris_submissions ADD COLUMN locked_by INT AFTER user_reply",
      "ALTER TABLE lovanaris_submissions ADD COLUMN locked_at TIMESTAMP NULL AFTER locked_by",
      "ALTER TABLE lovanaris_submissions ADD COLUMN processed_by INT AFTER locked_at",
      "ALTER TABLE lovanaris_admins ADD COLUMN role VARCHAR(20) DEFAULT 'moderator' NOT NULL AFTER name",
      "ALTER TABLE lovanaris_messages ADD COLUMN admin_id INT AFTER submission_id",
      "ALTER TABLE lovanaris_submissions ADD COLUMN security_token VARCHAR(100) AFTER processed_by"
    ];

    for (const migration of migrations) {
      try {
        await db.execute(sql.raw(migration));
      } catch (e) {}
    }

    // 3. Admin-Account erstellen/aktualisieren
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const pass = url.searchParams.get("pass");
    const role = url.searchParams.get("role") || "moderator";

    if (email && pass) {
      const hashedPassword = createHash("sha256").update(pass + "lovanaris-salt-2024").digest("hex");
      await db.insert(lovanarisAdmins).values({
        email: email.toLowerCase(),
        password: hashedPassword,
        name: "Lovanaris Admin",
        role: role as any
      }).onDuplicateKeyUpdate({ set: { password: hashedPassword, role: role as any } });
      
      return NextResponse.json({ success: true, message: `Admin-Account (${role}) wurde erstellt/aktualisiert.` });
    }

    return NextResponse.json({ success: true, message: "Datenbank erfolgreich synchronisiert." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
