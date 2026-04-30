"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { loginLovanarisAction } from "@/lib/actions/lovanaris-auth";
import { useRouter } from "next/navigation";

export default function LovanarisLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginLovanarisAction({ email, password });
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Anmeldung fehlgeschlagen.");
        setLoading(false);
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#0a0a0a",
      padding: "2rem"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          maxWidth: "450px", 
          width: "100%", 
          padding: "3rem",
          background: "#111",
          borderRadius: "24px",
          border: "1px solid #222"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "16px", 
            background: "rgba(59, 130, 246, 0.1)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 1.5rem",
            color: "#3b82f6",
            border: "1px solid rgba(59, 130, 246, 0.2)"
          }}>
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: "1.75rem", color: "white", marginBottom: "0.5rem" }}>Lovanaris Admin</h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>Moderations-Schnittstelle</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ fontSize: "0.8rem", marginBottom: "0.5rem", display: "block", color: "#888" }}>E-Mail Adresse</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: "100%", 
                  background: "#000", 
                  border: "1px solid #222", 
                  color: "white", 
                  padding: "0.85rem 1rem 0.85rem 3rem",
                  borderRadius: "12px",
                  outline: "none"
                }} 
                placeholder="admin@lovanaris-projekt.de"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", marginBottom: "0.5rem", display: "block", color: "#888" }}>Passwort</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: "100%", 
                  background: "#000", 
                  border: "1px solid #222", 
                  color: "white", 
                  padding: "0.85rem 1rem 0.85rem 3rem",
                  borderRadius: "12px",
                  outline: "none"
                }} 
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", fontSize: "0.85rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              marginTop: "1rem", 
              display: "flex", 
              gap: "0.75rem", 
              justifyContent: "center",
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "1rem",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Shield size={18} /> Anmelden <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: "3rem", textAlign: "center", borderTop: "1px solid #222", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.75rem", color: "#666" }}>
            Dieses System ist nur für autorisierte Mitglieder des Lovanaris-Teams bestimmt.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
