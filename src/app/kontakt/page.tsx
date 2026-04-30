"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Trash2, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { submitContactAction } from "@/lib/actions/lovanaris-contact";

export default function LovanarisContactPage() {
  const [type, setType] = useState<"general" | "deletion">("general");
  const [formData, setFormData] = useState({
    email: "",
    storyCode: "",
    securityToken: "",
    validationNote: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await submitContactAction({
      type,
      ...formData
    });

    if (res.success) {
      setStatus({ 
        type: "success", 
        message: "Deine Anfrage wurde erfolgreich gesendet. Wir bearbeiten diese so schnell wie möglich." 
      });
      setFormData({ email: "", storyCode: "", securityToken: "", validationNote: "", message: "" });
    } else {
      setStatus({ type: "error", message: res.error || "Ein Fehler ist aufgetreten." });
    }
    setLoading(false);
  };

  return (
    <div className="lovanaris-page-container" style={{ paddingBottom: "100px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <span style={{ 
          background: "rgba(59, 130, 246, 0.1)", 
          color: "#3b82f6", 
          padding: "6px 16px", 
          borderRadius: "20px", 
          fontSize: "0.8rem", 
          fontWeight: "600",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }}>
          Support & Kontakt
        </span>
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 8vw, 4rem)", 
          fontWeight: "800", 
          marginTop: "1.5rem",
          letterSpacing: "-0.02em"
        }}>
          Wie können wir <span style={{ color: "var(--lovanaris-primary)" }}>helfen?</span>
        </h1>
        <p style={{ 
          color: "var(--lovanaris-text-muted)", 
          maxWidth: "600px", 
          margin: "1.5rem auto",
          fontSize: "1.1rem",
          lineHeight: "1.6"
        }}>
          Ob allgemeine Fragen oder die Verwaltung deiner Geschichte – wir sind für dich da. 100% diskret und sicher.
        </p>
      </motion.div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Type Selector */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "1rem", 
          marginBottom: "2.5rem",
          background: "rgba(255,255,255,0.03)",
          padding: "8px",
          borderRadius: "16px",
          border: "1px solid var(--lovanaris-border)"
        }}>
          <button 
            onClick={() => setType("general")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: type === "general" ? "var(--lovanaris-primary)" : "transparent",
              color: type === "general" ? "white" : "#888",
              fontWeight: "600"
            }}
          >
            <MessageSquare size={18} /> Allgemeine Anfrage
          </button>
          <button 
            onClick={() => setType("deletion")}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: type === "deletion" ? "#ef4444" : "transparent",
              color: type === "deletion" ? "white" : "#888",
              fontWeight: "600"
            }}
          >
            <Trash2 size={18} /> Löschung beantragen
          </button>
        </div>

        <motion.form 
          layout
          onSubmit={handleSubmit}
          style={{ 
            background: "rgba(255,255,255,0.03)",
            padding: "3rem",
            borderRadius: "24px",
            border: "1px solid var(--lovanaris-border)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <AnimatePresence mode="wait">
              {type === "general" ? (
                <motion.div 
                  key="general"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>Deine E-Mail Adresse (für die Antwort)</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#444" }} size={18} />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="name@beispiel.de"
                      style={{ 
                        width: "100%", 
                        background: "rgba(0,0,0,0.3)", 
                        border: "1px solid #333", 
                        padding: "1rem 1rem 1rem 3rem", 
                        borderRadius: "12px", 
                        color: "white",
                        outline: "none"
                      }} 
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="deletion"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>Story-Code (6-stellig)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.storyCode}
                      onChange={e => setFormData({...formData, storyCode: e.target.value.toUpperCase()})}
                      placeholder="A7B3..."
                      style={{ 
                        width: "100%", 
                        background: "rgba(0,0,0,0.3)", 
                        border: "1px solid #333", 
                        padding: "1rem", 
                        borderRadius: "12px", 
                        color: "white",
                        outline: "none"
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>Sicherheits-Token (Optional)</label>
                    <div style={{ position: "relative" }}>
                      <ShieldCheck style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#444" }} size={18} />
                      <input 
                        type="text" 
                        value={formData.securityToken}
                        onChange={e => setFormData({...formData, securityToken: e.target.value})}
                        placeholder="Dein geheimer Key"
                        style={{ 
                          width: "100%", 
                          background: "rgba(0,0,0,0.3)", 
                          border: "1px solid #333", 
                          padding: "1rem 1rem 1rem 3rem", 
                          borderRadius: "12px", 
                          color: "white",
                          outline: "none"
                        }} 
                      />
                    </div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>Inhalts-Validierung (Für Altfälle)</label>
                    <textarea 
                      value={formData.validationNote}
                      onChange={e => setFormData({...formData, validationNote: e.target.value})}
                      placeholder="Nenne uns ein Detail aus deinem Originaltext, das nicht öffentlich ist, um dich zu verifizieren."
                      rows={2}
                      style={{ 
                        width: "100%", 
                        background: "rgba(0,0,0,0.3)", 
                        border: "1px solid #333", 
                        padding: "1rem", 
                        borderRadius: "12px", 
                        color: "white",
                        outline: "none",
                        resize: "none"
                      }} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>Nachricht / Grund</label>
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder={type === "general" ? "Wie können wir dir helfen?" : "Warum möchtest du deine Geschichte löschen lassen?"}
                rows={5}
                style={{ 
                  width: "100%", 
                  background: "rgba(0,0,0,0.3)", 
                  border: "1px solid #333", 
                  padding: "1rem", 
                  borderRadius: "12px", 
                  color: "white",
                  outline: "none",
                  resize: "vertical"
                }} 
              />
            </div>

            {status && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ 
                  padding: "1rem", 
                  borderRadius: "12px", 
                  background: status.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: status.type === "success" ? "#10b981" : "#ef4444",
                  border: `1px solid ${status.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.9rem"
                }}
              >
                {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%",
                background: type === "deletion" ? "#ef4444" : "var(--lovanaris-primary)",
                color: "white",
                border: "none",
                padding: "1.25rem",
                borderRadius: "16px",
                fontSize: "1.1rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {loading ? "Wird gesendet..." : "Anfrage absenden"}
            </button>
          </div>
        </motion.form>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Deine Daten werden ausschließlich zur Bearbeitung deiner Anfrage verwendet und nicht gespeichert, sofern nicht unbedingt erforderlich.
          </p>
        </div>
      </div>
    </div>
  );
}
