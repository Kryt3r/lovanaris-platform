"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ShieldCheck, Clock, MessageSquare, AlertCircle, Trash2, Send, User, Shield } from "lucide-react";
import { getSubmissionStatusAction, userReplyStoryAction } from "@/lib/actions/lovanaris";

export default function LovanarisStatusPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      setError("Der Code ist zu kurz.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setReplySuccess(false);

    const response = await getSubmissionStatusAction(code.toUpperCase());
    
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error || "Code nicht gefunden.");
    }
    setLoading(false);
  };

  const handleSendReply = async () => {
    if (!replyText || replyText.length < 10) return;
    setReplying(true);
    const res = await userReplyStoryAction(code, replyText);
    if (res.success) {
      setReplySuccess(true);
      // Local update for immediate feedback
      const newChat = [...(result.chat || []), { role: "user", content: replyText, createdAt: new Date() }];
      setResult({ ...result, status: "pending", chat: newChat });
      setReplyText("");
    } else {
      setError(res.error);
    }
    setReplying(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "In Prüfung", icon: <Clock size={20} />, color: "#3b82f6" };
      case "approved":
        return { label: "Veröffentlicht", icon: <ShieldCheck size={20} />, color: "#10b981" };
      case "rejected":
        return { label: "Abgelehnt", icon: <Trash2 size={20} />, color: "#ef4444" };
      case "info_needed":
        return { label: "Rückfrage", icon: <MessageSquare size={20} />, color: "#f59e0b" };
      default:
        return { label: status, icon: <AlertCircle size={20} />, color: "#94a3b8" };
    }
  };

  const canReply = result?.status === "info_needed" && 
                   (!result.chat || result.chat.length === 0 || result.chat[result.chat.length - 1].role === "admin");

  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lovanaris-section-label">
          Status-Abfrage
        </motion.div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>Deine Geschichte verfolgen</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem" }}>
          Gib deinen anonymen 6-stelligen Code ein, um den aktuellen Status deiner Einsendung zu sehen und Nachrichten der Redaktion zu lesen.
        </p>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <form onSubmit={handleCheckStatus} className="lovanaris-card" style={{ marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input 
              type="text" 
              placeholder="Z.B. A7B3X9" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="lovanaris-textarea"
              style={{ minHeight: "auto", padding: "1rem 1.5rem", fontSize: "1.25rem", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.2em" }}
            />
            <button 
              type="submit" 
              disabled={loading || code.length < 4}
              className="btn-lovanaris btn-lovanaris-primary" 
              style={{ padding: "0 2rem" }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>{error}</p>}
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "grid", gap: "2rem" }}
            >
              {/* Status Info Card */}
              <div className="lovanaris-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1.5rem", borderBottom: "1px solid var(--lovanaris-border)", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--lovanaris-text-muted)", marginBottom: "0.25rem" }}>Aktueller Status</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: getStatusInfo(result.status).color, fontWeight: "700", fontSize: "1.125rem" }}>
                      {getStatusInfo(result.status).icon}
                      {getStatusInfo(result.status).label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--lovanaris-text-muted)", marginBottom: "0.25rem" }}>Ident-Code</div>
                    <div style={{ fontWeight: "700", letterSpacing: "0.1em", color: "var(--lovanaris-text)" }}>{result.code}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "var(--lovanaris-text-muted)" }}>
                  <span style={{ color: "var(--lovanaris-text)", fontWeight: "600" }}>Kategorie:</span> {result.category}
                </div>
              </div>

              {/* Chat History */}
              <div className="lovanaris-card" style={{ padding: "2.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <MessageSquare size={20} color="var(--lovanaris-primary)" />
                  Kommunikation mit der Redaktion
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
                  {(!result.chat || result.chat.length === 0) ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--lovanaris-text-muted)", fontSize: "0.9rem", border: "1px dashed var(--lovanaris-border)", borderRadius: "16px" }}>
                      Noch keine Nachrichten vorhanden.
                    </div>
                  ) : (
                    result.chat.map((msg: any) => (
                      <div 
                        key={msg.id} 
                        style={{ 
                          alignSelf: msg.role === "admin" ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.role === "admin" ? "flex-start" : "flex-end"
                        }}
                      >
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.5rem", 
                          marginBottom: "0.5rem", 
                          fontSize: "0.7rem", 
                          fontWeight: "700", 
                          color: msg.role === "admin" ? "var(--lovanaris-primary)" : "#10b981",
                          textTransform: "uppercase"
                        }}>
                          {msg.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                          {msg.role === "admin" ? "Redaktion" : "Deine Antwort"}
                        </div>
                        <div style={{ 
                          padding: "1.25rem", 
                          borderRadius: "16px", 
                          background: msg.role === "admin" ? "rgba(59, 130, 246, 0.08)" : "rgba(16, 185, 129, 0.08)",
                          border: "1px solid",
                          borderColor: msg.role === "admin" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)",
                          color: "var(--lovanaris-text)",
                          fontSize: "0.95rem",
                          lineHeight: "1.6"
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--lovanaris-text-muted)", marginTop: "0.4rem" }}>
                          {new Date(msg.createdAt).toLocaleString("de-DE", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Section */}
                <div style={{ borderTop: "1px solid var(--lovanaris-border)", paddingTop: "2rem" }}>
                  {canReply ? (
                    <div>
                      <label style={{ fontSize: "0.85rem", color: "var(--lovanaris-text)", fontWeight: "600", display: "block", marginBottom: "0.75rem" }}>Auf Rückfrage antworten:</label>
                      <textarea 
                        className="lovanaris-textarea" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Deine anonyme Antwort..."
                        style={{ minHeight: "120px", marginBottom: "1rem" }}
                      />
                      <button 
                        onClick={handleSendReply}
                        disabled={replying || replyText.length < 10}
                        className="btn-lovanaris btn-lovanaris-primary"
                        style={{ width: "100%", display: "flex", gap: "0.75rem", justifyContent: "center" }}
                      >
                        {replying ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Antwort senden</>}
                      </button>
                    </div>
                  ) : result?.status === "info_needed" ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", background: "rgba(245, 158, 11, 0.05)", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.2)", color: "#f59e0b", fontSize: "0.9rem" }}>
                      Deine Antwort wurde gesendet. Bitte warte auf eine erneute Rückmeldung der Redaktion.
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
