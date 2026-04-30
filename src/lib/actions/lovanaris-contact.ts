"use server";

import { db } from "@/lib/db";
import { lovanarisContactRequests, lovanarisRateLimits } from "@/lib/db/schema";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";

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

export async function submitContactAction(data: {
  type: string;
  email?: string;
  storyCode?: string;
  securityToken?: string;
  validationNote?: string;
  message: string;
}) {
  try {
    await checkRateLimit("contact", 3);

    if (!data.message || data.message.length < 10) throw new Error("Nachricht zu kurz.");
    if (data.type === "general" && !data.email) throw new Error("E-Mail Adresse erforderlich für allgemeine Anfragen.");
    if (data.type === "deletion" && !data.storyCode) throw new Error("Story-Code erforderlich für Löschanträge.");

    await db.insert(lovanarisContactRequests).values({
      type: data.type,
      email: data.email || null,
      storyCode: data.storyCode || null,
      securityToken: data.securityToken || null,
      validationNote: data.validationNote || null,
      message: data.message,
      status: "pending"
    });

    await updateRateLimit("contact", true, 3, 60);

    return { success: true };
  } catch (error: any) {
    console.error("Contact Submission Error:", error);
    return { success: false, error: error.message || "Fehler beim Senden." };
  }
}
