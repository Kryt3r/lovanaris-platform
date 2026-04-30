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
  Trash2,
  Inbox,
  User,
  ShieldCheck,
  Search,
  ChevronRight,
  Filter,
  Eye
} from "lucide-react";
import { 
  adminGetAllSubmissionsAction, 
  adminGetSubmissionDetailsAction,
  adminUpdateSubmissionAction, 
  adminDeleteSubmissionAction,
  adminLockSubmissionAction,
  adminUnlockSubmissionAction
} from "@/lib/actions/lovanaris";
import { 
  adminGetAllContactRequestsAction, 
  adminUpdateContactStatusAction 
} from "@/lib/actions/lovanaris-contact";
import { logoutLovanarisAction, getLovanarisSession } from "@/lib/actions/lovanaris-auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LovanarisAdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const sess = await getLovanarisSession();
      if (!sess) {
        router.push("/login");
        return;
      }
      setSession(sess);
      await loadData();
      setLoading(false);
    }
    init();
  }, []);

  const loadData = async () => {
    setUpdating(true);
    const subRes = await adminGetAllSubmissionsAction();
    if (subRes.success) setSubmissions(subRes.data || []);
    
    const contactRes = await adminGetAllContactRequestsAction();
    if (contactRes.success) setContactRequests(contactRes.data || []);
    setUpdating(false);
  };

  const handleSelectSubmission = async (s: any) => {
    setUpdating(true);
    const lock = await adminLockSubmissionAction(s.id);
    if (!lock.success) {
      setUpdating(false);
      return alert(lock.error);
    }
    
    const details = await adminGetSubmissionDetailsAction(s.id);
    if (details.success) setSelectedItem({ ...details.data, _type: 'submission' });
    setUpdating(false);
  };

  const handleSelectContact = (c: any) => {
    setSelectedItem({ ...c, _type: 'contact' });
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setUpdating(true);
    const res = await adminUpdateSubmissionAction(id, { status, adminMessage });
    if (res.success) {
      await loadData();
      setSelectedItem(null);
      setAdminMessage("");
    }
    setUpdating(false);
  };

  const handleUpdateContactStatus = async (id: number, status: string) => {
    setUpdating(true);
    const res = await adminUpdateContactStatusAction(id, status);
    if (res.success) {
      await loadData();
      setSelectedItem(null);
    }
    setUpdating(false);
  };

  if (loading || !session) return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050505", color: "white" }}>
      <Loader2 className="animate-spin" size={40} color="#3b82f6" />
      <p style={{ marginTop: "1rem", color: "#666" }}>Initialisiere Dashboard...</p>
    </div>
  );

  const myTicketsCount = submissions.filter(s => s.lockedBy === session.admin.id).length;
  const pendingRequestsCount = contactRequests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100%",
      background: "#080808",
      color: "#e5e7eb",
      fontFamily: "Inter, sans-serif",
      overflow: "hidden"
    }}>
      {/* SIDEBAR */}
      <aside style={{ 
        width: "280px", 
        background: "#0c0c0c",
        borderRight: "1px solid #1a1a1a", 
        display: "flex", 
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 100
      }}>
        <div style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)", 
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
          }}>
            <Shield color="white" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "1.1rem", letterSpacing: "-0.02em" }}>LOVANARIS</div>
            <div style={{ fontSize: "0.7rem", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Console</div>
          </div>
        </div>

        <nav style={{ padding: "0 1rem", flex: 1 }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "700", textTransform: "uppercase", padding: "0 1rem 0.75rem", letterSpacing: "0.1em" }}>Übersicht</div>
            <NavButton active={activeTab === "tickets"} onClick={() => { setActiveTab("tickets"); setSelectedItem(null); }} icon={<LayoutDashboard size={18}/>} label="Ticket-Pool" />
            <NavButton active={activeTab === "my_tickets"} onClick={() => { setActiveTab("my_tickets"); setSelectedItem(null); }} icon={<Briefcase size={18}/>} label="Meine Tickets" count={myTicketsCount} />
            <NavButton active={activeTab === "contacts"} onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }} icon={<Inbox size={18}/>} label="Kontaktanfragen" count={pendingRequestsCount} />
          </div>

          <div>
            <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "700", textTransform: "uppercase", padding: "0 1rem 0.75rem", letterSpacing: "0.1em" }}>System</div>
            <NavButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={<History size={18}/>} label="Audit-Logs" />
            <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={18}/>} label="Einstellungen" />
          </div>
        </nav>

        <div style={{ padding: "1.5rem", borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <div style={{ width: "36px", height: "36px", background: "#222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#888" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.admin.name}</div>
              <div style={{ fontSize: "0.7rem", color: "#555", textTransform: "capitalize" }}>{session.admin.role.replace('_', ' ')}</div>
            </div>
          </div>
          <button 
            onClick={() => logoutLovanarisAction().then(() => router.push("/login"))} 
            style={{ 
              width: "100%", 
              background: "rgba(239, 68, 68, 0.05)", 
              border: "1px solid rgba(239, 68, 68, 0.1)", 
              color: "#ef4444", 
              padding: "0.75rem", 
              borderRadius: "10px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)"}
          >
            <LogOut size={16} /> Abmelden
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ 
          height: "72px", 
          borderBottom: "1px solid #1a1a1a", 
          padding: "0 2rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          background: "#080808"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
            <div style={{ position: "relative", width: "300px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
              <input 
                type="text" 
                placeholder="Suche..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  width: "100%", 
                  background: "#111", 
                  border: "1px solid #222", 
                  padding: "0.6rem 1rem 0.6rem 2.5rem", 
                  borderRadius: "8px", 
                  color: "white", 
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              onClick={loadData} 
              disabled={updating}
              style={{ 
                background: "#111", 
                border: "1px solid #222", 
                color: "#888", 
                width: "40px", 
                height: "40px", 
                borderRadius: "8px", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#444"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
            >
              <RefreshCcw size={18} className={updating ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* List Section */}
          <div style={{ 
            width: "400px", 
            borderRight: "1px solid #1a1a1a", 
            overflowY: "auto", 
            padding: "1.5rem",
            background: "#090909"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>
                {activeTab === "tickets" ? "Ticket Pool" : activeTab === "my_tickets" ? "Meine Tickets" : "Kontaktanfragen"}
              </h2>
              <div style={{ fontSize: "0.75rem", color: "#555", fontWeight: "600" }}>
                {activeTab === "contacts" ? contactRequests.length : submissions.length} EINTRÄGE
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {activeTab === "contacts" ? (
                contactRequests.map(r => (
                  <ItemCard 
                    key={r.id}
                    active={selectedItem?.id === r.id && selectedItem?._type === 'contact'}
                    onClick={() => handleSelectContact(r)}
                    title={r.type === 'deletion' ? 'Löschantrag' : 'Allgemeine Anfrage'}
                    subtitle={r.type === 'deletion' ? `Code: ${r.storyCode}` : r.email}
                    status={r.status}
                    date={r.createdAt}
                    icon={<Inbox size={16} />}
                  />
                ))
              ) : (
                submissions
                  .filter(s => activeTab === "my_tickets" ? s.lockedBy === session.admin.id : true)
                  .filter(s => s.code.includes(searchTerm.toUpperCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(s => (
                  <ItemCard 
                    key={s.id}
                    active={selectedItem?.id === s.id && selectedItem?._type === 'submission'}
                    onClick={() => handleSelectSubmission(s)}
                    title={s.category}
                    subtitle={`#${s.code}`}
                    status={s.status}
                    date={s.createdAt}
                    lockedBy={s.lockerName}
                    icon={<MessageSquare size={16} />}
                  />
                ))
              )}
            </div>
          </div>

          {/* Detail Section */}
          <div style={{ flex: 1, background: "#080808", overflowY: "auto", padding: "3rem" }}>
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div 
                  key={selectedItem.id + selectedItem._type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          borderRadius: "6px", 
                          background: "rgba(59, 130, 246, 0.1)", 
                          color: "#3b82f6", 
                          fontSize: "0.7rem", 
                          fontWeight: "700",
                          textTransform: "uppercase"
                        }}>
                          {selectedItem._type === 'submission' ? 'Submission' : 'Support Request'}
                        </span>
                        <span style={{ color: "#444", fontSize: "0.8rem" }}>
                          Eingegangen am {new Date(selectedItem.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", margin: 0, letterSpacing: "-0.03em" }}>
                        {selectedItem._type === 'submission' ? selectedItem.category : (selectedItem.type === 'deletion' ? 'Löschungsantrag' : 'Kontaktanfrage')}
                      </h1>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {selectedItem._type === 'submission' && (
                        <button 
                          onClick={() => adminUnlockSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); })}
                          style={{ background: "#111", border: "1px solid #222", color: "#888", padding: "0.6rem 1.25rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                        >
                          Freigeben
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "3rem" }}>
                    <div>
                      <div style={{ 
                        background: "#0c0c0c", 
                        border: "1px solid #1a1a1a", 
                        borderRadius: "20px", 
                        padding: "2.5rem",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                      }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>Inhalt / Nachricht</div>
                        <div style={{ 
                          fontSize: "1.1rem", 
                          lineHeight: "1.7", 
                          color: "#d1d5db",
                          whiteSpace: "pre-wrap"
                        }}>
                          {selectedItem._type === 'submission' ? selectedItem.story : selectedItem.message}
                        </div>
                      </div>

                      {selectedItem._type === 'submission' && (
                        <div style={{ marginTop: "3rem" }}>
                          <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.1em" }}>Antwort / Status-Update</div>
                          <textarea 
                            value={adminMessage}
                            onChange={e => setAdminMessage(e.target.value)}
                            placeholder="Schreibe eine Nachricht an den Nutzer oder eine interne Notiz..."
                            style={{ 
                              width: "100%", 
                              background: "#0c0c0c", 
                              border: "1px solid #1a1a1a", 
                              borderRadius: "16px", 
                              padding: "1.5rem", 
                              color: "white", 
                              fontSize: "1rem",
                              outline: "none",
                              minHeight: "150px",
                              resize: "vertical",
                              marginBottom: "1.5rem"
                            }}
                          />
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button 
                              onClick={() => handleUpdateStatus(selectedItem.id, 'approved')}
                              style={{ flex: 1, background: "#10b981", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                            >
                              <CheckCircle size={18} /> Veröffentlichen
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedItem.id, 'info_needed')}
                              style={{ flex: 1, background: "#3b82f6", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                            >
                              <MessageSquare size={18} /> Rückfrage senden
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')}
                              style={{ flex: 1, background: "#ef4444", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                            >
                              <XCircle size={18} /> Ablehnen
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedItem._type === 'contact' && selectedItem.status === 'pending' && (
                        <div style={{ marginTop: "3rem" }}>
                          <button 
                            onClick={() => handleUpdateContactStatus(selectedItem.id, 'processed')}
                            style={{ width: "100%", background: "#3b82f6", color: "white", border: "none", padding: "1.25rem", borderRadius: "16px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                          >
                            <CheckCircle size={20} /> Als bearbeitet markieren
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Meta Sidebar */}
                    <div>
                      <div style={{ background: "#0c0c0c", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "1.5rem", marginBottom: "2rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.1em" }}>Details</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                          {selectedItem._type === 'submission' ? (
                            <>
                              <MetaItem label="Code" value={selectedItem.code} icon={<Lock size={14}/>} />
                              <MetaItem label="Kategorie" value={selectedItem.category} icon={<Filter size={14}/>} />
                              <MetaItem label="Sicherheits-Token" value={selectedItem.securityToken || 'Nicht vorhanden'} icon={<ShieldCheck size={14}/>} />
                            </>
                          ) : (
                            <>
                              <MetaItem label="E-Mail" value={selectedItem.email || 'N/A'} icon={<Inbox size={14}/>} />
                              <MetaItem label="Story-Code" value={selectedItem.storyCode || 'N/A'} icon={<ShieldCheck size={14}/>} />
                              <MetaItem label="Sicherheits-Token" value={selectedItem.securityToken || 'N/A'} icon={<Lock size={14}/>} />
                            </>
                          )}
                        </div>
                      </div>

                      {selectedItem.validationNote && (
                        <div style={{ background: "rgba(245, 158, 11, 0.05)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.1)", padding: "1.5rem" }}>
                          <div style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: "700", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.1em" }}>Validierungs-Notiz</div>
                          <div style={{ fontSize: "0.9rem", color: "#f59e0b", lineHeight: "1.5" }}>{selectedItem.validationNote}</div>
                        </div>
                      )}

                      {session.admin.role === 'super_admin' && selectedItem._type === 'submission' && (
                        <button 
                          onClick={() => { if(confirm('Endgültig löschen?')) adminDeleteSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); }) }}
                          style={{ marginTop: "2rem", width: "100%", background: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "0.75rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.85rem" }}
                        >
                          <Trash2 size={16} /> Endgültig löschen
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#333" }}>
                  <div style={{ padding: "2rem", border: "2px dashed #1a1a1a", borderRadius: "30px", textAlign: "center" }}>
                    <Eye size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                    <h3 style={{ margin: 0, color: "#555" }}>Kein Element ausgewählt</h3>
                    <p style={{ fontSize: "0.9rem", maxWidth: "250px", margin: "10px auto" }}>Wähle ein Ticket oder eine Anfrage aus der Liste aus, um Details zu sehen.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
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
        padding: "0.75rem 1rem", 
        borderRadius: "10px", 
        background: active ? "rgba(59, 130, 246, 0.1)" : "transparent", 
        color: active ? "#3b82f6" : "#888", 
        border: "none", 
        cursor: "pointer", 
        width: "100%",
        textAlign: "left",
        transition: "all 0.2s ease",
        marginBottom: "4px"
      }}
      onMouseEnter={e => { if(!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {icon}
        <span style={{ fontWeight: active ? "700" : "500", fontSize: "0.9rem" }}>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span style={{ 
          background: active ? "#3b82f6" : "#222", 
          color: active ? "white" : "#888", 
          padding: "2px 6px", 
          borderRadius: "6px", 
          fontSize: "0.65rem", 
          fontWeight: "800",
          minWidth: "18px",
          textAlign: "center"
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

function ItemCard({ active, onClick, title, subtitle, status, date, lockedBy, icon }: any) {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#3b82f6';
      case 'info_needed': return '#f59e0b';
      case 'processed': return '#10b981';
      default: return '#555';
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: "1.25rem", 
        borderRadius: "16px", 
        background: active ? "#121212" : "#0c0c0c",
        border: `1px solid ${active ? "#222" : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#555" }}>
          {icon}
          <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase" }}>{subtitle}</span>
        </div>
        <div style={{ 
          width: "8px", 
          height: "8px", 
          borderRadius: "50%", 
          background: getStatusColor(status),
          boxShadow: `0 0 10px ${getStatusColor(status)}44`
        }} />
      </div>
      <div style={{ fontWeight: "700", color: active ? "white" : "#d1d5db", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.7rem", color: "#444", display: "flex", alignItems: "center", gap: "4px" }}>
          <Clock size={12} /> {new Date(date).toLocaleDateString('de-DE')}
        </div>
        {lockedBy && (
          <div style={{ fontSize: "0.65rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px", fontWeight: "700" }}>
            <Lock size={10} /> {lockedBy}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, value, icon }: any) {
  return (
    <div>
      <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#bbb" }}>
        {icon} {value}
      </div>
    </div>
  );
}
