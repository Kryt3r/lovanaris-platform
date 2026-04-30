"use client";

import React from "react";
import Link from "next/link";
import { Shield, Heart } from "lucide-react";

export function LovanarisFooter() {
  return (
    <footer className="lovanaris-footer" style={{ borderTop: "1px solid var(--lovanaris-border)", padding: "60px 0 40px", backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div className="center-wrapper" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem" }}>
        
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <Shield size={24} color="var(--lovanaris-primary)" />
            <span style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "0.05em" }}>LOVANARIS</span>
          </div>
          <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "300px" }}>
            Ein Raum für Stimmen, die gehört werden müssen. Sicher, anonym und respektvoll moderiert.
          </p>
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <h4 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
            <li><Link href="/" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Startseite</Link></li>
            <li><Link href="/schreiben" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Geschichte teilen</Link></li>
            <li><Link href="/status" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Status abfragen</Link></li>
            <li><Link href="/hilfe" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Hilfe & Support</Link></li>
          </ul>
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <h4 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>Sicherheit</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
            <li><Link href="/faq" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>FAQ</Link></li>
            <li><Link href="/regelwerk" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Regelwerk</Link></li>
            <li><Link href="/datenschutz" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Datenschutz</Link></li>
          </ul>
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <h4 style={{ marginBottom: "1.25rem", fontSize: "1rem" }}>Kontakt</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
            <li><a href="mailto:kontakt@einfach-robin.de" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>E-Mail schreiben</a></li>
            <li><Link href="/impressum" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Impressum</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--lovanaris-border)", textAlign: "center", color: "var(--lovanaris-text-muted)", fontSize: "0.8rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for a safer community.
        </div>
        &copy; {new Date().getFullYear()} Lovanaris | Ein Projekt von <Link href="https://www.einfachrobin.de" style={{ color: "inherit", textDecoration: "underline" }}>Einfach Robin</Link>
      </div>
    </footer>
  );
}
