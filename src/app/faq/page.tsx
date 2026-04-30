"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck, Trash2, EyeOff } from "lucide-react";
import Link from "next/link";

const faqData = [
  {
    question: "Wie anonym bin ich wirklich?",
    answer: "Wir speichern konsequent keine IP-Adressen und verlangen keine E-Mail-Adressen oder Namen. Deine Geschichte wird in unserer Datenbank nur mit dem von dir generierten Code verknüpft. Es gibt keine technische Möglichkeit für uns, deine Identität zurückzuverfolgen.",
    icon: <EyeOff size={20} />
  },
  {
    question: "Wer liest meine Geschichte?",
    answer: "Jede Einsendung wird vor einer Veröffentlichung manuell von der redaktionellen Leitung (Robin) gelesen und anonymisiert. Es werden Namen, Orte oder spezifische Details geändert, falls diese Rückschlüsse auf deine Identität zulassen könnten.",
    icon: <ShieldCheck size={20} />
  },
  {
    question: "Kann ich meine Geschichte wieder löschen lassen?",
    answer: "Ja, jederzeit. Gehe dazu auf den Bereich 'Status', gib deinen Code ein und nutze die dortige Option zur Löschung. Bitte beachte: Ohne deinen Code können wir deine Geschichte systembedingt nicht finden oder löschen, da wir keine anderen Identifikationsmerkmale speichern.",
    icon: <Trash2 size={20} />
  },
  {
    question: "Wie lange dauert die Prüfung?",
    answer: "Da wir jede Geschichte mit der gebotenen Sorgfalt und emotionalen Aufmerksamkeit lesen, kann die Prüfung zwischen einigen Tagen und zwei Wochen dauern. Du kannst den Status jederzeit anonym über deinen Code abrufen.",
    icon: <MessageCircle size={20} />
  },
  {
    question: "Was passiert bei Missbrauch des Formulars?",
    answer: "Wir prüfen jede Geschichte auf Plausibilität. Offensichtliche Falschmeldungen, Spam oder Versuche der Diffamierung werden sofort gelöscht. Lovanaris ist ein geschützter Raum für echte Erfahrungen.",
    icon: <ShieldCheck size={20} />
  },
  {
    question: "Welche Daten werden dauerhaft gespeichert?",
    answer: "Nur der Text deiner Geschichte und der zugehörige Code. Nicht veröffentlichte Geschichten werden nach spätestens 30 Tagen automatisch aus unserem System gelöscht.",
    icon: <ShieldCheck size={20} />
  },
  {
    question: "Wie verhindert ihr Missbrauch oder Angriffe?",
    answer: "Um Spam und das unbefugte 'Erraten' von Codes zu verhindern, setzen wir ein anonymisiertes Sicherheitssystem ein. Wenn zu viele Fehlversuche oder Einsendungen von derselben Verbindung registriert werden, erfolgt eine temporäre Sperre. Dabei wird deine IP-Adresse sofort in einen anonymen Zahlencode umgewandelt (Hashed), sodass wir deine Identität niemals erfahren.",
    icon: <ShieldCheck size={20} />
  },
  {
    question: "Wird meine Geschichte in einem Video vorgelesen?",
    answer: "Das Ziel des Projekts ist es, Betroffenen eine Stimme zu geben. Viele Geschichten werden (anonymisiert) in Videos thematisiert. Mit deiner Einsendung gibst du dazu dein Einverständnis. Wir können jedoch nicht garantieren, dass jede Einsendung vertont wird.",
    icon: <HelpCircle size={20} />
  }
];

function AccordionItem({ item, isOpen, onClick }: { item: typeof faqData[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div className="lovanaris-card" style={{ marginBottom: "1rem", padding: "0", overflow: "hidden", cursor: "pointer" }} onClick={onClick}>
      <div style={{ padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ color: "var(--lovanaris-primary)" }}>{item.icon}</div>
          <h3 style={{ fontSize: "1.125rem", margin: 0, fontWeight: "600" }}>{item.question}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} color="var(--lovanaris-text-muted)" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div style={{ padding: "0 2rem 2rem 4rem", color: "var(--lovanaris-text-muted)", lineHeight: "1.6", fontSize: "0.95rem" }}>
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LovanarisFaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="lovanaris-content" style={{ paddingBottom: "100px" }}>
      <header className="lovanaris-page-header">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lovanaris-section-label">
          Häufige Fragen (FAQ)
        </motion.div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>Antworten auf deine Fragen</h1>
        <p style={{ color: "var(--lovanaris-text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.125rem", lineHeight: "1.6" }}>
          Hier findest du alles Wissenswerte zum Ablauf, zur Sicherheit und zum Datenschutz bei Lovanaris.
        </p>
      </header>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqData.map((item, index) => (
          <AccordionItem 
            key={index} 
            item={item} 
            isOpen={openIndex === index} 
            onClick={() => setOpenIndex(openIndex === index ? null : index)} 
          />
        ))}

        <div className="lovanaris-legal-block" style={{ marginTop: "4rem", textAlign: "center" }}>
          <h3 style={{ marginBottom: "1rem", color: "white" }}>Nicht das Richtige dabei?</h3>
          <p style={{ marginBottom: "2rem" }}>Schreib uns direkt eine E-Mail oder schau dir unser detailliertes Regelwerk an.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/regelwerk" className="btn-lovanaris btn-lovanaris-outline">Regelwerk lesen</Link>
            <a href="mailto:kontakt@einfach-robin.de" className="btn-lovanaris btn-lovanaris-primary">Kontakt aufnehmen</a>
          </div>
        </div>
      </div>
    </div>
  );
}
