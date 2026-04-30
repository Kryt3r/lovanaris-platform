"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, EyeOff, Database, Trash2, Server, Globe, Mail } from "lucide-react";

export default function LovanarisDatenschutzPage() {
  const sections = [
    {
      title: "Maximale Datensparsamkeit",
      icon: <EyeOff size={24} />,
      content: "Im Rahmen von Lovanaris werden konsequent keine personenbezogenen Daten erhoben. Wir verlangen keine Namen, E-Mail-Adressen oder Social-Media-Profile. Deine Geschichte steht für sich allein."
    },
    {
      title: "Keine IP-Speicherung",
      icon: <Lock size={24} />,
      content: "Technisch bedingt werden beim Absenden des Formulars absolut keine IP-Adressen, User-Agents oder Standortdaten in unserer Datenbank gespeichert. Deine Anonymität ist systemseitig garantiert."
    },
    {
      title: "Speicherung & Zugriff",
      icon: <Database size={24} />,
      content: "Deine Geschichte wird verschlüsselt auf Servern in Deutschland gespeichert. Nur die redaktionelle Leitung hat Zugriff auf die Rohdaten, um diese vor einer Veröffentlichung final zu anonymisieren."
    },
    {
      title: "Löschung & Widerruf",
      icon: <Trash2 size={24} />,
      content: "Löschungen sind jederzeit möglich, sofern du deinen 6-stelligen Identifikations-Code besitzt. Ohne diesen Code ist eine Zuordnung deiner Daten systembedingt unmöglich, da wir keine Metadaten speichern."
    },
    {
      title: "Schutz vor Missbrauch",
      icon: <Lock size={24} />,
      content: "Zur Verhinderung von Spam und Brute-Force-Angriffen nutzen wir ein anonymisiertes Rate-Limiting. Deine IP-Adresse wird dabei mittels SHA-256 in einen kryptografischen Hash-Wert umgewandelt. Dieser 'Fingerabdruck' wird getrennt von den Geschichten gespeichert und dient nur dazu, automatisierte Angriffe zu blockieren. Eine Rückführung auf deine Person ist systemseitig ausgeschlossen."
    },
    {
      title: "Hosting & Standort",
      icon: <Server size={24} />,
      content: "Diese Website wird bei All-Inkl.com auf Servern in Deutschland gehostet. Es gelten die strengen deutschen Datenschutzgesetze und die DSGVO. Es findet kein Datentransfer in Drittländer statt."
    }
  ];

  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lovanaris-section-label">
          DSGVO & Datensicherheit
        </motion.div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Deine Daten. Dein Schutz.</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem" }}>
          Transparenz ist die Basis für Vertrauen. Hier erfährst du exakt, was mit deinen Informationen passiert.
        </p>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "2rem" }}>
        {sections.map((section, index) => (
          <motion.section 
            key={index} 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lovanaris-card"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", color: "var(--lovanaris-primary)" }}>
              {section.icon}
              <h2 style={{ fontSize: "1.25rem", color: "white" }}>{section.title}</h2>
            </div>
            <p style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.6" }}>{section.content}</p>
          </motion.section>
        ))}

        <div className="lovanaris-legal-block" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <Mail size={20} color="var(--lovanaris-primary)" />
            <h3 style={{ color: "white", margin: 0 }}>Kontakt für Datenschutzfragen</h3>
          </div>
          <p>Bei Fragen zur Datenverarbeitung kannst du dich an <strong>contact@lovanaris.de</strong> wenden. Bitte beachte, dass wir ohne deinen Code keine Auskunft über spezifische Einsendungen geben können.</p>
        </div>
      </div>
    </div>
  );
}
