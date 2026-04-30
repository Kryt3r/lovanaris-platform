"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function LovanarisNavbar() {
  return (
    <nav className="lovanaris-glass" style={{
      position: "fixed",
      top: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      padding: "0.75rem 2rem",
      borderRadius: "100px",
      display: "flex",
      alignItems: "center",
      gap: "3rem",
      width: "max-content",
      maxWidth: "90%",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "white" }}>
        <Shield size={20} className="text-lovanaris-primary" style={{ color: "var(--lovanaris-primary)" }} />
        <span style={{ fontWeight: "700", letterSpacing: "-0.02em" }}>LOVANARIS</span>
      </Link>

      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
        <Link href="/regelwerk" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Regelwerk</Link>
        <Link href="/faq" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>FAQ</Link>
        <Link href="/status" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Status</Link>
        <Link href="/hilfe" style={{ color: "var(--lovanaris-text-muted)", textDecoration: "none" }}>Hilfe</Link>
      </div>

      <Link href="/schreiben" className="btn-lovanaris btn-lovanaris-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", textDecoration: "none" }}>
        Teilen
      </Link>
    </nav>
  );
}
