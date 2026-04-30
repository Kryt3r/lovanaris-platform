"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, Mail, MapPin, Info } from "lucide-react";

export default function LovanarisImpressumPage() {
  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lovanaris-section-label">
          Rechtliche Informationen
        </motion.div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>Impressum</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem", lineHeight: "1.6" }}>
          Angaben gemäß § 5 TMG. Dieses Impressum gilt für das Pilotprojekt Lovanaris.
        </p>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "2.5rem" }}>
        
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lovanaris-card"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--lovanaris-primary)" }}>
            <MapPin size={24} />
            <h2 style={{ fontSize: "1.5rem", color: "white", margin: 0 }}>Betreiber & Kontakt</h2>
          </div>
          <div style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.8" }}>
            <p style={{ fontSize: "1.1rem", color: "white", fontWeight: "600", marginBottom: "0.5rem" }}>Robin [Nachname]</p>
            <p>Postflex #24357</p>
            <p>Emsdettener Str. 10</p>
            <p>48268 Greven</p>
            <p style={{ marginTop: "1.5rem" }}>
              <Mail size={16} style={{ display: "inline", marginRight: "8px" }} />
              kontakt@einfach-robin.de
            </p>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lovanaris-card"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--lovanaris-primary)" }}>
            <Info size={24} />
            <h2 style={{ fontSize: "1.5rem", color: "white", margin: 0 }}>Projektinhalt & Redaktion</h2>
          </div>
          <p style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.7" }}>
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
            <strong>Robin [Nachname]</strong> (Anschrift siehe oben)<br /><br />
            Lovanaris ist ein dokumentarisches Pilotprojekt zur Sichtbarmachung von persönlichen Erfahrungen im Kontext von Gewalt und Missbrauch. Die Redaktion prüft Einsendungen auf Plausibilität und führt eine Anonymisierung durch, übernimmt jedoch keine Haftung für die individuellen Schilderungen der Einsendenden.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lovanaris-card"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--lovanaris-primary)" }}>
            <Scale size={24} />
            <h2 style={{ fontSize: "1.5rem", color: "white", margin: 0 }}>Haftungsausschluss</h2>
          </div>
          <div style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.7", display: "grid", gap: "1rem" }}>
            <p>
              <strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            <p>
              <strong>Urheberrecht:</strong> Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung.
            </p>
            <p>
              <strong>Hinweis:</strong> Wir distanzieren uns ausdrücklich von Inhalten, die gegen geltendes Recht verstoßen. Sollten uns Rechtsverletzungen bekannt werden, werden wir derartige Inhalte umgehend entfernen.
            </p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
