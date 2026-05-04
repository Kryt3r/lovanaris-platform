"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, EyeOff, Lock, Heart, Users, MessageCircle, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

// Warm color palette inline
const colors = {
  bg: "#faf8f5",
  surface: "#ffffff",
  primary: "#b56345",
  primarySoft: "rgba(181, 99, 69, 0.1)",
  text: "#55493d",
  textMuted: "#7d6b56",
  border: "#ebe4d8"
};

export default function KonzeptPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bg, color: colors.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Navigation */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: `${colors.bg}cc`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
            <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 600, color: colors.text, textDecoration: "none" }}>
              Lovanaris
            </Link>
            <Link href="/" style={{ fontSize: "0.875rem", color: colors.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <ArrowLeft size={16} /> Zurück
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header style={{ paddingTop: "120px", paddingBottom: "48px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: colors.primarySoft,
              color: colors.primary,
              borderRadius: "100px",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "1.5rem"
            }}>
              <Shield size={16} /> Unser Versprechen
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
              Warum Lovanaris existiert
            </h1>
            <p style={{ fontSize: "1.25rem", color: colors.textMuted, maxWidth: "600px" }}>
              Ein sicherer Raum für Geschichten, die sonst ungehört bleiben.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Introduction */}
      <section style={{ padding: "32px 0", borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ fontSize: "1.125rem", lineHeight: 1.7, color: colors.textMuted, maxWidth: "900px" }}
          >
            Viel zu viele Menschen tragen Erfahrungen mit Gewalt und Missbrauch mit sich – und haben niemanden, dem sie sich anvertrauen können.{" "}
            <strong style={{ color: colors.text }}>Lovanaris gibt ihnen eine Stimme, ohne ihre Identität zu offenbaren.</strong>
          </motion.p>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: "48px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Unsere Grundsätze</h2>
            <p style={{ color: colors.textMuted }}>Auf diesen Säulen bauen wir.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <PrincipleCard icon={<EyeOff size={20} />} title="Absolute Anonymität" description="Keine Namen, keine E-Mails, keine IP-Speicherung. Nur ein Code." />
            <PrincipleCard icon={<Lock size={20} />} title="Sichere Aufbewahrung" description="Verschlüsselte Speicherung. Keine Zuordnung möglich." />
            <PrincipleCard icon={<Shield size={20} />} title="Strikte Moderation" description="Jede Geschichte wird geprüft. Kein Raum für Hass." />
            <PrincipleCard icon={<Heart size={20} />} title="Respektvoller Umgang" description="Hinter jeder Geschichte steht ein Mensch." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "48px 0", backgroundColor: colors.surface }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>So funktioniert es</h2>
            <p style={{ color: colors.textMuted }}>Vier Schritte. Keine Registrierung.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            <StepCard number="1" title="Schreiben" description="Erzähle deine Geschichte." />
            <StepCard number="2" title="Code" description="Erhalte deinen eindeutigen Code." />
            <StepCard number="3" title="Prüfung" description="Wir moderieren anonym." />
            <StepCard number="4" title="Teilen" description="Deine Geschichte wird veröffentlicht." />
          </div>
        </div>
      </section>

      {/* Publication */}
      <section style={{ padding: "48px 0", backgroundColor: colors.surface }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>Wohin deine Geschichte kommt</h2>
            <p style={{ color: colors.textMuted, maxWidth: "700px", margin: "0 auto" }}>
              Mit deiner Einwilligung wird deine Geschichte anonymisiert veröffentlicht – 
              um Bewusstsein zu schaffen und andere zu erreichen.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "3rem" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              style={{
                padding: "2rem",
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📱</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>TikTok</h3>
              <p style={{ color: colors.textMuted, fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Anonymisierte Geschichten als vertonte Videos – für maximale Reichweite und Aufmerksamkeit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                padding: "2rem",
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Website</h3>
              <p style={{ color: colors.textMuted, fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Als Text mit moderierter Kommentarfunktion – für tiefgehende Diskussionen und Austausch.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                padding: "2rem",
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛡️</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Moderation</h3>
              <p style={{ color: colors.textMuted, fontSize: "0.9375rem", lineHeight: 1.5 }}>
                Alle Kommentare werden geprüft – sowohl auf TikTok als auch hier. Hass hat keinen Platz.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: "2rem",
              backgroundColor: colors.primarySoft,
              border: `1px solid ${colors.primary}33`,
              borderRadius: "16px",
              textAlign: "center"
            }}
          >
            <p style={{ color: colors.text, fontSize: "1.125rem", lineHeight: 1.6, maxWidth: "800px", margin: "0 auto" }}>
              <strong>Unser Ziel:</strong> Durch das Teilen dieser Geschichten schaffen wir Bewusstsein 
              für die Realität, die viele Menschen erleben müssen. Mit der Hoffnung, dass sich so{" "}
              <span style={{ color: colors.primary, fontWeight: 600 }}>sichere Räume auch im direkten Umfeld entwickeln</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section style={{ padding: "48px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Für wen ist Lovanaris?</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <AudienceItem text="Betroffene von sexualisierter Gewalt" />
                <AudienceItem text="Menschen in häuslichen Gewaltsituationen" />
                <AudienceItem text="Opfer psychischen Missbrauchs" />
                <AudienceItem text="Stalking- und Belästigungsopfer" />
                <AudienceItem text="Alle, die anonym ihre Geschichte teilen möchten" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: colors.primarySoft,
                border: `1px solid ${colors.primary}33`,
                borderRadius: "16px",
                padding: "2rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <MessageCircle size={24} style={{ color: colors.primary }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Wichtiger Hinweis</h3>
              </div>
              <p style={{ color: colors.textMuted, lineHeight: 1.6 }}>
                Lovanaris ist kein Krisendienst. Bei akuter Gefahr: Polizei <strong style={{ color: colors.text }}>110</strong> oder Hilfetelefon <strong style={{ color: colors.text }}>116 016</strong>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 0", backgroundColor: colors.surface }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>Bereit?</h2>
              <p style={{ color: colors.textMuted }}>Deine Stimme verdient es, gehört zu werden.</p>
            </div>
            <Link
              href="/schreiben"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "1rem 2rem",
                backgroundColor: colors.primary,
                color: "white",
                borderRadius: "100px",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(181, 99, 69, 0.3)"
              }}
            >
              Geschichte teilen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem 0", borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem", color: colors.textMuted }}>
            <span>© 2026 Lovanaris</span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link href="/regelwerk" style={{ color: colors.textMuted, textDecoration: "none" }}>Regelwerk</Link>
              <Link href="/faq" style={{ color: colors.textMuted, textDecoration: "none" }}>FAQ</Link>
              <Link href="/impressum" style={{ color: colors.textMuted, textDecoration: "none" }}>Impressum</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PrincipleCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        padding: "1.25rem",
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px"
      }}
    >
      <div style={{
        width: "40px",
        height: "40px",
        backgroundColor: colors.primarySoft,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.primary,
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: "0.25rem", color: colors.text }}>{title}</h3>
        <p style={{ fontSize: "0.9375rem", color: colors.textMuted, lineHeight: 1.5 }}>{description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center" }}>
      <div style={{
        width: "48px",
        height: "48px",
        backgroundColor: colors.primary,
        color: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1rem",
        fontWeight: 600,
        fontSize: "1.125rem"
      }}>
        {number}
      </div>
      <h3 style={{ fontWeight: 600, marginBottom: "0.25rem", color: colors.text }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: colors.textMuted }}>{description}</p>
    </motion.div>
  );
}

function AudienceItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Check size={18} style={{ color: colors.primary, flexShrink: 0 }} />
      <span style={{ color: colors.textMuted }}>{text}</span>
    </div>
  );
}
