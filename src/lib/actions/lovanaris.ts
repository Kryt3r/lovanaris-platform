"use server";

import { db } from "@/lib/db";
import { eq, and, desc, asc, isNull, or, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { lovanarisSubmissions, lovanarisRateLimits, lovanarisMessages, lovanarisAdmins } from "@/lib/db/schema";
import { getLovanarisSession } from "./lovanaris-auth";

// --- SECURITY HELPERS ---

async function getIdentifier() {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
  return createHash("sha256").update(ip + process.env.DATABASE_URL).digest("hex");
}

async function checkRateLimit(actionType: string, limit: number) {
  const identifier = await getIdentifier();
  const now = new Date();

  const record = await db
    .select()
    .from(lovanarisRateLimits)
    .where(and(
      eq(lovanarisRateLimits.identifier, identifier),
      eq(lovanarisRateLimits.actionType, actionType)
    ))
    .limit(1);

  if (record.length > 0) {
    if (record[0].blockedUntil && record[0].blockedUntil > now) {
      const diff = Math.ceil((record[0].blockedUntil.getTime() - now.getTime()) / 60000);
      throw new Error(`Zu viele Versuche. Bitte warte noch ${diff} Minuten.`);
    }
    return record[0];
  }
  return null;
}

async function updateRateLimit(actionType: string, isFailure: boolean, limit: number, blockDurationMinutes: number) {
  const identifier = await getIdentifier();
  const record = await checkRateLimit(actionType, limit);
  const now = new Date();

  if (!record) {
    await db.insert(lovanarisRateLimits).values({
      identifier,
      actionType,
      attempts: isFailure ? 1 : 0,
    });
    return;
  }

  const newAttempts = isFailure ? (record.attempts || 0) + 1 : (record.attempts || 0);
  let blockedUntil = record.blockedUntil;

  if (newAttempts >= limit) {
    blockedUntil = new Date(now.getTime() + blockDurationMinutes * 60000);
  }

  await db.update(lovanarisRateLimits)
    .set({ attempts: newAttempts, blockedUntil, lastAttempt: now })
    .where(eq(lovanarisRateLimits.id, record.id));
}

// --- DATA LEAK PREVENTION (DLP) ---

function censorPII(text: string): string {
  if (!text) return text;
  
  // 1. Telefonnummern (verschiedene Formate)
  const phoneRegex = /(\+?\d{1,4}[\s-]?\(?\d{1,5}\)?[\s-]?\d{1,5}[\s-]?\d{1,5})/g;
  
  // 2. E-Mail Adressen
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  // 3. Verdächtige Namensmuster oder Orte (einfaches Beispiel)
  // Hier könnten wir eine Blacklist oder komplexere Regex einbauen
  const sensitivePatterns = [
    /\b(Strasse|Str\.|Allee|Platz|Weg)\s+\d+\b/gi, // Adressen
    /\b(PLZ|Postleitzahl)\s*\d{5}\b/gi             // PLZ
  ];

  let censored = text.replace(phoneRegex, "[TELEFON ZENSIERT]");
  censored = censored.replace(emailRegex, "[E-MAIL ZENSIERT]");
  
  sensitivePatterns.forEach(pattern => {
    censored = censored.replace(pattern, "[ADRESSE ZENSIERT]");
  });

  return censored;
}

// --- PUBLIC ACTIONS ---

export async function submitStoryAction(data: {
  story: string;
  category: string;
}) {
  "use server";

  try {
    await checkRateLimit("submission", 2);

    const generateUniqueCode = async (): Promise<string> => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let attempts = 0;
      while (attempts < 10) {
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const existing = await db
          .select({ id: lovanarisSubmissions.id })
          .from(lovanarisSubmissions)
          .where(eq(lovanarisSubmissions.code, code))
          .limit(1);
        
        if (existing.length === 0) return code;
        attempts++;
      }
      throw new Error("Konnte keinen einzigartigen Code generieren.");
    };

    if (!data.story || data.story.length < 100) throw new Error("Geschichte zu kurz.");
    if (!data.category) throw new Error("Kategorie fehlt.");

    const generateSecurityToken = () => {
      const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let token = "";
      for (let i = 0; i < 12; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    };

    const uniqueCode = await generateUniqueCode();
    const securityToken = generateSecurityToken();

    await db.insert(lovanarisSubmissions).values({
      code: uniqueCode,
      securityToken: securityToken,
      story: data.story,
      category: data.category,
      status: "pending",
    });

    await updateRateLimit("submission", true, 2, 1440);

    return { success: true, code: uniqueCode, securityToken: securityToken };
  } catch (error: any) {
    console.error("Lovanaris Submission Error:", error);
    return { success: false, error: error.message || "Fehler beim Speichern." };
  }
}

export async function getSubmissionStatusAction(code: string) {
  "use server";

  try {
    await checkRateLimit("status", 5);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = await db
      .select()
      .from(lovanarisSubmissions)
      .where(eq(lovanarisSubmissions.code, code.toUpperCase()))
      .limit(1);

    if (results.length === 0) {
      await updateRateLimit("status", true, 5, 10);
      return { success: false, error: "Keine Geschichte zu diesem Code gefunden." };
    }

    // Fetch Chat History
    const chat = await db
      .select()
      .from(lovanarisMessages)
      .where(eq(lovanarisMessages.submissionId, results[0].id))
      .orderBy(asc(lovanarisMessages.createdAt));

    return { success: true, data: { ...results[0], chat } };
  } catch (error: any) {
    console.error("Lovanaris Status Check Error:", error);
    return { success: false, error: error.message || "Fehler beim Abrufen des Status." };
  }
}

export async function userReplyStoryAction(code: string, reply: string) {
  "use server";
  try {
    await checkRateLimit("status", 5);
    if (!reply || reply.length < 10) throw new Error("Antwort zu kurz.");

    const submission = await db
      .select()
      .from(lovanarisSubmissions)
      .where(eq(lovanarisSubmissions.code, code.toUpperCase()))
      .limit(1);

    if (submission.length === 0) throw new Error("Nicht gefunden.");

    // Check if last message was from admin
    const lastMsg = await db
      .select()
      .from(lovanarisMessages)
      .where(eq(lovanarisMessages.submissionId, submission[0].id))
      .orderBy(desc(lovanarisMessages.createdAt))
      .limit(1);

    if (lastMsg.length > 0 && lastMsg[0].role === "user") {
      throw new Error("Bitte warte auf eine Antwort der Redaktion.");
    }

    // Insert Message
    await db.insert(lovanarisMessages).values({
      submissionId: submission[0].id,
      role: "user",
      content: reply
    });

    // Update main status
    await db.update(lovanarisSubmissions)
      .set({ status: "pending" })
      .where(eq(lovanarisSubmissions.id, submission[0].id));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Fehler beim Senden." };
  }
}

// --- ADMIN ACTIONS ---

async function checkAdmin() {
  const session = await getLovanarisSession();
  if (!session) throw new Error("Nicht autorisiert.");
  return session;
}

export async function adminGetAllSubmissionsAction() {
  "use server";
  try {
    const session = await checkAdmin();
    
    // Fetch submissions with locking info join
    const results = await db
      .select({
        submission: lovanarisSubmissions,
        adminName: lovanarisAdmins.name,
      })
      .from(lovanarisSubmissions)
      .leftJoin(lovanarisAdmins, eq(lovanarisSubmissions.lockedBy, lovanarisAdmins.id))
      .orderBy(desc(lovanarisSubmissions.createdAt));
    
    return { success: true, data: results.map(r => ({ ...r.submission, lockerName: r.adminName })) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminLockSubmissionAction(id: number) {
  "use server";
  try {
    const session = await checkAdmin();
    const now = new Date();

    // Cleanup old locks (> 30 mins)
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    // Check if already locked by someone else
    const current = await db
      .select()
      .from(lovanarisSubmissions)
      .where(eq(lovanarisSubmissions.id, id))
      .limit(1);

    if (current[0].lockedBy && current[0].lockedBy !== session.admin.id && current[0].lockedAt && current[0].lockedAt > thirtyMinsAgo) {
      throw new Error("Dieses Ticket wird bereits von einem anderen Moderator bearbeitet.");
    }

    // Set lock
    await db.update(lovanarisSubmissions)
      .set({ 
        lockedBy: session.admin.id,
        lockedAt: now 
      })
      .where(eq(lovanarisSubmissions.id, id));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUnlockSubmissionAction(id: number) {
  "use server";
  try {
    const session = await checkAdmin();
    await db.update(lovanarisSubmissions)
      .set({ lockedBy: null, lockedAt: null })
      .where(and(eq(lovanarisSubmissions.id, id), eq(lovanarisSubmissions.lockedBy, session.admin.id)));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminGetSubmissionDetailsAction(id: number) {
  "use server";
  try {
    const session = await checkAdmin();
    const submission = await db
      .select()
      .from(lovanarisSubmissions)
      .where(eq(lovanarisSubmissions.id, id))
      .limit(1);
    
    if (submission.length === 0) throw new Error("Nicht gefunden.");

    // Fetch Chat History with Admin Auditing
    const chat = await db
      .select({
        id: lovanarisMessages.id,
        role: lovanarisMessages.role,
        content: lovanarisMessages.content,
        createdAt: lovanarisMessages.createdAt,
        adminName: lovanarisAdmins.name,
        adminRole: lovanarisAdmins.role
      })
      .from(lovanarisMessages)
      .leftJoin(lovanarisAdmins, eq(lovanarisMessages.adminId, lovanarisAdmins.id))
      .where(eq(lovanarisMessages.submissionId, id))
      .orderBy(asc(lovanarisMessages.createdAt));

    // For Super Admin: also fetch who processed it
    let processor = null;
    if (session.admin.role === "super_admin" && submission[0].processedBy) {
      const procResult = await db.select().from(lovanarisAdmins).where(eq(lovanarisAdmins.id, submission[0].processedBy)).limit(1);
      if (procResult.length > 0) processor = procResult[0];
    }

    return { success: true, data: { ...submission[0], chat, processor } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminUpdateSubmissionAction(id: number, data: { status: string; adminMessage?: string }) {
  "use server";
  try {
    const session = await checkAdmin();
    
    // Zensur-Logik (DLP)
    let safeMessage = data.adminMessage ? censorPII(data.adminMessage) : undefined;

    // Update main status and auditing
    await db.update(lovanarisSubmissions)
      .set({ 
        status: data.status as any,
        processedBy: session.admin.id,
        lockedBy: null, // Auto-Unlock after save
        lockedAt: null
      })
      .where(eq(lovanarisSubmissions.id, id));

    // If there's a new message, add to history with Admin Audit ID
    if (safeMessage) {
      await db.insert(lovanarisMessages).values({
        submissionId: id,
        adminId: session.admin.id,
        role: "admin",
        content: safeMessage
      });
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminDeleteSubmissionAction(id: number) {
  "use server";
  try {
    const session = await checkAdmin();
    // Only Super Admin can delete
    if (session.admin.role !== "super_admin") throw new Error("Nur der Hauptadministrator darf Einsendungen löschen.");
    
    await db.delete(lovanarisMessages).where(eq(lovanarisMessages.submissionId, id));
    await db.delete(lovanarisSubmissions).where(eq(lovanarisSubmissions.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
