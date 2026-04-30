"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Copy, AlertCircle, Info, ShieldAlert, Scale, ArrowRight, EyeOff, ShieldCheck, Phone, ListChecks, ChevronDown } from "lucide-react";
import Link from "next/link";
import { submitStoryAction } from "@/lib/actions/lovanaris";

const triggerCategories = [
  "Sexualisierte Gewalt",
  "Häusliche Gewalt",
  "Psychischer Missbrauch / Gaslighting",
  "Stalking / Belästigung",
  "Diskriminierung / Mobbing",
  "Kindheitserlebnisse / Vernachlässigung",
  "Sonstiges (Bitte im Text spezifizieren)"
];

export default function LovanarisSchreibenPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [securityToken, setSecurityToken] = useState("");
  const [story, setStory] = useState("");
  const [triggerCategory, setTriggerCategory] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Security / Anti-Spam
  const [startTime] = useState(Date.now());
  const [hpValue, setHpValue] = useState(""); // Honeypot
  
  const [consents, setConsents] = useState({
    noEmergency: false,
    anonymity: false,
    truth: false,
    legal: false,
    redaction: false,
    noGuarantee: false,
    age: false
  });

  // Close custom select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateStep1 = () => {
    if (consents.noEmergency && consents.legal && consents.age) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Bitte bestätige die rechtlichen Hinweise, dein Alter und den Notfall-Ausschluss.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hpValue !== "") return; 
    
    const timeSpent = (Date.now() - startTime) / 1000;
    if (timeSpent < 8) {
      alert("Bitte nimm dir genügend Zeit zum Ausfüllen.");
      return;
    }
    if (story.length < 100) {
      alert("Deine Erzählung sollte mindestens 100 Zeichen lang sein.");
      return;
    }
    if (!triggerCategory) {
      alert("Bitte wähle eine passende Trigger-Kategorie aus.");
      return;
    }
    if (!consents.anonymity || !consents.truth || !consents.redaction || !consents.noGuarantee) {
      alert("Bitte bestätige alle Sicherheits- und Einwilligungsrichtlinien.");
      return;
    }

    // Server-side save
    const result = await submitStoryAction({
      story: story,
      category: triggerCategory
    });

    if (result.success && result.code) {
      setCode(result.code);
      if (result.securityToken) setSecurityToken(result.securityToken);
      setSubmitted(true);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert(result.error || "Es gab ein Problem beim Speichern. Bitte versuche es später erneut.");
    }
  };

  const [showCopyToast, setShowCopyToast] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  return (
    <div className="lovanaris-form-wrapper">
      
      <div className="lovanaris-step-indicator">
        <div className={`lovanaris-step ${step >= 1 ? "active" : ""}`} />
        <div className={`lovanaris-step ${step >= 2 ? "active" : ""}`} />
        <div className={`lovanaris-step ${step >= 3 ? "active" : ""}`} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lovanaris-form-container"
          >
            <div className="lovanaris-crisis-banner">
              <ShieldAlert size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong>WICHTIGER HINWEIS:</strong> Dies ist kein Krisendienst und keine Therapieplattform. 
                Wenn du dich in einer akuten Gefahr befindest, kontaktiere sofort die 
                <strong> Polizei (110)</strong> oder das <strong>Hilfetelefon (116 016)</strong>.
              </div>
            </div>

            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Schutz-Vereinbarung</h1>
            <p style={{ color: "var(--lovanaris-text-muted)", marginBottom: "2rem" }}>
              Bevor du deine Geschichte teilst, musst du die folgenden Rahmenbedingungen akzeptieren:
            </p>

            <div className="lovanaris-legal-block">
              <h4>Rechtliches & Sicherheit</h4>
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li>Teilnahme ist absolut freiwillig und jederzeit anonym.</li>
                <li>Einverständnis mit der anonymisierten redaktionellen Veröffentlichung.</li>
                <li>Wir übernehmen keine Haftung für die Wirkung der Einsendung oder Veröffentlichung.</li>
              </ul>
              <div style={{ marginTop: "1rem" }}>
                <Link href="/regelwerk" style={{ color: "var(--lovanaris-primary)", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" }}>
                  Vollständiges Regelwerk lesen →
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "3rem" }}>
              {[
                { id: "age", label: "Ich bestätige, dass ich mindestens 18 Jahre alt bin (oder die Zustimmung meiner Erziehungsberechtigten habe)." },
                { id: "noEmergency", label: "Ich bestätige, dass ich mich aktuell nicht in einer akuten Notlage befinde." },
                { id: "truth", label: "Ich bestätige, dass meine Erzählung der Wahrheit entspricht und keine böswilligen Falschbehauptungen enthält." },
                { id: "redaction", label: "Ich stimme einer redaktionellen Bearbeitung (z.B. Anonymisierung von Namen/Orten) zu." },
                { id: "legal", label: "Ich akzeptiere die rechtlichen Rahmenbedingungen und Haftungshinweise (kein Anspruch auf Therapie/Beweissicherung)." }
              ].map((item) => (
                <label 
                  key={item.id}
                  style={{ 
                    display: "flex", 
                    gap: "1.25rem", 
                    cursor: "pointer", 
                    padding: "1.25rem", 
                    background: "rgba(255,255,255,0.02)", 
                    border: "1px solid var(--lovanaris-border)",
                    borderRadius: "16px",
                    transition: "all 0.2s ease"
                  }}
                  className="lovanaris-checkbox-card"
                >
                  <input
                    type="checkbox"
                    checked={consents[item.id as keyof typeof consents]}
                    onChange={(e) => setConsents({ ...consents, [item.id]: e.target.checked })}
                    style={{ width: "20px", height: "20px", marginTop: "2px", accentColor: "var(--lovanaris-primary)" }}
                  />
                  <span style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{item.label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", background: "rgba(59, 130, 246, 0.05)", borderRadius: "16px", marginBottom: "3rem", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
              <ShieldAlert size={24} color="var(--lovanaris-primary)" />
              <p style={{ fontSize: "0.85rem", color: "var(--lovanaris-text-muted)", margin: 0 }}>
                <strong>Hinweis:</strong> Dieses Formular ist kein Ersatz für den Notruf oder eine akute Krisenintervention.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!consents.age || !consents.noEmergency || !consents.truth || !consents.redaction || !consents.legal}
              className="btn-lovanaris btn-lovanaris-primary"
              style={{ width: "100%", opacity: (!consents.age || !consents.noEmergency || !consents.truth || !consents.redaction || !consents.legal) ? 0.5 : 1 }}
            >
              Weiter zur Geschichte <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && !submitted && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="lovanaris-form-container"
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Deine Geschichte</h1>
            
            <form onSubmit={handleSubmit}>
              <input type="text" className="hp-field" value={hpValue} onChange={(e) => setHpValue(e.target.value)} tabIndex={-1} autoComplete="off" />

              <div style={{ marginBottom: "2rem", position: "relative" }} ref={selectRef}>
                <label className="lovanaris-label">Trigger-Kategorie</label>
                <div 
                  className="lovanaris-textarea" 
                  style={{ 
                    minHeight: "auto", 
                    padding: "1rem 1.5rem", 
                    cursor: "pointer", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderColor: isSelectOpen ? "var(--lovanaris-primary)" : "var(--lovanaris-border)"
                  }}
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  <span style={{ color: triggerCategory ? "white" : "var(--lovanaris-text-muted)" }}>
                    {triggerCategory || "Bitte wählen..."}
                  </span>
                  <motion.div animate={{ rotate: isSelectOpen ? 180 : 0 }}>
                    <ChevronDown size={20} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isSelectOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 5, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: "var(--lovanaris-surface)",
                        border: "1px solid var(--lovanaris-border)",
                        borderRadius: "16px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                        overflow: "hidden",
                        padding: "0.5rem"
                      }}
                    >
                      {triggerCategories.map(cat => (
                        <div
                          key={cat}
                          style={{
                            padding: "0.875rem 1rem",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: triggerCategory === cat ? "var(--lovanaris-primary-soft)" : "transparent",
                            color: triggerCategory === cat ? "var(--lovanaris-primary)" : "white",
                            fontSize: "0.95rem"
                          }}
                          onClick={() => {
                            setTriggerCategory(cat);
                            setIsSelectOpen(false);
                          }}
                          onMouseEnter={(e) => {
                            if (triggerCategory !== cat) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            if (triggerCategory !== cat) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label className="lovanaris-label">Sicherer Schreibbereich</label>
                <textarea
                  className="lovanaris-textarea"
                  placeholder="Erzähle hier deine Geschichte... (Keine Klarnamen/Orte!)"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  required
                />
              </div>

              <div className="lovanaris-checkbox-group">
                <label className="lovanaris-checkbox-item">
                  <input type="checkbox" checked={consents.anonymity} onChange={(e) => setConsents({...consents, anonymity: e.target.checked})} />
                  <span>Ich habe keine Namen, Orte oder erkennbare Details genannt.</span>
                </label>
                <label className="lovanaris-checkbox-item">
                  <input type="checkbox" checked={consents.truth} onChange={(e) => setConsents({...consents, truth: e.target.checked})} />
                  <span>Ich versichere die Wahrheit der Geschichte nach bestem Wissen.</span>
                </label>
                <label className="lovanaris-checkbox-item">
                  <input type="checkbox" checked={consents.redaction} onChange={(e) => setConsents({...consents, redaction: e.target.checked})} />
                  <span>Ich stimme der redaktionellen Bearbeitung zur Anonymisierung zu.</span>
                </label>
                <label className="lovanaris-checkbox-item">
                  <input type="checkbox" checked={consents.noGuarantee} onChange={(e) => setConsents({...consents, noGuarantee: e.target.checked})} />
                  <span>Mir ist bewusst, dass es keine Garantie auf Veröffentlichung gibt.</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setStep(1)} className="btn-lovanaris btn-lovanaris-outline">Zurück</button>
                <button type="submit" className="btn-lovanaris btn-lovanaris-primary" style={{ flexGrow: 1 }}>
                  <ShieldCheck size={20} /> Final & Anonym absenden
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && submitted && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lovanaris-form-container"
            style={{ textAlign: "center", overflow: "hidden" }}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
            >
              <div style={{ padding: "1.5rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "100px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <CheckCircle size={48} color="var(--lovanaris-accent)" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}
            >
              Geschichte gesichert.
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
              style={{ color: "var(--lovanaris-text-muted)", marginBottom: "3rem" }}
            >
              Deine Stimme wurde anonym im System hinterlegt.
            </motion.p>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              style={{ 
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(0,0,0,0.3) 100%)",
                border: "2px dashed var(--lovanaris-border)",
                padding: "3rem 2rem",
                borderRadius: "24px",
                position: "relative",
                marginBottom: "3rem"
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--lovanaris-primary)", fontWeight: "700", marginBottom: "1rem" }}>
                    Öffentlicher Zugangs-Code
                  </div>
                  <div 
                    style={{ 
                      fontSize: "3.5rem", 
                      fontFamily: "monospace", 
                      letterSpacing: "0.3em", 
                      color: "white",
                      textShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {code}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "10px" }}>Wird benötigt, um den Status deiner Geschichte zu prüfen.</p>
                </div>

                <div style={{ padding: "2rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "16px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                  <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#ef4444", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <ShieldCheck size={16} /> Geheimer Lösch-Key
                  </div>
                  <div 
                    style={{ 
                      fontSize: "1.5rem", 
                      fontFamily: "monospace", 
                      letterSpacing: "0.2em", 
                      color: "white",
                      background: "rgba(0,0,0,0.3)",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #333"
                    }}
                  >
                    {securityToken}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "10px" }}><strong>Diesen Key niemals teilen!</strong> Nur hiermit kannst du später eine Löschung beantragen.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 3000);
                  }} 
                  className="btn-lovanaris btn-lovanaris-outline" 
                >
                  <Copy size={18} /> Code kopieren
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(securityToken);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 3000);
                  }} 
                  className="btn-lovanaris btn-lovanaris-outline"
                >
                  <ShieldCheck size={18} /> Key kopieren
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="lovanaris-crisis-banner" 
              style={{ background: "rgba(245, 158, 11, 0.05)", borderColor: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", textAlign: "left" }}
            >
              <ShieldAlert size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong>DIESEN CODE SICHER AUFBEWAHREN!</strong> Ohne diesen Code hast du keinen Zugriff mehr auf deine Geschichte und wir können sie nicht manuell für dich finden oder löschen.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1 }}
            >
              <Link href="/" className="btn-lovanaris btn-lovanaris-primary" style={{ marginTop: "2rem", width: "100%" }}>
                Zurück zur Übersicht
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(17, 20, 26, 0.95)",
              border: "1px solid var(--lovanaris-primary)",
              padding: "1rem 2rem",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(59, 130, 246, 0.2)",
              zIndex: 1000,
              color: "white",
              fontWeight: "600"
            }}
          >
            <CheckCircle size={18} color="var(--lovanaris-primary)" />
              Code in Zwischenablage kopiert
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
