"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Copy, ArrowRight, EyeOff, ShieldCheck, ChevronDown, Loader2, BookOpen, Lock, FileCheck, AlertTriangle, Heart } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Security / Anti-Spam
  const [startTime] = useState(Date.now());
  const [hpValue, setHpValue] = useState(""); // Honeypot
  
  // Reduzierte, essenzielle Consents
  const [consents, setConsents] = useState({
    notEmergency: false,
    age: false,
    anonymized: false,
    understood: false
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

  const allConsentsGiven = consents.notEmergency && consents.age && consents.anonymized && consents.understood;

  const validateStep1 = () => {
    if (allConsentsGiven) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      alert("Bitte wähle eine passende Kategorie aus.");
      return;
    }

    // Server-side save
    setLoading(true);
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
    setLoading(false);
  };

  const [showCopyToast, setShowCopyToast] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  return (
    <div className="lovanaris-form-wrapper">
      
      {/* Step Indicator */}
      <div className="lovanaris-step-indicator">
        <div className={`lovanaris-step ${step >= 1 ? "active" : ""}`} />
        <div className={`lovanaris-step ${step >= 2 ? "active" : ""}`} />
        <div className={`lovanaris-step ${step >= 3 ? "active" : ""}`} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lovanaris-form-container"
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, var(--lovanaris-primary-soft) 0%, rgba(181, 99, 69, 0.2) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  border: "1px solid rgba(181, 99, 69, 0.2)"
                }}
              >
                <BookOpen size={32} color="var(--lovanaris-primary)" />
              </motion.div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--lovanaris-text)" }}>
                Deine Geschichte teilen
              </h1>
              <p style={{ color: "var(--lovanaris-text-muted)", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
                Ein sicherer Raum für Erlebnisse, die erzählt werden müssen.
              </p>
            </div>

            {/* Info Cards */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
              gap: "1rem",
              marginBottom: "2.5rem" 
            }}>
              <InfoCard 
                icon={<EyeOff size={22} />}
                title="Vollständig anonym"
                description="Keine Namen, keine E-Mail, keine IP-Speicherung. Deine Identität bleibt geschützt."
              />
              <InfoCard 
                icon={<Heart size={22} />}
                title="Andere ermutigen"
                description="Deine Geschichte kann anderen Betroffenen helfen, sich nicht allein zu fühlen."
              />
              <InfoCard 
                icon={<Lock size={22} />}
                title="Du behältst die Kontrolle"
                description="Mit deinem persönlichen Lösch-Code kannst du deine Geschichte jederzeit entfernen lassen."
              />
            </div>

            {/* Crisis Banner */}
            <div className="lovanaris-crisis-banner" style={{ marginBottom: "2rem" }}>
              <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Kein Krisendienst</strong>
                <span style={{ opacity: 0.9 }}>
                  Befindest du dich in akuter Gefahr? Kontaktiere sofort die 
                  <strong> Polizei (110)</strong> oder das <strong>Hilfetelefon (116 016)</strong>.
                </span>
              </div>
            </div>

            {/* Anonymity Notice */}
            <div style={{
              background: "linear-gradient(135deg, rgba(181, 99, 69, 0.08) 0%, rgba(151, 79, 55, 0.05) 100%)",
              border: "1px solid rgba(181, 99, 69, 0.2)",
              borderRadius: "20px",
              padding: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(181, 99, 69, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <ShieldCheck size={20} color="var(--lovanaris-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--lovanaris-text)" }}>
                    Wie wir Anonymität gewährleisten
                  </h3>
                  <ul style={{ 
                    fontSize: "0.9rem", 
                    color: "var(--lovanaris-text-muted)", 
                    lineHeight: 1.7,
                    paddingLeft: "1.25rem",
                    margin: 0
                  }}>
                    <li>Keine Account-Erstellung nötig</li>
                    <li>Keine Speicherung von IP-Adressen oder Metadaten</li>
                    <li>Redaktionelle Prüfung auf erkennbare Details vor Veröffentlichung</li>
                    <li>Hosting auf deutschen Servern mit DSGVO-Compliance</li>
                  </ul>
                  <p style={{ 
                    fontSize: "0.85rem", 
                    color: "var(--lovanaris-text-muted)", 
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(181, 99, 69, 0.15)"
                  }}>
                    <strong style={{ color: "var(--lovanaris-accent)" }}>Wichtiger Hinweis:</strong> Wir setzen alles daran, deine Anonymität zu schützen. 
                    Dennoch kann eine 100%ige Garantie in der digitalen Welt nie vollständig gegeben werden. 
                    Bitte verzichte daher aus eigenem Schutz auf Klarnamen, Orte oder datierbare Ereignisse.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ 
                fontSize: "0.875rem", 
                fontWeight: 700, 
                textTransform: "uppercase", 
                letterSpacing: "0.05em",
                color: "var(--lovanaris-text)",
                marginBottom: "1rem"
              }}>
                Bitte bestätige vor dem Weitergehen:
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <ConsentCheckbox
                  id="notEmergency"
                  checked={consents.notEmergency}
                  onChange={(checked) => setConsents({ ...consents, notEmergency: checked })}
                  label="Ich befinde mich aktuell nicht in einer akuten Notlage."
                  sublabel="Ich weiß, dass dies hier kein Krisendienst ist."
                />
                
                <ConsentCheckbox
                  id="age"
                  checked={consents.age}
                  onChange={(checked) => setConsents({ ...consents, age: checked })}
                  label="Ich bin mindestens 18 Jahre alt."
                  sublabel="Oder ich habe die Zustimmung meiner Erziehungsberechtigten."
                />
                
                <ConsentCheckbox
                  id="anonymized"
                  checked={consents.anonymized}
                  onChange={(checked) => setConsents({ ...consents, anonymized: checked })}
                  label="Ich werde keine Klarnamen, Orte oder erkennbare Details nennen."
                  sublabel="Zum Schutz aller Beteiligten und meiner eigenen Anonymität."
                />
                
                <ConsentCheckbox
                  id="understood"
                  checked={consents.understood}
                  onChange={(checked) => setConsents({ ...consents, understood: checked })}
                  label="Ich verstehe, dass meine Geschichte redaktionell geprüft wird."
                  sublabel="Das schützt dich und andere. Eine Veröffentlichung ist nicht garantiert."
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={validateStep1}
              disabled={!allConsentsGiven}
              className="btn-lovanaris btn-lovanaris-primary"
              style={{ 
                width: "100%", 
                padding: "1.1rem",
                fontSize: "1rem",
                opacity: allConsentsGiven ? 1 : 0.5,
                cursor: allConsentsGiven ? "pointer" : "not-allowed"
              }}
            >
              Weiter zum Schreiben <ArrowRight size={18} />
            </button>

            <p style={{ 
              textAlign: "center", 
              fontSize: "0.8rem", 
              color: "var(--lovanaris-text-muted)", 
              marginTop: "1.5rem" 
            }}>
              Mit dem Weitergehen akzeptierst du unsere{" "}
              <Link href="/regelwerk" style={{ color: "var(--lovanaris-primary)", textDecoration: "underline" }}>
                Nutzungsbedingungen
              </Link>
            </p>
          </motion.div>
        )}

        {step === 2 && !submitted && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lovanaris-form-container"
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Deine Geschichte
              </h1>
              <p style={{ color: "var(--lovanaris-text-muted)" }}>
                Nimm dir Zeit. Es ist okay, wenn es schwer fällt.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <input type="text" className="hp-field" value={hpValue} onChange={(e) => setHpValue(e.target.value)} tabIndex={-1} autoComplete="off" />

              {/* Category Select */}
              <div style={{ marginBottom: "1.5rem", position: "relative" }} ref={selectRef}>
                <label className="lovanaris-label">Themenbereich</label>
                <div 
                  className="lovanaris-textarea" 
                  style={{ 
                    minHeight: "auto", 
                    padding: "1rem 1.25rem", 
                    cursor: "pointer", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderColor: isSelectOpen ? "var(--lovanaris-primary)" : "var(--lovanaris-border)"
                  }}
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  <span style={{ color: triggerCategory ? "var(--lovanaris-text)" : "var(--lovanaris-text-muted)" }}>
                    {triggerCategory || "Wähle einen passenden Bereich..."}
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
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        padding: "0.5rem",
                        marginTop: "0.5rem"
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
                            color: triggerCategory === cat ? "var(--lovanaris-primary)" : "var(--lovanaris-text)",
                            fontSize: "0.95rem"
                          }}
                          onClick={() => {
                            setTriggerCategory(cat);
                            setIsSelectOpen(false);
                          }}
                          onMouseEnter={(e) => {
                            if (triggerCategory !== cat) e.currentTarget.style.background = "rgba(85, 73, 61, 0.05)";
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

              {/* Story Textarea */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label className="lovanaris-label">Deine Erzählung</label>
                <textarea
                  className="lovanaris-textarea"
                  placeholder="Hier ist dein sicherer Raum...&#10;&#10;Erzähle, was du erlebt hast. Wie hat es sich angefühlt? Was möchtest du anderen mitgeben?&#10;&#10;Denke daran: Keine Klarnamen, keine spezifischen Orte, keine datierbaren Details."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  required
                  style={{ minHeight: "320px" }}
                />
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginTop: "0.75rem",
                  fontSize: "0.8rem",
                  color: "var(--lovanaris-text-muted)"
                }}>
                  <span>{story.length} Zeichen {story.length < 100 && `(min. 100)`}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <EyeOff size={14} />
                    Wird anonym gespeichert
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="btn-lovanaris btn-lovanaris-outline"
                  style={{ padding: "1rem 1.5rem" }}
                >
                  Zurück
                </button>
                <button 
                  type="submit" 
                  disabled={loading || story.length < 100 || !triggerCategory} 
                  className="btn-lovanaris btn-lovanaris-primary" 
                  style={{ 
                    flexGrow: 1, 
                    padding: "1rem",
                    opacity: (loading || story.length < 100 || !triggerCategory) ? 0.5 : 1,
                    cursor: (loading || story.length < 100 || !triggerCategory) ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Wird gesendet...</>
                  ) : (
                    <><Send size={18} /> Geschichte anonym einreichen</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && submitted && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lovanaris-form-container"
            style={{ textAlign: "center" }}
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
              style={{ 
                width: "80px",
                height: "80px",
                borderRadius: "28px",
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 20px 40px rgba(22, 163, 74, 0.3)"
              }}
            >
              <CheckCircle size={40} color="white" />
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "var(--lovanaris-text)" }}
            >
              Danke für dein Vertrauen
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              style={{ color: "var(--lovanaris-text-muted)", marginBottom: "2.5rem", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}
            >
              Deine Geschichte wurde sicher und anonym gespeichert. Sie wird nun redaktionell geprüft.
            </motion.p>

            {/* Codes Container */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
              style={{
                background: "var(--lovanaris-bg)",
                border: "2px dashed var(--lovanaris-border)",
                borderRadius: "24px",
                padding: "2rem",
                marginBottom: "2rem"
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ 
                  fontSize: "0.75rem", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.15em", 
                  color: "var(--lovanaris-primary)", 
                  fontWeight: 700, 
                  marginBottom: "0.75rem" 
                }}>
                  Öffentlicher Zugangs-Code
                </div>
                <div style={{
                  fontSize: "2.5rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  color: "var(--lovanaris-text)",
                  fontWeight: 600
                }}>
                  {code}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--lovanaris-text-muted)", marginTop: "0.5rem" }}>
                  Damit kannst du den Status deiner Geschichte prüfen
                </p>
              </div>

              <div style={{ 
                padding: "1.5rem", 
                background: "rgba(220, 38, 38, 0.05)", 
                borderRadius: "16px", 
                border: "1px solid rgba(220, 38, 38, 0.15)"
              }}>
                <div style={{ 
                  fontSize: "0.75rem", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.15em", 
                  color: "#dc2626", 
                  fontWeight: 700, 
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <Lock size={14} /> Geheimer Lösch-Key
                </div>
                <div style={{
                  fontSize: "1.25rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                  color: "var(--lovanaris-text)",
                  background: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid var(--lovanaris-border)",
                  wordBreak: "break-all"
                }}>
                  {securityToken}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#dc2626", marginTop: "0.75rem", fontWeight: 500 }}>
                  Diesen Key niemals teilen! Nur damit kannst du deine Geschichte löschen lassen.
                </p>
              </div>

              {/* Copy Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
                <button 
                  onClick={() => copyToClipboard(code)} 
                  className="btn-lovanaris btn-lovanaris-outline"
                  style={{ fontSize: "0.875rem", padding: "0.75rem 1.25rem" }}
                >
                  <Copy size={16} /> Code kopieren
                </button>
                <button 
                  onClick={() => copyToClipboard(securityToken)} 
                  className="btn-lovanaris btn-lovanaris-outline"
                  style={{ fontSize: "0.875rem", padding: "0.75rem 1.25rem" }}
                >
                  <Lock size={16} /> Key kopieren
                </button>
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.6 }}
              style={{
                background: "rgba(217, 119, 6, 0.08)",
                border: "1px solid rgba(217, 119, 6, 0.2)",
                borderRadius: "16px",
                padding: "1.25rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                textAlign: "left",
                marginBottom: "1.5rem"
              }}
            >
              <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.9rem", color: "var(--lovanaris-text)", lineHeight: 1.6 }}>
                <strong>Bitte bewahre beide Codes sicher auf.</strong> Ohne sie kannst du weder den Status prüfen noch eine Löschung beantragen. 
                Wir können verlorene Codes nicht wiederherstellen.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.7 }}
            >
              <Link href="/" className="btn-lovanaris btn-lovanaris-primary" style={{ width: "100%" }}>
                Zurück zur Startseite
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Toast */}
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
              background: "var(--lovanaris-text)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              zIndex: 1000,
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            <CheckCircle size={18} color="#22c55e" />
            In Zwischenablage kopiert
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid var(--lovanaris-border)",
      borderRadius: "16px",
      padding: "1.25rem",
      transition: "all 0.2s ease"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "var(--lovanaris-primary-soft)",
        color: "var(--lovanaris-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "0.875rem"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.375rem", color: "var(--lovanaris-text)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--lovanaris-text-muted)", lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

function ConsentCheckbox({ 
  id, 
  checked, 
  onChange, 
  label, 
  sublabel 
}: { 
  id: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label: string;
  sublabel: string;
}) {
  return (
    <label 
      style={{ 
        display: "flex", 
        gap: "1rem", 
        cursor: "pointer", 
        padding: "1.25rem", 
        background: checked ? "rgba(181, 99, 69, 0.06)" : "white", 
        border: `2px solid ${checked ? "var(--lovanaris-primary)" : "var(--lovanaris-border)"}`,
        borderRadius: "16px",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{
        width: "22px",
        height: "22px",
        borderRadius: "6px",
        border: `2px solid ${checked ? "var(--lovanaris-primary)" : "var(--lovanaris-border)"}`,
        background: checked ? "var(--lovanaris-primary)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: "2px",
        transition: "all 0.2s ease"
      }}>
        {checked && <FileCheck size={14} color="white" />}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
      <div>
        <span style={{ 
          fontSize: "0.95rem", 
          fontWeight: 500, 
          color: "var(--lovanaris-text)",
          display: "block",
          marginBottom: "0.25rem"
        }}>
          {label}
        </span>
        <span style={{ 
          fontSize: "0.85rem", 
          color: "var(--lovanaris-text-muted)",
          display: "block"
        }}>
          {sublabel}
        </span>
      </div>
    </label>
  );
}
