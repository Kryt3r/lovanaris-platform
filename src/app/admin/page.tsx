"use client";

import React, { useEffect, useState } from "react";
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  History, 
  Settings, 
  LogOut, 
  RefreshCcw,
  Loader2,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Trash2
} from "lucide-react";
import { 
  adminGetAllSubmissionsAction, 
  adminGetSubmissionDetailsAction,
  adminUpdateSubmissionAction, 
  adminDeleteSubmissionAction,
  adminLockSubmissionAction,
  adminUnlockSubmissionAction
} from "@/lib/actions/lovanaris";
import { logoutLovanarisAction, getLovanarisSession } from "@/lib/actions/lovanaris-auth";
import { useRouter } from "next/navigation";

export default function LovanarisAdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const sess = await getLovanarisSession();
      if (!sess) {
        router.push("/login");
        return;
      }
      setSession(sess);
      const res = await adminGetAllSubmissionsAction();
      if (res.success) setSubmissions(res.data || []);
      setLoading(false);
    }
    init();
  }, []);

  const loadData = async () => {
    setUpdating(true);
    const res = await adminGetAllSubmissionsAction();
    if (res.success) setSubmissions(res.data || []);
    setUpdating(false);
  };

  const handleSelect = async (s: any) => {
    const lock = await adminLockSubmissionAction(s.id);
    if (!lock.success) return alert(lock.error);
    
    setUpdating(true);
    const details = await adminGetSubmissionDetailsAction(s.id);
    if (details.success) setSelectedSubmission(details.data);
    setUpdating(false);
  };

  if (loading || !session) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>Lade Dashboard...</div>;

  const myTicketsCount = submissions.filter(s => s.lockedBy === session.admin.id).length;

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100%",
      background: "#0a0a0a",
      paddingTop: "120px", 
      boxSizing: "border-box",
      color: "white"
    }}>
      {/* SIDEBAR */}
      <div style={{ 
        width: "300px", 
        borderRight: "1px solid #222", 
        padding: "2rem", 
        display: "flex", 
        flexDirection: "column",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3rem" }}>
          <Shield color="#3b82f6" size={28} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>LOVANARIS ADMIN</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <NavButton active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} icon={<LayoutDashboard size={20}/>} label="Alle Tickets" />
          <NavButton active={activeTab === "my_tickets"} onClick={() => setActiveTab("my_tickets")} icon={<Briefcase size={20}/>} label="Meine Tickets" count={myTicketsCount} />
          
          <div style={{ height: "1px", background: "#222", margin: "10px 0" }} />
          
          <NavButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={<History size={20}/>} label="Audit-Logs" />
          <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={20}/>} label="Einstellungen" />
        </div>

        <div style={{ marginTop: "auto", borderTop: "1px solid #222", paddingTop: "1rem" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
            <strong>{session.admin.name}</strong><br/>
            <span style={{ color: "#666" }}>{session.admin.role}</span>
          </div>
          <button onClick={() => logoutLovanarisAction().then(() => router.push("/login"))} style={{ width: "100%", background: "#1a0a0a", border: "1px solid #300", color: "#ef4444", padding: "0.75rem", borderRadius: "8px", cursor: "pointer" }}>
            Abmelden
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{activeTab === "tickets" ? "Ticket-Pool" : "Ansicht"}</h1>
          <button onClick={loadData} style={{ background: "#222", border: "1px solid #333", color: "white", padding: "0.75rem 1.25rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCcw size={18} className={updating ? "animate-spin" : ""} /> Aktualisieren
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2rem" }}>
          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {submissions.filter(s => activeTab === "my_tickets" ? s.lockedBy === session.admin.id : true).map(s => (
              <div 
                key={s.id} 
                onClick={() => handleSelect(s)}
                style={{ 
                  background: "#111", 
                  padding: "1.25rem", 
                  borderRadius: "12px", 
                  border: "1px solid #222",
                  cursor: "pointer",
                  borderLeft: `4px solid ${s.status === 'pending' ? '#3b82f6' : '#10b981'}`
                }}
              >
                <div style={{ fontSize: "0.7rem", color: "#666", marginBottom: "5px" }}>#{s.code}</div>
                <div style={{ fontWeight: "bold" }}>{s.category}</div>
                {s.lockedBy && <div style={{ fontSize: "0.6rem", color: "#ef4444", marginTop: "5px" }}><Lock size={10}/> Bearbeitet von {s.lockerName}</div>}
              </div>
            ))}
          </div>

          {/* Details */}
          <div style={{ background: "#111", padding: "2.5rem", borderRadius: "20px", border: "1px solid #222" }}>
            {selectedSubmission ? (
              <div>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>{selectedSubmission.category}</h2>
                <div style={{ background: "#000", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem", whiteSpace: "pre-wrap" }}>
                  {selectedSubmission.story}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => setSelectedSubmission(null)}>Schließen</button>
                </div>
              </div>
            ) : (
              <div style={{ color: "#444", textAlign: "center", paddingTop: "5rem" }}>Wähle ein Ticket aus.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, count }: any) {
  return (
    <button 
      onClick={onClick} 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "0.85rem 1rem", 
        borderRadius: "10px", 
        background: active ? "#1a2535" : "transparent", 
        color: active ? "#3b82f6" : "#888", 
        border: "none", 
        cursor: "pointer", 
        width: "100%",
        textAlign: "left"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {icon}
        <span style={{ fontWeight: active ? "bold" : "normal" }}>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span style={{ background: "#3b82f6", color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "0.7rem" }}>{count}</span>
      )}
    </button>
  );
}
