"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Scale, EyeOff, Lock, AlertTriangle, Phone, FileText, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export default function LovanarisRegelwerkPage() {
  const sections = [
    {
      title: "1. Einverständnis & Veröffentlichung",
      icon: <CheckCircle size={24} />,
      content: [
        "Die Teilnahme am Projekt Lovanaris ist absolut freiwillig.",
        "Mit der Einsendung bestätigst du dein Einverständnis mit der anonymisierten redaktionellen Veröffentlichung deiner Geschichte im Rahmen der Projekt-Richtlinien.",
        "Du stimmst zu, dass deine Geschichte redaktionell bearbeitet werden darf (z.B. Kürzung, Änderung von Details wie Namen, Orten oder Berufen zum Schutz deiner Anonymität).",
        "Es besteht kein Anspruch auf Veröffentlichung deiner Einsendung. Wir behalten uns vor, Einsendungen bei Verdacht auf Missbrauch oder fehlende Plausibilität auszuschließen.",
        "Du kannst deine Einwilligung jederzeit widerrufen, sofern du deinen Identifikations-Code noch besitzt. Ohne Code ist eine Zuordnung und damit eine Löschung unmöglich."
      ]
    },
    {
      title: "2. Jugendschutz & Mindestalter",
      icon: <Lock size={24} />,
      content: [
        "Die Teilnahme am Projekt ist grundsätzlich erst ab 18 Jahren gestattet.",
        "Minderjährige benötigen für die Einsendung die ausdrückliche Zustimmung ihrer Erziehungsberechtigten.",
        "Bei Inhalten, die eine akute Gefährdung des Kindeswohls nahelegen, behalten wir uns vor, die Veröffentlichung abzulehnen und auf spezialisierte Kinderschutz-Zentren zu verweisen."
      ]
    },
    {
      title: "3. Akute Krisenfälle & Notrufe",
      icon: <AlertTriangle size={24} />,
      content: [
        "Lovanaris ist kein Krisendienst. Bei akuter Selbst- oder Fremdgefährdung, laufendem Missbrauch oder Kindesmisshandlung erfolgt keine Veröffentlichung.",
        "In solchen Fällen priorisieren wir den Schutz des Lebens und verweisen die Einsendenden an professionelle Hilfsangebote (Polizei, Frauenhäuser, Opferschutz).",
        "Wir behalten uns vor, Einsendungen, die strafrechtlich relevante Falschbeschuldigungen oder gezielte Diffamierung enthalten, konsequent zu löschen."
      ]
    },
    {
      title: "4. Moderations- & Community-Standards",
      icon: <Shield size={24} />,
      content: [
        "Jeder Kommentar unter Lovanaris-Inhalten wird vor der Freigabe manuell geprüft.",
        "Null-Toleranz für: Victim Blaming, Täter-Opfer-Umkehr, Beleidigungen oder Relativierungen.",
        "Die Kommentarfunktion dient dem Austausch von Solidarität, nicht der Ermittlung oder Diskussion von Schuldfragen.",
        "Verdachtsfälle von koordiniertem Missbrauch oder Spam werden sofort blockiert."
      ]
    },
    {
      title: "5. Haftung & Rechtliche Grenzen",
      icon: <Scale size={24} />,
      content: [
        "Lovanaris bietet keine psychologische Betreuung oder Therapie an.",
        "Die Einsendung dient nicht der rechtssicheren Beweissicherung für spätere Gerichtsverfahren.",
        "Wir bieten keine strafrechtliche Beratung oder rechtliche Unterstützung an.",
        "In akuten Gefahrensituationen wende dich bitte immer an die offiziellen Notrufnummern (110 / 112)."
      ]
    }
  ];

  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lovanaris-section-label"
        >
          Regelwerk & Transparenz
        </motion.div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Das Fundament von Lovanaris</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem", lineHeight: "1.6" }}>
          Sicherheit ist kein Zufall. Dieses Regelwerk dient dem Schutz der Einsenderinnen, der Community und der Integrität dieses Projekts.
        </p>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {sections.map((section, index) => (
          <motion.section 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="lovanaris-card"
            style={{ marginBottom: "2rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--lovanaris-primary)" }}>
              {section.icon}
              <h2 style={{ fontSize: "1.5rem", color: "white" }}>{section.title}</h2>
            </div>
            <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {section.content.map((item, i) => (
                <li key={i} style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.5" }}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>
        ))}

        <div style={{ textAlign: "center", marginTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <h3 style={{ marginBottom: "0" }}>Noch Fragen offen?</h3>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "4rem" }}>
            <Link href="/faq" className="btn-lovanaris btn-lovanaris-outline">
              Anonymitäts-Check
            </Link>
            <Link href="/schreiben" className="btn-lovanaris btn-lovanaris-primary">
              Geschichte teilen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
