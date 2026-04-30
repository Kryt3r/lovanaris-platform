"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MessageSquare, Heart, Shield, Users, Lock, EyeOff, AlertTriangle, Phone } from "lucide-react";
import Link from "next/link";

export default function LovanarisPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="lovanaris-content">
      {/* Hero Section */}
      <header className="lovanaris-hero" style={{ paddingBottom: "60px" }}>
        <motion.div 
          className="lovanaris-section-label"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Pilotphase • Sicherer Raum
        </motion.div>
        
        <motion.h1 
          className="lovanaris-title"
          {...fadeIn}
        >
          Lovanaris
        </motion.h1>
        
        <motion.p 
          className="lovanaris-slogan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          „Viel zu viele Menschen haben nicht die Möglichkeit, sich anderen anzuvertrauen – aus Scham, aus Angst, aus Ohnmacht.“
        </motion.p>

        <motion.div 
          className="lovanaris-cta-group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/schreiben" className="btn-lovanaris btn-lovanaris-primary" style={{ textDecoration: "none" }}>
            Sicher & Anonym schreiben
          </Link>
          <button className="btn-lovanaris btn-lovanaris-outline">
            Das Konzept verstehen
          </button>
        </motion.div>
      </header>

      {/* Philosophy Section */}
      <section style={{ padding: "40px 0 80px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: "1.25rem", lineHeight: "1.7", color: "var(--lovanaris-text-muted)", fontStyle: "italic" }}
        >
          Ich möchte eine Basis schaffen, in der Menschen vollkommen anonym Gehör finden. 
          Nicht einmal ich kann Rückschlüsse auf deine Person ziehen. 
          Dein Schutz ist meine oberste Priorität.
        </motion.p>
      </section>

      {/* Rules & Mechanisms */}
      <section className="lovanaris-features">
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "3rem" }}>Sicherheits-Prinzipien</h2>
        <motion.div 
          className="lovanaris-grid"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="lovanaris-card" variants={fadeIn}>
            <div className="lovanaris-card-icon">
              <EyeOff size={24} />
            </div>
            <h3 className="lovanaris-card-title">Anonymität & Code</h3>
            <p className="lovanaris-card-text">
              Keine Namen, keine Orte. Jede Einsendung erhält einen eindeutigen Code (z.B. „A7B3“). Nur du weißt, dass es deine Geschichte ist.
            </p>
          </motion.div>

          <motion.div className="lovanaris-card" variants={fadeIn}>
            <div className="lovanaris-card-icon">
              <Lock size={24} />
            </div>
            <h3 className="lovanaris-card-title">Strikte Moderation</h3>
            <p className="lovanaris-card-text">
              Jeder Kommentar wird vor Freigabe geprüft. Beleidigungen, Relativierungen oder Täter-Opfer-Umkehr werden konsequent gelöscht.
            </p>
          </motion.div>

          <motion.div className="lovanaris-card" variants={fadeIn}>
            <div className="lovanaris-card-icon">
              <AlertTriangle size={24} />
            </div>
            <h3 className="lovanaris-card-title">Triggerwarnungen</h3>
            <p className="lovanaris-card-text">
              Jedes Video und jeder Text beginnt mit einer klaren Warnung zum Inhalt, um andere Betroffene zu schützen.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Emergency Help */}
      <section style={{ padding: "80px 0", background: "rgba(59, 130, 246, 0.03)", borderRadius: "32px", margin: "40px 0" }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="lovanaris-section-label">Sofortige Hilfe</div>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>Du bist nicht allein.</h2>
          <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "1.125rem", marginBottom: "2.5rem" }}>
            Wenn du dich in einer akuten Krise befindest, zögere nicht, Hilfe zu suchen.
          </p>
          
          <a href="tel:116016" style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "1rem", 
            padding: "1.5rem 3rem", 
            background: "white", 
            color: "black", 
            borderRadius: "100px", 
            textDecoration: "none", 
            fontWeight: "700",
            fontSize: "1.5rem"
          }}>
            <Phone size={24} />
            116 016
          </a>
          <p style={{ marginTop: "1rem", opacity: 0.6, fontSize: "0.875rem" }}>Das Hilfetelefon – Gewalt gegen Frauen</p>
        </div>
      </section>

      {/* Footer / Resources */}
      <footer style={{ padding: "60px 0", opacity: 0.5, textAlign: "center", fontSize: "0.875rem" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1rem" }}>
          <Link href="/regelwerk" style={{ color: "inherit", textDecoration: "none" }}>Detailliertes Regelwerk</Link>
          <Link href="/faq" style={{ color: "inherit", textDecoration: "none" }}>Anonymitäts-Check</Link>
        </div>
        <p>© 2026 Lovanaris Pilot Phase • Ein Projekt für Sichtbarkeit und Schutz</p>
      </footer>
    </div>
  );
}
