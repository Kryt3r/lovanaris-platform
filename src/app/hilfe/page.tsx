"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Heart, Globe, ExternalLink, ShieldCheck, Users, MessageSquare, Info, Lock } from "lucide-react";

const helpData = [
  {
    id: "de",
    country: "Deutschland",
    flag: "🇩🇪",
    resources: [
      {
        name: "Hilfetelefon Gewalt gegen Frauen",
        phone: "116 016",
        description: "Rund um die Uhr, kostenlose Beratung in 18 Sprachen für betroffene Frauen.",
        website: "https://www.hilfetelefon.de"
      },
      {
        name: "WEISSER RING",
        phone: "116 006",
        description: "Bundesweite Hilfe für Kriminalitätsopfer und ihre Angehörigen.",
        website: "https://weisser-ring.de"
      },
      {
        name: "TelefonSeelsorge",
        phone: "0800 111 0 111",
        description: "Anonyme, kostenlose Beratung zu jeder Tages- und Nachtzeit.",
        website: "https://www.telefonseelsorge.de"
      },
      {
        name: "Nummer gegen Kummer (Kinder & Jugendliche)",
        phone: "116 111",
        description: "Kostenlose Beratung für Kinder, Jugendliche und Eltern.",
        website: "https://www.nummergegenkummer.de"
      },
      {
        name: "Hilfetelefon Sexueller Missbrauch",
        phone: "0800 22 55 530",
        description: "Anlaufstelle für Betroffene, Angehörige und Fachkräfte.",
        website: "https://www.hilfe-portal-missbrauch.de"
      }
    ]
  },
  {
    id: "at",
    country: "Österreich",
    flag: "🇦🇹",
    resources: [
      {
        name: "Frauenhelpline gegen Gewalt",
        phone: "0800 222 555",
        description: "Kostenlose, anonyme Hilfe für Frauen rund um die Uhr.",
        website: "https://www.frauenhelpline.at"
      },
      {
        name: "Männernotruf",
        phone: "0800 246 247",
        description: "24-Stunden-Beratung für Männer in Krisen- und Gewaltsituationen.",
        website: "https://www.maennernotruf.at"
      },
      {
        name: "Rat auf Draht",
        phone: "147",
        description: "Notruf für Kinder, Jugendliche und deren Bezugspersonen.",
        website: "https://www.rataufdraht.at"
      },
      {
        name: "TelefonSeelsorge Österreich",
        phone: "142",
        description: "Österreichweite Notrufnummer für Menschen in schwierigen Lebenslagen.",
        website: "https://www.telefonseelsorge.at"
      }
    ]
  },
  {
    id: "ch",
    country: "Schweiz",
    flag: "🇨🇭",
    resources: [
      {
        name: "Opferhilfe Schweiz",
        phone: "Website nutzen",
        description: "Zentrale Anlaufstelle für die Opferhilfe in allen Kantonen.",
        website: "https://www.opferhilfe-schweiz.ch"
      },
      {
        name: "Die Dargebotene Hand",
        phone: "143",
        description: "Rund um die Uhr ein offenes Ohr für Menschen in Not.",
        website: "https://www.143.ch"
      },
      {
        name: "Pro Juventute (Beratung 147)",
        phone: "147",
        description: "Unterstützung für Kinder und Jugendliche in der Schweiz.",
        website: "https://www.147.ch"
      },
      {
        name: "Frauenhäuser Schweiz",
        phone: "Website nutzen",
        description: "Übersicht über alle Frauenhäuser und Notunterkünfte.",
        website: "https://www.frauenhaus-schweiz.ch"
      }
    ]
  }
];

export default function LovanarisHilfePage() {
  const [activeTab, setActiveTab] = useState("de");

  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lovanaris-section-label"
        >
          Unterstützung & Hilfe
        </motion.div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>Du bist nicht allein.</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.25rem", lineHeight: "1.6" }}>
          Hier findest du professionelle Anlaufstellen, die dir in schwierigen Situationen beistehen. Alle Angebote sind vertraulich und oft anonym.
        </p>
      </header>

      {/* Country Tabs */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 4rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        {helpData.map((country) => (
          <button
            key={country.id}
            onClick={() => setActiveTab(country.id)}
            style={{
              padding: "1rem 2rem",
              borderRadius: "100px",
              border: "1px solid",
              borderColor: activeTab === country.id ? "var(--lovanaris-primary)" : "var(--lovanaris-border)",
              background: activeTab === country.id ? "var(--lovanaris-primary-soft)" : "var(--lovanaris-surface)",
              color: activeTab === country.id ? "var(--lovanaris-primary)" : "var(--lovanaris-text)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <span>{country.flag}</span>
            <span>{country.country}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}
          >
            {helpData.find(c => c.id === activeTab)?.resources.map((resource, index) => (
              <div 
                key={index} 
                className="lovanaris-card"
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  height: "100%" 
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "12px", 
                      background: "var(--lovanaris-primary-soft)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: "var(--lovanaris-primary)"
                    }}>
                      <Heart size={24} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--lovanaris-text)", margin: 0, lineHeight: "1.3" }}>{resource.name}</h3>
                  </div>
                  <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                    {resource.description}
                  </p>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {resource.phone !== "Website nutzen" && (
                    <a 
                      href={`tel:${resource.phone.replace(/\s/g, "")}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        padding: "1rem",
                        background: "var(--lovanaris-primary)",
                        color: "white",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "1.1rem"
                      }}
                    >
                      <Phone size={20} /> {resource.phone}
                    </a>
                  )}
                  <a 
                    href={resource.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      padding: "1rem",
                      background: "var(--lovanaris-bg)",
                      color: "var(--lovanaris-text)",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      border: "1px solid var(--lovanaris-border)"
                    }}
                  >
                    Zur Webseite <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Global/Common Support Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ 
            marginTop: "6rem", 
            padding: "4rem", 
            background: "rgba(181, 99, 69, 0.05)", 
            borderRadius: "32px", 
            border: "1px solid rgba(181, 99, 69, 0.1)",
            textAlign: "center"
          }}
        >
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: "var(--lovanaris-primary-soft)", 
            borderRadius: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "var(--lovanaris-primary)",
            margin: "0 auto 2rem"
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>In Sicherheit bringen.</h2>
          <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto 2.5rem", lineHeight: "1.7" }}>
            Wenn du dich in unmittelbarer Gefahr befindest, zögere nicht, die Polizei zu rufen. In allen EU-Ländern erreichst du den Notruf unter der <strong>112</strong>. Dein Schutz hat höchste Priorität.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--lovanaris-text)" }}>
              <Users size={20} color="var(--lovanaris-primary)" />
              <span>Anonyme Beratung</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--lovanaris-text)" }}>
              <Lock size={20} color="var(--lovanaris-primary)" />
              <span>Verschlüsselte Chats</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--lovanaris-text)" }}>
              <Globe size={20} color="var(--lovanaris-primary)" />
              <span>Ortsunabhängig</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
