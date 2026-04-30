"use server";
// Trigger Vercel Build - Independent Auth Finalized

import { db } from "@/lib/db";
import { eq, and, gt } from "drizzle-orm";
import { lovanarisAdmins, lovanarisSessions } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "lovanaris_session_token";

export async function loginLovanarisAction(data: { email: string; password: string }) {
  try {
    const hashedPassword = createHash("sha256").update(data.password + "lovanaris-salt-2024").digest("hex");
    
    const admins = await db
      .select()
      .from(lovanarisAdmins)
      .where(and(
        eq(lovanarisAdmins.email, data.email.toLowerCase()),
        eq(lovanarisAdmins.password, hashedPassword)
      ))
      .limit(1);

    if (admins.length === 0) return { success: false, error: "Ungültige Anmeldedaten." };

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 Tage

    await db.insert(lovanarisSessions).values({
      adminId: admins[0].id,
      token,
      expiresAt
    });

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/"
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Anmeldung fehlgeschlagen." };
  }
}

export async function getLovanarisSession() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db
    .select({
      session: lovanarisSessions,
      admin: lovanarisAdmins
    })
    .from(lovanarisSessions)
    .innerJoin(lovanarisAdmins, eq(lovanarisSessions.adminId, lovanarisAdmins.id))
    .where(and(
      eq(lovanarisSessions.token, token),
      gt(lovanarisSessions.expiresAt, new Date())
    ))
    .limit(1);

  if (session.length === 0) return null;
  return session[0];
}

export async function logoutLovanarisAction() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(lovanarisSessions).where(eq(lovanarisSessions.token, token));
  }
  (await cookies()).delete(SESSION_COOKIE_NAME);
  return { success: true };
}
