"use server";

import { db } from "@/lib/db";
import { eq, and, desc, asc, isNull, or, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { createHash } from "crypto";
import { lovanarisSubmissions, lovanarisRateLimits, lovanarisMessages, lovanarisAdmins } from "@/lib/db/schema";
import { getLovanarisSession } from "./lovanaris-auth";
import nlp from "compromise";

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

  // 3. Adressmuster (Strasse, PLZ, etc.)
  const addressPatterns = [
    /\b(Strasse|Str\.|Allee|Platz|Weg|Gasse|Ring)\s+\d+\b/gi,
    /\b(PLZ|Postleitzahl)\s*\d{5}\b/gi
  ];

  let censored = text.replace(phoneRegex, "[TELEFON ZENSIERT]");
  censored = censored.replace(emailRegex, "[E-MAIL ZENSIERT]");

  addressPatterns.forEach(pattern => {
    censored = censored.replace(pattern, "[ADRESSE ZENSIERT]");
  });

  // 4. NLP-basierte Erkennung von Namen und Orten (compromise.js)
  const doc = nlp(censored);

  // Personen-Namen ersetzen (von spezifisch zu allgemein)
  const people = doc.people().json();
  people.forEach((person: any) => {
    censored = censored.replace(person.text, "[NAME ZENSIERT]");
  });

  // Orte ersetzen
  const places = doc.places().json();
  places.forEach((place: any) => {
    censored = censored.replace(place.text, "[ORT ZENSIERT]");
  });

  // Organisationen (könnten Arbeitsplätze/Schulen sein)
  const orgs = doc.organizations().json();
  orgs.forEach((org: any) => {
    censored = censored.replace(org.text, "[ORGANISATION ZENSIERT]");
  });

  // 5. Kontext-basierte Zensierung für Namen
  const nameContextPatterns = [
    // Selbstnennung / Identität (alle Konjugationen)
    { pattern: /\b(ich heiße|ich bin|ich war|mein name ist|mein name war|nenne mich|nannte mich|werde genannt|wurde genannt|ich bin die|ich bin der|ich war die|ich war der)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Andere Personen nennen (alle Formen)
    { pattern: /\b(er heißt|er hieß|sie heißt|sie hieß|er ist|er war|sie ist|sie war|mein freund|meine freundin|mein partner|meine partnerin|mein mann|meine frau|mein ex|meine ex|mein chef|meine chefin|mein kollege|meine kollegin|mein arzt|meine ärztin|mein therapeut|meine therapeutin|mein anwalt|meine anwältin|mein lehrer|meine lehrerin|mein nachbar|meine nachbarin|mein mitbewohner|meine mitbewohnerin)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Familie (alle Verwandtschaftsgrade + Zeitformen)
    { pattern: /\b(mein vater|meine mutter|mein bruder|meine schwester|mein sohn|meine tochter|mein onkel|meine tante|mein cousin|meine cousine|mein opa|meine oma|mein schwager|meine schwägerin|mein neffe|meine nichte|mein enkel|meine enkelin|mein stiefvater|meine stiefmutter|mein stiefbruder|meine stiefschwester|mein patenonkel|meine patentante|mein großvater|meine großmutter|mein schwiegervater|meine schwiegermutter)\s+(?:heißt|hieß|ist|war|hießt)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Täter / Gewaltkontext (erweitert)
    { pattern: /\b(mein vergewaltiger|mein peiniger|mein stalker|mein missbraucher|mein angreifer|der täter|die täterin|der peiniger|die peinigerin|der missbraucher|die missbraucherin|der stalker|die stalkerin|der angreifer|die angreiferin|der gewalttäter|die gewalttäterin|mein quäler|die quälerin)\s+(?:heißt|hieß|ist|war)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Besitzformen (erweitert)
    { pattern: /\b(von|bei|mit|zu|für|durch|wegen|wegen)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:gesehen|getroffen|gewohnt|gearbeitet|gelernt|gewesen|gekannt|erlebt|erzählt|berichtet)\b/gi, group: 2 },
    // Anreden (erweitert)
    { pattern: /\b(herr|frau|dr\.?|prof\.?|doktor|professor|professorin)\s+([A-Z][a-zA-Z]+(?:\s*[-]?\s*[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Verb + Name (erweitert)
    { pattern: /\b(kenne|kannte|wusste|wußte|traf|begegnete|sah|gesehen|nannte|nannten|rief|riefen|nannten)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Genitiv / Besitz
    { pattern: /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)(?:s|'s)\s+(?:haus|wohnung|auto|handy|computer|laptop|zimmer|tür|fenster|garten|arbeit|schule|uni)\b/gi, group: 1 },
    // Mit-Angaben
    { pattern: /\b(zusammen mit|mit|ohne|neben|bei|an|vor|hinter)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:gewesen|gewohnt|gearbeitet|gelebt|gesessen|gestanden|geschlafen)\b/gi, group: 2 },
  ];

  nameContextPatterns.forEach(({ pattern, group }) => {
    censored = censored.replace(pattern, (match, ...args) => {
      const name = args[group - 1];
      // Nur ersetzen wenn es wie ein Name aussieht (nicht zu kurz, nicht allgemeines Wort)
      if (name && name.length >= 2 && !/^(Der|Die|Das|Ein|Eine|Ich|Du|Er|Sie|Es|Wir|Ihr|Und|Oder|Aber|Denn|Wenn|Weil|Obwohl|Damit|Indem|Nachdem|Als|Während|Seit|Bis|Bevor|Seitdem)$/i.test(name)) {
        return match.replace(name, "[NAME ZENSIERT]");
      }
      return match;
    });
  });

  // 6. Kontext-basierte Zensierung für Orte
  const placeContextPatterns = [
    // Wohnort / Herkunft (alle Zeitformen)
    { pattern: /\b(ich wohne in|ich wohnte in|ich lebe in|ich lebte in|ich komme aus|ich kam aus|mein zuhause ist|mein zuhause war|meine heimat ist|meine heimat war|mein wohnort ist|mein wohnort war|aufgewachsen in|geboren in|zurückgezogen in|gezogen nach|umgezogen nach)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Andere Orte (alle Personen + Zeitformen)
    { pattern: /\b(er wohnt in|er wohnte in|sie wohnt in|sie wohnte in|er lebt in|er lebte in|sie lebt in|sie lebte in|er kommt aus|er kam aus|sie kommt aus|sie kam aus|sein zuhause ist|sein zuhause war|ihr zuhause ist|ihr zuhause war|wohnten in|lebten in|waren in|war in)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Treffen / Ereignisse (erweitert)
    { pattern: /\b(getroffen in|getroffen zu|passiert in|geschah in|passierte in|war in|war zu|befand mich in|befand sich in|befanden sich in|war zu hause in|war bei mir in|passierte bei|geschah bei|passierte vor|geschah vor)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Arbeit / Schule (alle Zeitformen + Personen)
    { pattern: /\b(arbeite in|arbeitete in|arbeiteten in|job in|jobbte in|stelle in|schule in|uni in|universität in|studium in|ausbildung in|praktikum in|arbeitet in|arbeiten in|gearbeitet in|jobben in|gelernt in|studiert in)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Regionale Angaben (erweitert)
    { pattern: /\b(aus der nähe von|in der nähe von|bei|in der region|im raum|im bezirk|im stadtteil|im ortsteil|im kreis|im landkreis|im gebiet|im bereich|in der gegend von|in der umgebung von)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Spezifische Ortsangaben mit Präpositionen (erweitert)
    { pattern: /\b(nach|von|aus|durch|über|unter|vor|hinter|neben|zwischen|in|zu)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+(?:gefahren|gereist|gegangen|gelaufen|gekommen|gezogen|umgezogen|geflogen|gefahren|gereist|verschwunden|geflohen)\b/gi, group: 2 },
    // Wohnen-Verben mit direktem Objekt
    { pattern: /\b(wohnte|gewohnt|gelebt|lebte|aufgehalten|aufhielt|untergekommen|untergebracht)\s+(?:in|bei|zu|auf|an)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Damals / früher Angaben
    { pattern: /\b(damals|früher|ehemals|vormals|einmal|lange|jahrelang)\s+(?:in|zu|bei|auf|an)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
    // Aktuell / jetzt
    { pattern: /\b(jetzt|aktuell|momentan|derzeit|zurzeit|heute|hier)\s+(?:in|zu|bei|auf|an)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/gi, group: 2 },
  ];

  placeContextPatterns.forEach(({ pattern, group }) => {
    censored = censored.replace(pattern, (match, ...args) => {
      const place = args[group - 1];
      // Nur ersetzen wenn es wie ein Ort aussieht
      if (place && place.length >= 3 && !/^(Der|Die|Das|Ein|Eine|Ich|Du|Er|Sie|Es|Wir|Ihr|Und|Oder|Aber|Denn|Wenn|Weil|Obwohl|Damit|Indem|Nachdem|Als|Während|Seit|Bis|Bevor|Seitdem|Sehr|Viel|Wenig|Mehr|Weniger|Gut|Schlecht|Hier|Dort|Überall|Nirgends)$/i.test(place)) {
        return match.replace(place, "[ORT ZENSIERT]");
      }
      return match;
    });
  });

  // 7. Spezifische Institutionen / Schulen / Firmen
  const institutionPatterns = [
    { pattern: /\b([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]+)*\s+(?:Grundschule|Hauptschule|Realschule|Gymnasium|Gesamtschule|Förderschule|Berufsschule|Universität|Hochschule|FH|Fachhochschule|Kita|Kindergarten|Krippe|Schule))\b/g, type: "SCHULE" },
    { pattern: /\b([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]+)*\s+(?:GmbH|AG|KG|OHG|e\.V\.|eV|e\.V|UG|Ltd|Inc|Corp|Company))\b/g, type: "FIRMA" },
    // Arbeitgeber-Kontexte (alle Zeitformen und Personen)
    { pattern: /\b(arbeite bei|arbeitete bei|arbeiteten bei|job bei|jobbte bei|stelle bei|angestellt bei|angestellt gewesen bei|beschäftigt bei|beschäftigt gewesen bei|arbeitet bei|gearbeitet bei|gearbeitet habe bei|gearbeitet hatte bei|jobben bei|gejobbt bei)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/gi, group: 2, type: "ARBEITGEBER" },
    // Für-Angaben
    { pattern: /\b(arbeiten für|arbeitete für|arbeiteten für|gearbeitet für|job für|jobbte für|stelle für|angestellt für|beschäftigt für|jobben für|gejobbt für)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/gi, group: 2, type: "ARBEITGEBER" },
    // Als-Angaben (bei Firmen)
    { pattern: /\b(als\s+(?:angestellter|angestellte|mitarbeiter|mitarbeiterin|azubi|auszubildender|auszubildende|praktikant|praktikantin|chef|chefin|leiter|leiterin|geschäftsführer|geschäftsführerin))\s+(?:bei|für|in|auf)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/gi, group: 2, type: "ARBEITGEBER" },
    // Mein Job / Meine Stelle
    { pattern: /\b(mein job|meine stelle|meine arbeit|mein arbeitgeber|meine firma|mein betrieb|mein chef|meine chefin)\s+(?:bei|in|war|ist)?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\b/gi, group: 2, type: "ARBEITGEBER" },
    // Hat gearbeitet / hatten gearbeitet
    { pattern: /\b(hat bei|hatte bei|hatten bei|habe bei|hattest bei|hattet bei)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:gearbeitet|gejobbt|angestellt|beschäftigt)\b/gi, group: 2, type: "ARBEITGEBER" },
  ];

  institutionPatterns.forEach(({ pattern, group, type }) => {
    const regex = pattern;
    censored = censored.replace(regex, (match, ...args) => {
      const institution = group ? args[group - 1] : match;
      if (institution && institution.length >= 3) {
        return match.replace(institution, `[${type} ZENSIERT]`);
      }
      return match;
    });
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
