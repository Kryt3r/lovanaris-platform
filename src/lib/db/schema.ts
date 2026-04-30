import { relations } from "drizzle-orm";
import { mysqlTable, varchar, text, timestamp, boolean, int, index } from "drizzle-orm/mysql-core";


// --- LOVANARIS SUBMISSIONS ---
export const lovanarisSubmissions = mysqlTable("lovanaris_submissions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  story: text("story").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, approved, rejected, info_needed
  adminMessage: text("admin_message"),
  userReply: text("user_reply"),
  lockedBy: int("locked_by"), // ID des Admins, der gerade bearbeitet
  lockedAt: timestamp("locked_at"),
  processedBy: int("processed_by"), // Letzter Bearbeiter
  securityToken: varchar("security_token", { length: 100 }), // Für Löschanträge
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// --- LOVANARIS CONTACT REQUESTS ---
export const lovanarisContactRequests = mysqlTable("lovanaris_contact_requests", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'deletion', 'general'
  email: varchar("email", { length: 255 }), // Nur bei 'general'
  storyCode: varchar("story_code", { length: 20 }), // Nur bei 'deletion'
  securityToken: varchar("security_token", { length: 100 }), // Nur bei 'deletion'
  validationNote: text("validation_note"), // Für Altfälle oder zusätzliche Infos
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, processed, archived
  createdAt: timestamp("created_at").defaultNow(),
});

// --- RELATIONS ---

export const lovanarisRateLimits = mysqlTable("lovanaris_rate_limits", {
  id: int("id").autoincrement().primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  attempts: int("attempts").default(0),
  lastAttempt: timestamp("last_attempt").defaultNow().onUpdateNow(),
  blockedUntil: timestamp("blocked_until"),
});

export const lovanarisAdmins = mysqlTable("lovanaris_admins", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 20 }).default("moderator").notNull(), // super_admin, moderator
  createdAt: timestamp("created_at").defaultNow(),
});

export const lovanarisSessions = mysqlTable("lovanaris_sessions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lovanaris Chat Messages (Anonymized History)
export const lovanarisMessages = mysqlTable("lovanaris_messages", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submission_id").notNull(),
  adminId: int("admin_id"), // Wer hat die Nachricht gesendet?
  role: varchar("role", { length: 20 }).notNull(), // 'admin' or 'user'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
