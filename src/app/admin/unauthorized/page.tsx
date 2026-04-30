"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LovanarisUnauthorizedPage() {
  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "var(--lovanaris-bg)",
      padding: "2rem",
      textAlign: "center"
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ 
          background: "var(--lovanaris-surface)",
          padding: "4rem",
          borderRadius: "32px",
          border: "1px solid var(--lovanaris-border)",
          maxWidth: "500px"
        }}
      >
        <div style={{ 
          width: "80px", 
          height: "80px", 
          borderRadius: "100px", 
          background: "rgba(239, 68, 68, 0.1)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 2rem",
          color: "#ef4444"
        }}>
          <Lock size={40} />
        </div>
        
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "white" }}>Kein Zutritt</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", lineHeight: "1.6", marginBottom: "2.5rem" }}>
          Du bist zwar eingeloggt, aber deine E-Mail-Adresse ist nicht für den Lovanaris-Admin-Bereich autorisiert. 
          Bitte wende dich an die Projektleitung, wenn du Teil des Teams bist.
        </p>

        <Link href="/" className="btn-lovanaris btn-lovanaris-outline" style={{ display: "inline-flex", gap: "0.75rem", alignItems: "center" }}>
          <ArrowLeft size={18} /> Zurück zur Hauptseite
        </Link>
      </motion.div>
    </div>
  );
}
