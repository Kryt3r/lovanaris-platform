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
  Unlock,
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
  Eye,
  BookOpen,
  X,
  ExternalLink,
  Calendar
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
  const [showReadingModal, setShowReadingModal] = useState(false);
  const router = useRouter();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showReadingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showReadingModal]);

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
    const details = await adminGetSubmissionDetailsAction(s.id);
    if (details.success) setSelectedItem({ ...details.data, _type: 'submission' });
    setUpdating(false);
  };

  const handleClaimTicket = async (id: number) => {
    setUpdating(true);
    const lock = await adminLockSubmissionAction(id);
    if (lock.success) {
      await loadData();
      const details = await adminGetSubmissionDetailsAction(id);
      if (details.success) setSelectedItem({ ...details.data, _type: 'submission' });
    } else {
      alert(lock.error);
    }
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
              fontWeight: "600"
            }}
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
          <div style={{ position: "relative", width: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#444" }} />
            <input 
              type="text" 
              placeholder="Suche nach Code, Kategorie oder Inhalt..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ 
                width: "100%", 
                background: "#111", 
                border: "1px solid #222", 
                padding: "0.6rem 1rem 0.6rem 2.5rem", 
                borderRadius: "10px", 
                color: "white", 
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>
          
          <button 
            onClick={loadData} 
            disabled={updating}
            style={{ 
              background: "#111", 
              border: "1px solid #222", 
              color: "#888", 
              padding: "0.5rem 1rem", 
              borderRadius: "10px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              fontSize: "0.85rem",
              fontWeight: "600"
            }}
          >
            <RefreshCcw size={16} className={updating ? "animate-spin" : ""} /> Aktualisieren
          </button>
        </header>

        {/* View Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* List Section */}
          <div style={{ 
            width: "360px", 
            borderRight: "1px solid #1a1a1a", 
            overflowY: "auto", 
            padding: "1.25rem",
            background: "#090909"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.1em" }}>
              {activeTab === "contacts" ? "Support Anfragen" : "Eingereichte Geschichten"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                    icon={<Inbox size={14} />}
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
                    icon={<MessageSquare size={14} />}
                  />
                ))
              )}
            </div>
          </div>

          {/* Detail Section */}
          <div style={{ flex: 1, background: "#080808", overflowY: "auto", padding: "2.5rem" }}>
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div 
                  key={selectedItem.id + selectedItem._type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ maxWidth: "1000px" }}
                >
                  {/* DETAIL HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                        <span style={{ 
                          padding: "2px 8px", 
                          borderRadius: "4px", 
                          background: selectedItem._type === 'submission' ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.1)", 
                          color: selectedItem._type === 'submission' ? "#3b82f6" : "#8b5cf6", 
                          fontSize: "0.65rem", 
                          fontWeight: "800",
                          textTransform: "uppercase"
                        }}>
                          {selectedItem._type === 'submission' ? 'Submission' : 'Support'}
                        </span>
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#333" }} />
                        <span style={{ color: "#555", fontSize: "0.75rem", fontWeight: "600" }}>#{selectedItem.code || selectedItem.id}</span>
                      </div>
                      <h1 style={{ fontSize: "2.25rem", fontWeight: "800", margin: 0, letterSpacing: "-0.03em" }}>
                        {selectedItem._type === 'submission' ? selectedItem.category : (selectedItem.type === 'deletion' ? 'Löschungsantrag' : 'Allgemeine Anfrage')}
                      </h1>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {selectedItem._type === 'submission' && (
                        <>
                          {selectedItem.lockedBy === session.admin.id ? (
                            <button 
                              onClick={() => adminUnlockSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); })}
                              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "0.6rem 1.25rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}
                            >
                              <Unlock size={16} /> Freigeben
                            </button>
                          ) : (
                            !selectedItem.lockedBy && (
                              <button 
                                onClick={() => handleClaimTicket(selectedItem.id)}
                                style={{ background: "#3b82f6", border: "none", color: "white", padding: "0.6rem 1.25rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}
                              >
                                <Lock size={16} /> Ticket beanspruchen
                              </button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2.5rem", alignItems: "start" }}>
                    {/* Left: Content & Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      
                      {/* PREVIEW BOX */}
                      <div style={{ 
                        background: "#0c0c0c", 
                        border: "1px solid #1a1a1a", 
                        borderRadius: "20px", 
                        padding: "2rem",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.1em" }}>Eingereichter Inhalt</div>
                        <div style={{ 
                          fontSize: "1rem", 
                          lineHeight: "1.6", 
                          color: "#9ca3af",
                          maxHeight: "120px",
                          overflow: "hidden",
                          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
                        }}>
                          {selectedItem._type === 'submission' ? selectedItem.story : selectedItem.message}
                        </div>
                        <button 
                          onClick={() => setShowReadingModal(true)}
                          style={{ 
                            marginTop: "1.5rem", 
                            width: "100%", 
                            background: "#1a1a1a", 
                            border: "1px solid #333", 
                            color: "white", 
                            padding: "1rem", 
                            borderRadius: "12px", 
                            cursor: "pointer", 
                            fontWeight: "700", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "10px",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "#222"}
                          onMouseLeave={e => e.currentTarget.style.background = "#1a1a1a"}
                        >
                          <BookOpen size={20} /> Geschichte lesen
                        </button>
                      </div>

                      {/* ACTION BOX (Only if claimed or contact) */}
                      {(selectedItem.lockedBy === session.admin.id || selectedItem._type === 'contact') && (
                        <div style={{ 
                          background: "#0c0c0c", 
                          border: "1px solid #1a1a1a", 
                          borderRadius: "20px", 
                          padding: "2rem" 
                        }}>
                          <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>
                            {selectedItem._type === 'submission' ? 'Bearbeitung & Status' : 'Aktion'}
                          </div>
                          
                          {selectedItem._type === 'submission' ? (
                            <>
                              <textarea 
                                value={adminMessage}
                                onChange={e => setAdminMessage(e.target.value)}
                                placeholder="Schreibe eine Nachricht an den Nutzer oder eine interne Notiz..."
                                style={{ 
                                  width: "100%", 
                                  background: "#111", 
                                  border: "1px solid #222", 
                                  borderRadius: "12px", 
                                  padding: "1.25rem", 
                                  color: "white", 
                                  fontSize: "0.95rem",
                                  outline: "none",
                                  minHeight: "120px",
                                  marginBottom: "1.5rem"
                                }}
                              />
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'approved')} bg="#10b981" label="Veröffentlichen" icon={<CheckCircle size={16}/>} />
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'info_needed')} bg="#3b82f6" label="Rückfrage" icon={<MessageSquare size={16}/>} />
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')} bg="#ef4444" label="Ablehnen" icon={<XCircle size={16}/>} />
                              </div>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleUpdateContactStatus(selectedItem.id, 'processed')}
                              disabled={selectedItem.status === 'processed'}
                              style={{ 
                                width: "100%", 
                                background: selectedItem.status === 'processed' ? "#222" : "#3b82f6", 
                                color: "white", 
                                border: "none", 
                                padding: "1.25rem", 
                                borderRadius: "12px", 
                                fontWeight: "700", 
                                cursor: selectedItem.status === 'processed' ? "default" : "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: "10px" 
                              }}
                            >
                              <CheckCircle size={20} /> {selectedItem.status === 'processed' ? 'Bereits bearbeitet' : 'Als erledigt markieren'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Meta Info */}
                    <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* STATS CARD */}
                      <div style={{ background: "#0c0c0c", borderRadius: "16px", border: "1px solid #1a1a1a", padding: "1.5rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.1em" }}>Info-Panel</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                          <MetaItem label="Eingang" value={new Date(selectedItem.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} icon={<Calendar size={14}/>} />
                          <MetaItem label="Status" value={selectedItem.status.toUpperCase()} icon={<Clock size={14}/>} color={selectedItem.status === 'pending' ? '#3b82f6' : '#10b981'} />
                          
                          {selectedItem._type === 'submission' ? (
                            <>
                              <MetaItem label="Story Key" value={selectedItem.securityToken || 'N/A'} icon={<ShieldCheck size={14}/>} />
                              {selectedItem.lockedBy && <MetaItem label="In Bearbeitung von" value={selectedItem.lockerName} icon={<User size={14}/>} color="#ef4444" />}
                            </>
                          ) : (
                            <>
                              <MetaItem label="E-Mail" value={selectedItem.email || 'N/A'} icon={<Inbox size={14}/>} />
                              <MetaItem label="Betroffene Story" value={selectedItem.storyCode || 'N/A'} icon={<Filter size={14}/>} />
                            </>
                          )}
                        </div>
                      </div>

                      {selectedItem.validationNote && (
                        <div style={{ background: "rgba(245, 158, 11, 0.05)", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.1)", padding: "1.25rem" }}>
                          <div style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.75rem" }}>Inhalts-Validierung</div>
                          <div style={{ fontSize: "0.85rem", color: "#d97706", lineHeight: "1.5", fontStyle: "italic" }}>"{selectedItem.validationNote}"</div>
                        </div>
                      )}

                      {session.admin.role === 'super_admin' && (
                        <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "12px", background: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                          <button 
                            onClick={() => { if(confirm('Element endgültig löschen? Dies kann nicht rückgängig gemacht werden.')) adminDeleteSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); }) }}
                            style={{ width: "100%", background: "transparent", color: "#ef4444", border: "none", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.8rem", fontWeight: "600" }}
                          >
                            <Trash2 size={14} /> Element löschen
                          </button>
                        </div>
                      )}
                    </aside>
                  </div>
                </motion.div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                  <div style={{ padding: "3rem", border: "2px dashed #1a1a1a", borderRadius: "40px", textAlign: "center" }}>
                    <Inbox size={48} style={{ marginBottom: "1.5rem", color: "#333" }} />
                    <h3 style={{ margin: 0, color: "#555" }}>Bereit für die Bearbeitung</h3>
                    <p style={{ fontSize: "0.9rem", color: "#333", maxWidth: "280px", margin: "10px auto" }}>Wähle links einen Eintrag aus der Liste aus, um Details einzusehen oder Tickets zu beanspruchen.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* READING MODAL OVERLAY */}
      <AnimatePresence>
        {showReadingModal && selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: "fixed", 
              inset: 0, 
              background: "rgba(0,0,0,0.9)", 
              zIndex: 1000, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backdropFilter: "blur(20px)",
              padding: "2rem"
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ 
                width: "100%", 
                maxWidth: "900px", 
                height: "90vh", 
                background: "#0c0c0c", 
                borderRadius: "32px", 
                border: "1px solid #222", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 50px 100px rgba(0,0,0,0.8)"
              }}
            >
              <div style={{ padding: "2rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#555", fontWeight: "700", textTransform: "uppercase", marginBottom: "4px" }}>Lesemodus</div>
                  <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{selectedItem.category || (selectedItem.type === 'deletion' ? 'Löschantrag' : 'Kontaktanfrage')}</h2>
                </div>
                <button 
                  onClick={() => setShowReadingModal(false)}
                  style={{ background: "#222", border: "none", color: "white", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div 
                data-lenis-prevent
                style={{ flex: 1, overflowY: "auto", padding: "4rem", lineHeight: "1.8", fontSize: "1.2rem", color: "#d1d5db", whiteSpace: "pre-wrap" }}
              >
                {selectedItem._type === 'submission' ? selectedItem.story : selectedItem.message}
              </div>

              <div style={{ padding: "1.5rem", borderTop: "1px solid #1a1a1a", textAlign: "center", background: "#0a0a0a" }}>
                <button 
                  onClick={() => setShowReadingModal(false)}
                  style={{ background: "white", color: "black", border: "none", padding: "0.75rem 2rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}
                >
                  Lesen beenden
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          fontWeight: "800"
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
        padding: "1rem", 
        borderRadius: "12px", 
        background: active ? "rgba(255,255,255,0.03)" : "transparent",
        border: `1px solid ${active ? "#222" : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#444" }}>
          {icon}
          <span style={{ fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>{subtitle}</span>
        </div>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getStatusColor(status) }} />
      </div>
      <div style={{ fontWeight: "700", color: active ? "white" : "#888", fontSize: "0.85rem", marginBottom: "0.4rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem" }}>
        <span style={{ color: "#333" }}>{new Date(date).toLocaleDateString('de-DE')}</span>
        {lockedBy && <span style={{ color: "#ef4444", fontWeight: "700" }}>{lockedBy}</span>}
      </div>
    </div>
  );
}

function StatusBtn({ onClick, bg, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        flex: 1, 
        background: bg, 
        color: "white", 
        border: "none", 
        padding: "0.75rem", 
        borderRadius: "10px", 
        fontWeight: "700", 
        cursor: "pointer", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "8px", 
        fontSize: "0.75rem" 
      }}
    >
      {icon} {label}
    </button>
  );
}

function MetaItem({ label, value, icon, color }: any) {
  return (
    <div>
      <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: color || "#bbb", fontWeight: color ? "700" : "500" }}>
        {icon} {value}
      </div>
    </div>
  );
}
