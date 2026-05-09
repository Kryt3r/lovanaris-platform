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
      {/* Hero Section - Full Width Layout */}
      <header className="lovanaris-hero" style={{ paddingBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", width: "100%" }}>
          {/* Left Content */}
          <div>
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
              Deine Geschichte verdient Gehör
            </motion.h1>

            <motion.p
              className="lovanaris-slogan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Ein geschützter Raum für Menschen, die ihre Erfahrungen anonym teilen möchten. Ohne Angst. Ohne Vorurteile.
            </motion.p>

            <motion.div
              className="lovanaris-cta-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/schreiben" className="btn-lovanaris btn-lovanaris-primary" style={{ textDecoration: "none" }}>
                Geschichte teilen
              </Link>
              <Link href="/konzept" className="btn-lovanaris btn-lovanaris-outline" style={{ textDecoration: "none" }}>
                Mehr erfahren
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              background: "var(--lovanaris-surface)",
              border: "1px solid var(--lovanaris-border)",
              borderRadius: "24px",
              padding: "2.5rem",
              boxShadow: "0 20px 40px rgba(85, 73, 61, 0.08)"
            }}
          >
            <p style={{
              fontSize: "1.35rem",
              lineHeight: "1.6",
              color: "var(--lovanaris-text)",
              fontStyle: "italic",
              marginBottom: "1.5rem"
            }}>
              „Viel zu viele Menschen haben nicht die Möglichkeit, sich anderen anzuvertrauen – aus Scham, aus Angst, aus Ohnmacht."
            </p>
            <p style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "var(--lovanaris-text-muted)"
            }}>
              Lovanaris wurde geschaffen, um dies zu ändern. Ein Ort, an dem Worte nicht zurückverfolgt werden können. Ein Ort, an dem deine Stimme zählt.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Rules & Mechanisms - Full Width */}
      <section className="lovanaris-features" style={{ paddingTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <div>
            <div className="lovanaris-section-label">Sicherheit</div>
            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>Vertrauen durch Transparenz</h2>
          </div>
          <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "400px", textAlign: "right", margin: 0 }}>
            Wir haben Lovanaris mit einem klaren Ziel gebaut: Ein Raum, in dem du dich sicher fühlst.
          </p>
        </div>
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
              Keine Namen, keine Orte. Jede Einsendung erhält einen eindeutigen 6-stelligen Code (z.B. „A7B3X9") und einen persönlichen Löschcode. Nur du weißt, dass es deine Geschichte ist.
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

      {/* Publication Section */}
      <section style={{ padding: "60px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <div className="lovanaris-section-label">Sichtbarkeit</div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Geschichten, die bewegen</h2>
            <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem" }}>
              Deine Geschichte kann auf TikTok und hier auf der Website veröffentlicht werden – 
              mit moderierter Kommentarfunktion. Damit schaffen wir Bewusstsein für Probleme, 
              die Menschen tagtäglich durchleben müssen.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="lovanaris-card"
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📱</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>TikTok</h3>
              <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "0.9375rem" }}>
                Anonymisierte Geschichten als vertonte Videos – für maximale Reichweite und Aufmerksamkeit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lovanaris-card"
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Website</h3>
              <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "0.9375rem" }}>
                Als Text mit moderierter Kommentarfunktion – für tiefgehende Diskussionen und Austausch.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lovanaris-card"
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛡️</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Moderation</h3>
              <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "0.9375rem" }}>
                Alle Kommentare werden geprüft. Hass und Täter-Opfer-Umkehr haben keinen Platz.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background: "var(--lovanaris-surface)",
              border: "1px solid var(--lovanaris-border)",
              borderRadius: "16px",
              textAlign: "center"
            }}
          >
            <p style={{ color: "var(--lovanaris-text)", fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "800px", margin: "0 auto" }}>
              <strong>Unser Ziel:</strong> Durch das Teilen dieser Geschichten wollen wir Bewusstsein schaffen 
              für die Realität, die viele Menschen erleben müssen. Mit der Hoffnung, dass sich so 
              <span style={{ color: "var(--lovanaris-primary)", fontWeight: 600 }}> sichere Räume auch im direkten Umfeld entwickeln</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Help - Full Width Banner */}
      <section style={{ padding: "60px 0", background: "rgba(181, 99, 69, 0.05)", margin: "40px -2rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
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
            background: "#dc2626",
            color: "white",
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

          {/* Right Side - Additional Info */}
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--lovanaris-text)" }}>Weitere Hilfsangebote</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/hilfe" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                → Hilfe in Österreich & Schweiz
              </Link>
              <Link href="/faq" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                → Häufige Fragen
              </Link>
              <Link href="/regelwerk" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                → Unser Regelwerk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Resources */}
      <footer style={{ padding: "40px 0", borderTop: "1px solid var(--lovanaris-border)", marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--lovanaris-text-muted)" }}>
            © 2026 Lovanaris • Ein Projekt für Sichtbarkeit und Schutz
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/regelwerk" style={{ color: "var(--lovanaris-text)", textDecoration: "none", fontSize: "0.875rem" }}>Regelwerk</Link>
            <Link href="/faq" style={{ color: "var(--lovanaris-text)", textDecoration: "none", fontSize: "0.875rem" }}>FAQ</Link>
            <Link href="/hilfe" style={{ color: "var(--lovanaris-text)", textDecoration: "none", fontSize: "0.875rem" }}>Hilfe</Link>
            <Link href="/impressum" style={{ color: "var(--lovanaris-text)", textDecoration: "none", fontSize: "0.875rem" }}>Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
