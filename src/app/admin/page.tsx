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
        zIndex: 100,
        height: "100vh"
      }}>
        {/* LOGO SECTION */}
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
            <div style={{ fontWeight: "800", fontSize: "1.1rem", letterSpacing: "-0.02em", color: "white" }}>LOVANARIS</div>
            <div style={{ fontSize: "0.7rem", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Console</div>
          </div>
        </div>

        {/* NAVIGATION SECTION */}
        <div style={{ padding: "0 1.25rem", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Section: Übersicht */}
          <div>
            <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "800", textTransform: "uppercase", padding: "0 0.75rem 0.75rem", letterSpacing: "0.15em" }}>Übersicht</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <NavButton active={activeTab === "tickets"} onClick={() => { setActiveTab("tickets"); setSelectedItem(null); }} icon={<LayoutDashboard size={18}/>} label="Ticket-Pool" />
              <NavButton active={activeTab === "my_tickets"} onClick={() => { setActiveTab("my_tickets"); setSelectedItem(null); }} icon={<Briefcase size={18}/>} label="Meine Tickets" count={myTicketsCount} />
              <NavButton active={activeTab === "contacts"} onClick={() => { setActiveTab("contacts"); setSelectedItem(null); }} icon={<Inbox size={18}/>} label="Kontaktanfragen" count={pendingRequestsCount} />
            </div>
          </div>

          {/* Section: System */}
          <div>
            <div style={{ fontSize: "0.65rem", color: "#444", fontWeight: "800", textTransform: "uppercase", padding: "0 0.75rem 0.75rem", letterSpacing: "0.15em" }}>System</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <NavButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={<History size={18}/>} label="Audit-Logs" />
              <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={18}/>} label="Einstellungen" />
            </div>
          </div>
        </div>

        {/* USER SECTION */}
        <div style={{ padding: "1.5rem", borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <div style={{ width: "40px", height: "40px", background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #222" }}>
              <User size={20} color="#3b82f6" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.admin.name}</div>
              <div style={{ fontSize: "0.75rem", color: "#555", textTransform: "capitalize", fontWeight: "600" }}>{session.admin.role.replace('_', ' ')}</div>
            </div>
          </div>
          <button 
            onClick={() => logoutLovanarisAction().then(() => router.push("/login"))} 
            style={{ 
              width: "100%", 
              background: "rgba(239, 68, 68, 0.08)", 
              border: "1px solid rgba(239, 68, 68, 0.15)", 
              color: "#ef4444", 
              padding: "0.85rem", 
              borderRadius: "12px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              fontSize: "0.9rem",
              fontWeight: "700",
              transition: "all 0.2s ease"
            }}
          >
            <LogOut size={18} /> Abmelden
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
              color: "#aaa", 
              padding: "0.6rem 1.25rem", 
              borderRadius: "10px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              fontSize: "0.85rem",
              fontWeight: "700",
              transition: "all 0.2s ease"
            }}
          >
            <RefreshCcw size={16} className={updating ? "animate-spin" : ""} /> Aktualisieren
          </button>
        </header>

        {/* View Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* List Section */}
          <div 
            data-lenis-prevent
            style={{ 
              width: "360px", 
              borderRight: "1px solid #1a1a1a", 
              overflowY: "auto", 
              padding: "1.5rem",
              background: "#090909"
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "700", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.1em" }}>
              {activeTab === "contacts" ? "Support Anfragen" : "Eingereichte Geschichten"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
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
          <div 
            data-lenis-prevent
            style={{ flex: 1, background: "#080808", overflowY: "auto", padding: "2.5rem" }}
          >
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
                          padding: "3px 10px", 
                          borderRadius: "6px", 
                          background: selectedItem._type === 'submission' ? "rgba(59, 130, 246, 0.15)" : "rgba(139, 92, 246, 0.15)", 
                          color: selectedItem._type === 'submission' ? "#3b82f6" : "#a78bfa", 
                          fontSize: "0.65rem", 
                          fontWeight: "900",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          {selectedItem._type === 'submission' ? 'Submission' : 'Support'}
                        </span>
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#333" }} />
                        <span style={{ color: "#666", fontSize: "0.75rem", fontWeight: "700" }}>#{selectedItem.code || selectedItem.id}</span>
                      </div>
                      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", margin: 0, letterSpacing: "-0.03em", color: "white" }}>
                        {selectedItem._type === 'submission' ? selectedItem.category : (selectedItem.type === 'deletion' ? 'Löschungsantrag' : 'Allgemeine Anfrage')}
                      </h1>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {selectedItem._type === 'submission' && (
                        <>
                          {selectedItem.lockedBy === session.admin.id ? (
                            <button 
                              onClick={() => adminUnlockSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); })}
                              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", padding: "0.7rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}
                            >
                              <Unlock size={18} /> Freigeben
                            </button>
                          ) : (
                            !selectedItem.lockedBy && (
                              <button 
                                onClick={() => handleClaimTicket(selectedItem.id)}
                                style={{ background: "#3b82f6", border: "none", color: "white", padding: "0.7rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                              >
                                <Lock size={18} /> Ticket beanspruchen
                              </button>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }}>
                    {/* Left: Content & Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                      
                      {/* PREVIEW BOX */}
                      <div style={{ 
                        background: "#0c0c0c", 
                        border: "1px solid #1a1a1a", 
                        borderRadius: "24px", 
                        padding: "2.5rem",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "800", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.15em" }}>Inhalt</div>
                        <div style={{ 
                          fontSize: "1.1rem", 
                          lineHeight: "1.7", 
                          color: "#9ca3af",
                          maxHeight: "150px",
                          overflow: "hidden",
                          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
                        }}>
                          {selectedItem._type === 'submission' ? selectedItem.story : selectedItem.message}
                        </div>
                        <button 
                          onClick={() => setShowReadingModal(true)}
                          style={{ 
                            marginTop: "2rem", 
                            width: "100%", 
                            background: "#1a1a1a", 
                            border: "1px solid #222", 
                            color: "white", 
                            padding: "1.25rem", 
                            borderRadius: "16px", 
                            cursor: "pointer", 
                            fontWeight: "800", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: "12px",
                            fontSize: "1.05rem",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <BookOpen size={22} /> Geschichte lesen
                        </button>
                      </div>

                      {/* ACTION BOX (Only if claimed or contact) */}
                      {(selectedItem.lockedBy === session.admin.id || selectedItem._type === 'contact') && (
                        <div style={{ 
                          background: "#0c0c0c", 
                          border: "1px solid #1a1a1a", 
                          borderRadius: "24px", 
                          padding: "2.5rem" 
                        }}>
                          <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "800", textTransform: "uppercase", marginBottom: "1.5rem", letterSpacing: "0.15em" }}>
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
                                  borderRadius: "16px", 
                                  padding: "1.5rem", 
                                  color: "white", 
                                  fontSize: "1rem",
                                  outline: "none",
                                  minHeight: "140px",
                                  marginBottom: "2rem"
                                }}
                              />
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'approved')} bg="#10b981" label="Veröffentlichen" icon={<CheckCircle size={18}/>} />
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'info_needed')} bg="#3b82f6" label="Rückfrage" icon={<MessageSquare size={18}/>} />
                                <StatusBtn onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')} bg="#ef4444" label="Ablehnen" icon={<XCircle size={18}/>} />
                              </div>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleUpdateContactStatus(selectedItem.id, 'processed')}
                              disabled={selectedItem.status === 'processed'}
                              style={{ 
                                width: "100%", 
                                background: selectedItem.status === 'processed' ? "#1a1a1a" : "#3b82f6", 
                                color: "white", 
                                border: "none", 
                                padding: "1.25rem", 
                                borderRadius: "16px", 
                                fontWeight: "800", 
                                cursor: selectedItem.status === 'processed' ? "default" : "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: "12px",
                                fontSize: "1.1rem"
                              }}
                            >
                              <CheckCircle size={22} /> {selectedItem.status === 'processed' ? 'Bereits bearbeitet' : 'Als erledigt markieren'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Meta Info */}
                    <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* STATS CARD */}
                      <div style={{ background: "#0c0c0c", borderRadius: "20px", border: "1px solid #1a1a1a", padding: "1.75rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "#444", fontWeight: "800", textTransform: "uppercase", marginBottom: "1.5rem", letterSpacing: "0.15em" }}>Details</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                        <div style={{ background: "rgba(245, 158, 11, 0.08)", borderRadius: "20px", border: "1px solid rgba(245, 158, 11, 0.2)", padding: "1.5rem" }}>
                          <div style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "900", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Validierungs-Notiz</div>
                          <div style={{ fontSize: "0.95rem", color: "#f59e0b", lineHeight: "1.6", fontStyle: "italic", fontWeight: "500" }}>"{selectedItem.validationNote}"</div>
                        </div>
                      )}

                      {session.admin.role === 'super_admin' && (
                        <div style={{ marginTop: "1rem", padding: "1.25rem", borderRadius: "16px", background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                          <button 
                            onClick={() => { if(confirm('Element endgültig löschen? Dies kann nicht rückgängig gemacht werden.')) adminDeleteSubmissionAction(selectedItem.id).then(() => { loadData(); setSelectedItem(null); }) }}
                            style={{ width: "100%", background: "transparent", color: "#ef4444", border: "none", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "0.9rem", fontWeight: "700" }}
                          >
                            <Trash2 size={16} /> Element löschen
                          </button>
                        </div>
                      )}
                    </aside>
                  </div>
                </motion.div>
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                  <div style={{ padding: "4rem", border: "2px dashed #1a1a1a", borderRadius: "48px", textAlign: "center" }}>
                    <div style={{ width: "80px", height: "80px", background: "#0c0c0c", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "1px solid #1a1a1a" }}>
                      <Inbox size={40} style={{ color: "#333" }} />
                    </div>
                    <h3 style={{ margin: 0, color: "#aaa", fontSize: "1.5rem", fontWeight: "800" }}>Bereit zur Bearbeitung</h3>
                    <p style={{ fontSize: "1rem", color: "#444", maxWidth: "320px", margin: "1rem auto 0", lineHeight: "1.5" }}>Wähle links einen Eintrag aus, um Details einzusehen oder Tickets zu beanspruchen.</p>
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
              background: "rgba(0,0,0,0.95)", 
              zIndex: 2000, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backdropFilter: "blur(20px)",
              padding: "2rem"
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              style={{ 
                width: "100%", 
                maxWidth: "1000px", 
                height: "85vh", 
                background: "#0c0c0c", 
                borderRadius: "40px", 
                border: "1px solid #222", 
                display: "flex", 
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 50px 100px rgba(0,0,0,0.9)"
              }}
            >
              <div style={{ padding: "2.5rem 3rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.15em" }}>Lesemodus</div>
                  <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "800", color: "white" }}>{selectedItem.category || (selectedItem.type === 'deletion' ? 'Löschantrag' : 'Kontaktanfrage')}</h2>
                </div>
                <button 
                  onClick={() => setShowReadingModal(false)}
                  style={{ background: "#1a1a1a", border: "1px solid #333", color: "white", width: "48px", height: "48px", borderRadius: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={24} />
                </button>
              </div>

              <div 
                data-lenis-prevent
                style={{ flex: 1, overflowY: "auto", padding: "4rem 5rem", lineHeight: "1.9", fontSize: "1.3rem", color: "#d1d5db", whiteSpace: "pre-wrap", fontFamily: "serif" }}
              >
                {selectedItem._type === 'submission' ? selectedItem.story : selectedItem.message}
              </div>

              <div style={{ padding: "2rem", borderTop: "1px solid #1a1a1a", textAlign: "center", background: "#0a0a0a" }}>
                <button 
                  onClick={() => setShowReadingModal(false)}
                  style={{ background: "white", color: "black", border: "none", padding: "1rem 3rem", borderRadius: "16px", fontWeight: "800", cursor: "pointer", fontSize: "1.1rem", boxShadow: "0 10px 30px rgba(255,255,255,0.2)" }}
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
        padding: "0.9rem 1.25rem", 
        borderRadius: "14px", 
        background: active ? "rgba(59, 130, 246, 0.12)" : "transparent", 
        color: active ? "#3b82f6" : "#666", 
        border: "none", 
        cursor: "pointer", 
        width: "100%",
        textAlign: "left",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        marginBottom: "6px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ color: active ? "#3b82f6" : "#444" }}>{icon}</div>
        <span style={{ fontWeight: active ? "800" : "600", fontSize: "0.95rem" }}>{label}</span>
      </div>
      {count !== undefined && count > 0 && (
        <span style={{ 
          background: active ? "#3b82f6" : "#1a1a1a", 
          color: active ? "white" : "#444", 
          padding: "3px 8px", 
          borderRadius: "8px", 
          fontSize: "0.75rem", 
          fontWeight: "900",
          minWidth: "22px",
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
        background: active ? "#121212" : "transparent",
        border: `1px solid ${active ? "#222" : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444" }}>
          {icon}
          <span style={{ fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>{subtitle}</span>
        </div>
        <div style={{ 
          width: "8px", 
          height: "8px", 
          borderRadius: "50%", 
          background: getStatusColor(status),
          boxShadow: `0 0 10px ${getStatusColor(status)}33`
        }} />
      </div>
      <div style={{ fontWeight: "800", color: active ? "white" : "#888", fontSize: "0.95rem", marginBottom: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "600" }}>
        <span style={{ color: "#333" }}>{new Date(date).toLocaleDateString('de-DE')}</span>
        {lockedBy && <span style={{ color: "#ef4444" }}>{lockedBy}</span>}
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
        padding: "0.9rem", 
        borderRadius: "12px", 
        fontWeight: "800", 
        cursor: "pointer", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "10px", 
        fontSize: "0.85rem",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
      }}
    >
      {icon} {label}
    </button>
  );
}

function MetaItem({ label, value, icon, color }: any) {
  return (
    <div>
      <div style={{ fontSize: "0.7rem", color: "#444", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: color || "#bbb", fontWeight: color ? "800" : "600" }}>
        <div style={{ color: color || "#444" }}>{icon}</div> {value}
      </div>
    </div>
  );
}
