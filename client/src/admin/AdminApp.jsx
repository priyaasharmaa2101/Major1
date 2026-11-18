import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Users, Building2, Ticket, AlertCircle, Award, Bot,
  Sun, Moon, Bell, LogOut, Sparkles, Menu, X, ArrowRight, CheckCheck,
  ShieldCheck, Check, Pencil, ArrowLeft, UserPlus, Calendar, GraduationCap
} from 'lucide-react';
import { loadCommittees } from '../shared/committeeService';
// inside the component:
import AdminLogin, { ADMIN_EMAIL } from './AdminLogin';
import { ThemeCtx, Modal, Field, Input, Select, Textarea, Btn, Badge } from './ui';
import DashboardTab from './components/DashboardTab';
import RecruitmentTab from './components/RecruitmentTab';
import CommitteesAdminTab from './components/CommitteesAdminTab';
import EventsAdminTab from './components/EventsAdminTab';
import GrievancesAdminTab from './components/GrievancesAdminTab';
import Super50AdminTab from './components/Super50AdminTab';
import AutomationTab from './components/AutomationTab';
import AIAssistantTab from './components/AIAssistantTab';
import { loadApplications } from '../shared/applicationService';
import { useDB, actions, getDB, fmtDate, fmtDateTime } from '../shared/store';
import { useAutomationLoop } from '../shared/hooks';
import { loadSlots } from '../shared/slotService';
import { loadEventData, loadSettings } from '../shared/eventService';
import { loadGrievances } from '../shared/grievanceService';
import { loadCandidates } from '../shared/candidateService';
import { loadNotifications } from '../shared/notificationService';

const SESSION_KEY = 'campussync:admin-session';
const BRANCH_OPTIONS = ['All Branches', 'Hostel Residents Only', 'Computer Science', 'Electronics', 'Information Technology', 'Mechanical'];

export default function AdminApp({ externalAuthUser, onExternalLogout }) {
  const [authed, setAuthed] = useState(() => Boolean(externalAuthUser) || sessionStorage.getItem(SESSION_KEY) === '1');

  if (!authed) {
    return (
      <AdminLogin
        onLogin={() => {
          sessionStorage.setItem(SESSION_KEY, '1');
          setAuthed(true);
        }}
      />
    );
  }
  return (
    <AdminShell
      externalAuthUser={externalAuthUser}
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY);
        if (onExternalLogout) onExternalLogout();
        else setAuthed(false);
      }}
    />
  );
}



function AdminShell({ externalAuthUser, onLogout }) {
   useEffect(() => {
    const load = () => {
      loadCommittees().catch(console.error);
      loadApplications().catch(console.error);
      loadSlots().catch(console.error);
            loadEventData().catch(console.error);
      loadSettings().catch(console.error);
            loadEventData().catch(console.error);
                  loadGrievances().catch(console.error);
            loadCandidates().catch(console.error);
            loadNotifications().catch(console.error);
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);
  const db = useDB();
  const now = useAutomationLoop();
  const [tab, setTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [fullNotifOpen, setFullNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Profile Committee Detail & Direct Edit States
  const [selectedProfileCommitteeId, setSelectedProfileCommitteeId] = useState(null);
  const [editingCommitteeForm, setEditingCommitteeForm] = useState(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const notifRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !isDark);
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (editingCommitteeForm) {
          setEditingCommitteeForm(null);
          return;
        }
        setNotifOpen(false);
        setFullNotifOpen(false);
        setIsProfileModalOpen(false);
        setSelectedProfileCommitteeId(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingCommitteeForm]);

  const toast = (m) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Resolve Admin Identity
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('campusUser'));
    } catch {
      return null;
    }
  })();

  const activeAdmin = externalAuthUser || storedUser || {};
  const adminProfile = {
    name: activeAdmin.name || 'System Administrator',
    staffId: activeAdmin.rollNo || 'ADM-2026',
    email: activeAdmin.email || ADMIN_EMAIL,
    department: 'Committee Governance & Operations',
  };

  const initials = adminProfile.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const myEmail = adminProfile.email.trim().toLowerCase();
  const myName = adminProfile.name.trim().toLowerCase();

  const isPrimaryOwner = (c) => {
    if (!c) return false;
    if (c.createdBy && myEmail) {
      return c.createdBy.toLowerCase() === myEmail;
    }
    const leadName = (c.lead || '').toLowerCase();
    return Boolean(myName && leadName.includes(myName));
  };

  const isAcceptedContributor = (c) => {
    const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
    return list.some(
      (col) =>
        col.status === 'Accepted' &&
        ((myEmail && col.email?.toLowerCase() === myEmail) ||
          (myName && col.name?.toLowerCase() === myName))
    );
  };

  const hasPendingInvite = (c) => {
    const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
    return list.some(
      (col) =>
        col.status === 'Pending' &&
        ((myEmail && col.email?.toLowerCase() === myEmail) ||
          (myName && col.name?.toLowerCase() === myName))
    );
  };

  const myCommittees = db.committees.filter((c) => isPrimaryOwner(c) || isAcceptedContributor(c));
  const pendingInviteCommittees = db.committees.filter(hasPendingInvite);
  const selectedProfileCommittee = db.committees.find((c) => c.id === selectedProfileCommitteeId) || null;

  const myCommitteeNames = new Set(myCommittees.map((c) => c.name.trim().toLowerCase()));
  const myOpenGrievancesCount = db.grievances.filter(
    (g) => g.status !== 'Resolved' && myCommitteeNames.has((g.committee || '').trim().toLowerCase())
  ).length;

  const respondToInvite = (c, accept) => {
    const updated = (c.collaborators || [])
      .map((col) => {
        const isMe =
          (myEmail && col.email?.toLowerCase() === myEmail) ||
          (myName && col.name?.toLowerCase() === myName);
        if (!isMe) return col;
        return accept ? { ...col, status: 'Accepted', name: adminProfile.name } : null;
      })
      .filter(Boolean);

    actions.saveCommittee({ ...c, collaborators: updated });
    toast(accept ? `Joined ${c.name} as Co-Admin!` : `Rejected invite for ${c.name}.`);
  };

  // Direct Edit Handlers from Profile Modal
  const openDirectEdit = (c, e) => {
    if (e) e.stopPropagation();
    setInviteName('');
    setInviteEmail('');
    setEditingCommitteeForm({ ...c, collaborators: c.collaborators || [] });
  };

  const setEditField = (k) => (e) => setEditingCommitteeForm((f) => ({ ...f, [k]: e.target.value }));

  const addCollaboratorToEdit = () => {
    const email = inviteEmail.trim().toLowerCase();
    const name = inviteName.trim() || email.split('@')[0];
    if (!email) return;
    if (email === myEmail) {
      toast('You are already the committee lead.');
      return;
    }
    const existing = Array.isArray(editingCommitteeForm.collaborators) ? editingCommitteeForm.collaborators : [];
    if (existing.some((x) => x.email.toLowerCase() === email)) {
      toast('An invitation has already been sent to this admin.');
      return;
    }
    setEditingCommitteeForm((prev) => ({
      ...prev,
      collaborators: [...existing, { email, name, status: 'Pending', invitedBy: adminProfile.name }],
    }));
    setInviteName('');
    setInviteEmail('');
    toast(`Request added for ${name}`);
  };

  const removeCollaboratorFromEdit = (email) => {
    setEditingCommitteeForm((prev) => ({
      ...prev,
      collaborators: (prev.collaborators || []).filter((x) => x.email.toLowerCase() !== email.toLowerCase()),
    }));
  };

  const saveDirectEdit = (e) => {
    e.preventDefault();
    const prevCommittee = db.committees.find((x) => x.id === editingCommitteeForm.id);
    const prevEmails = new Set((prevCommittee?.collaborators || []).map((x) => x.email.toLowerCase()));
    const newlyInvited = (editingCommitteeForm.collaborators || []).filter(
      (col) => col.status === 'Pending' && !prevEmails.has(col.email.toLowerCase())
    );

    actions.saveCommittee({
      ...editingCommitteeForm,
      createdBy: editingCommitteeForm.createdBy || adminProfile.email,
      collaborators: editingCommitteeForm.collaborators || [],
    });

    if (newlyInvited.length > 0) {
      const store = getDB();
      newlyInvited.forEach((col) => {
        store.notifications.unshift({
          id: `notif-inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          to: 'ADMIN',
          targetEmail: col.email.toLowerCase(),
          targetName: col.name.toLowerCase(),
          committeeId: editingCommitteeForm.id,
          type: 'COMMITTEE_INVITE',
          text: `${adminProfile.name} invited ${col.name} (${col.email}) to join ${editingCommitteeForm.name}.`,
          tone: 'info',
          read: false,
          ts: Date.now(),
        });
      });
    }

    toast('Committee updated');
    setEditingCommitteeForm(null);
  };

  // Filter notifications
  const adminNotifs = db.notifications.filter((n) => {
    if (n.to !== 'ADMIN') return false;
    if (n.type === 'COMMITTEE_INVITE') {
      return (myEmail && n.targetEmail === myEmail) || (myName && n.targetName === myName);
    }
    return true;
  });

  const unread = adminNotifs.filter((n) => !n.read && n.type !== 'COMMITTEE_INVITE').length + pendingInviteCommittees.length;

  const totalDecisionsCount = db.activity.filter((a) => a.by === 'ADMIN').length;
  const autoRulesActiveCount = Object.entries(db.settings).filter(
    ([k, v]) => k.startsWith('auto') && v === true
  ).length;
  const resolvedGrievancesCount = db.grievances.filter((g) => g.status === 'Resolved').length;

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recruitment', label: 'Recruitment', icon: Users, badge: db.applications.filter((a) => a.status === 'Applied').length },
    { id: 'committees', label: 'Committees', icon: Building2, badge: pendingInviteCommittees.length },
    { id: 'events', label: 'Events & Payments', icon: Ticket, badge: db.payments.filter((p) => p.status === 'Pending').length },
    { id: 'grievances', label: 'Grievances', icon: AlertCircle, badge: myOpenGrievancesCount },
    { id: 'super50', label: 'Super 50', icon: Award },
    { id: 'automation', label: 'Automation', icon: Bot },
    
{ id: 'ai', label: 'AI Assistant', icon: Sparkles },
  ];

  const page = {
    dashboard: <DashboardTab now={now} />,
    recruitment: <RecruitmentTab toast={toast} adminProfile={adminProfile} />,
    committees: <CommitteesAdminTab toast={toast} adminProfile={adminProfile} />,
    events: <EventsAdminTab toast={toast} />,
    grievances: <GrievancesAdminTab now={now} toast={toast} adminProfile={adminProfile} />,
    super50: <Super50AdminTab toast={toast} />,
    automation: <AutomationTab toast={toast} />,
    ai: <AIAssistantTab toast={toast} />,
  }[tab];

  const d = isDark;

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProfileCommitteeId(null);
  };

  return (
    <ThemeCtx.Provider value={isDark}>
      <div className={`flex min-h-screen font-sans transition-colors duration-200 ${
        d
          ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-400 selection:text-zinc-950'
          : 'bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white'
      }`}>
        {toastMsg && (
          <div className={`fixed bottom-5 right-5 z-[60] px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border animate-bounce ${
            d ? 'bg-zinc-900 text-zinc-100 border-zinc-700' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500" /> {toastMsg}
          </div>
        )}

        {/* Collapsible Sidebar */}
        <aside className={`border-r transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen hidden md:flex flex-col justify-between ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${
          d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className={`h-16 px-4 border-b flex items-center gap-3 overflow-hidden ${
              d ? 'border-zinc-800' : 'border-slate-100'
            }`}>
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                aria-label="Toggle Sidebar"
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  d
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`p-2 rounded-xl font-black text-xs shrink-0 flex items-center justify-center ${
                  d ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20' : 'bg-emerald-600 text-white'
                }`}>
                  ⚡
                </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden">
                    <span className={`font-extrabold text-base tracking-tight truncate block ${
                      d ? 'text-white' : 'text-slate-900'
                    }`}>
                      CampusNexus
                    </span>
                    <div className={`text-[10px] tracking-tight truncate ${d ? 'text-zinc-400' : 'text-slate-400'}`}>
                      Admin Console
                    </div>
                  </div>
                )}
              </div>
            </div>

            <nav className="p-3 space-y-1.5">
              {nav.map((n) => {
                const Icon = n.icon;
                const active = tab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setTab(n.id)}
                    title={!isSidebarOpen ? n.label : ''}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? d
                          ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30 shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
                        : d
                          ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-transparent'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3 overflow-hidden">
                      <Icon className="w-4 h-4 shrink-0" />
                      {isSidebarOpen && <span className="truncate">{n.label}</span>}
                    </span>
                    {isSidebarOpen && n.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border shrink-0 ${
                        d ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {n.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={`p-3 border-t ${d ? 'border-zinc-800' : 'border-slate-100'}`}>
            <button
              onClick={() => {
                setSelectedProfileCommitteeId(null);
                setIsProfileModalOpen(true);
              }}
              title="View admin profile & committees"
              className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                d
                  ? 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-800 hover:border-emerald-500/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                d ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'
              }`}>
                {initials}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden flex-1">
                  <div className={`font-bold text-xs truncate ${d ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {adminProfile.name}
                  </div>
                  <div className={`text-[10px] font-mono truncate ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {adminProfile.staffId}
                  </div>
                </div>
              )}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className={`border-b sticky top-0 z-30 h-16 px-6 flex items-center justify-between backdrop-blur-md transition-colors ${
            d ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'
          }`}>
            <div className={`text-xs font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
              CampusNexus Admin / <span className={`font-bold capitalize ${d ? 'text-white' : 'text-slate-900'}`}>{tab}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark((v) => !v)}
                aria-label="Toggle theme"
                className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-semibold ${
                  d
                    ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                {d ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    const o = !notifOpen;
                    setNotifOpen(o);
                    if (o) actions.markRead('ADMIN');
                  }}
                  aria-label="Admin alerts"
                  className={`p-2 rounded-xl border relative transition-all ${
                    d
                      ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border shadow-2xl z-40 overflow-hidden ${
                    d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`px-4 py-3 text-xs font-bold border-b flex items-center justify-between ${
                      d ? 'border-zinc-800 text-white' : 'border-slate-100 text-slate-900'
                    }`}>
                      <span>Notifications & Invites</span>
                      <button
                        onClick={() => actions.markRead('ADMIN')}
                        className="text-[11px] text-emerald-500 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {pendingInviteCommittees.map((c) => (
                        <div
                          key={`inv-${c.id}`}
                          className={`px-4 py-3 text-xs border-b space-y-2 ${
                            d
                              ? 'bg-emerald-950/25 border-zinc-800 text-zinc-200'
                              : 'bg-emerald-50/70 border-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="inline-block w-2 h-2 rounded-full mt-1 bg-amber-400 shrink-0 animate-pulse" />
                            <div>
                              You are invited to join <b>{c.name}</b> by <b>{c.lead}</b>. Accept or reject?
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pl-4">
                            <button
                              onClick={() => respondToInvite(c, true)}
                              className="px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-[11px] font-bold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                            <button
                              onClick={() => respondToInvite(c, false)}
                              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border ${
                                d
                                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}

                      {adminNotifs.filter((n) => n.type !== 'COMMITTEE_INVITE').length === 0 && pendingInviteCommittees.length === 0 && (
                        <div className={`p-4 text-xs ${d ? 'text-zinc-500' : 'text-slate-400'}`}>No notifications yet.</div>
                      )}

                      {adminNotifs
                        .filter((n) => n.type !== 'COMMITTEE_INVITE')
                        .slice(0, 5)
                        .map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-2.5 text-xs border-b last:border-0 ${
                              d ? 'border-zinc-800 text-zinc-300' : 'border-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 bg-emerald-500" />
                            {n.text}
                            <div className={`text-[10px] mt-0.5 ${d ? 'text-zinc-500' : 'text-slate-400'}`}>
                              {fmtDateTime(n.ts)}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className={`p-2.5 border-t ${d ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'}`}>
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          setFullNotifOpen(true);
                        }}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        Show all ({adminNotifs.filter((n) => n.type !== 'COMMITTEE_INVITE').length + pendingInviteCommittees.length}) <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Mobile nav */}
          <div className={`md:hidden flex overflow-x-auto border-b p-2 gap-2 ${
            d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
          }`}>
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                  tab === n.id
                    ? d
                      ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : d
                      ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          <main className="p-6 max-w-7xl w-full mx-auto">{page}</main>
        </div>

        {/* --- CLEAN EXECUTIVE ADMIN PROFILE MODAL --- */}
        {isProfileModalOpen && (
          <div
            onClick={closeProfileModal}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`max-w-3xl w-full rounded-3xl border shadow-2xl overflow-hidden transition-all ${
                d ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Top Banner Header */}
              <div className={`px-6 py-6 md:px-8 md:py-7 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                d
                  ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800'
                  : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{adminProfile.name}</h2>
                      {myCommittees.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> Committee Lead
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          d ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-mono mt-1 flex flex-wrap items-center gap-2 ${
                      d ? 'text-zinc-400' : 'text-slate-500'
                    }`}>
                      <span className="font-semibold text-emerald-500">{adminProfile.staffId}</span>
                      <span>•</span>
                      <span>{adminProfile.email}</span>
                      <span>•</span>
                      <span>{adminProfile.department}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeProfileModal}
                  aria-label="Close profile"
                  className={`self-end sm:self-center p-2 rounded-xl border transition-colors ${
                    d
                      ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Key Metrics Strip */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b ${
                d ? 'divide-zinc-800 border-zinc-800 bg-zinc-950/40' : 'divide-slate-200 border-slate-200 bg-slate-50/60'
              }`}>
                <div className="p-4 text-center">
                  <div className={`text-[11px] font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>Your Committees</div>
                  <div className="text-lg font-black text-emerald-500 mt-0.5">{myCommittees.length}</div>
                </div>
                <div className="p-4 text-center">
                  <div className={`text-[11px] font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>Automation Rules</div>
                  <div className="text-lg font-black text-amber-500 mt-0.5">{autoRulesActiveCount} / 6 ON</div>
                </div>
                <div className="p-4 text-center">
                  <div className={`text-[11px] font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>Tickets Resolved</div>
                  <div className="text-lg font-black mt-0.5">{resolvedGrievancesCount} Closed</div>
                </div>
                <div className="p-4 text-center">
                  <div className={`text-[11px] font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>Admin Actions</div>
                  <div className="text-lg font-black text-emerald-500 mt-0.5">{totalDecisionsCount} Logged</div>
                </div>
              </div>

              {/* Body: Either Detailed View of Selected Committee OR List of Managed Committees */}
              <div className="p-6 md:p-8 space-y-5">
                {selectedProfileCommittee ? (
                  (() => {
                    const c = selectedProfileCommittee;
                    const owner = isPrimaryOwner(c);
                    const apps = db.applications.filter((a) => a.committeeId === c.id);
                    const shortlistedCount = apps.filter((a) => ['Shortlisted', 'Slot Booked'].includes(a.status)).length;
                    const selectedCount = apps.filter((a) => a.status === 'Selected').length;
                    const acceptedCollabs = (c.collaborators || []).filter((x) => x.status === 'Accepted');
                    const pendingCollabs = (c.collaborators || []).filter((x) => x.status === 'Pending');

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedProfileCommitteeId(null)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                              d ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
                          </button>

                          <button
                            onClick={(e) => openDirectEdit(c, e)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit Committee
                          </button>
                        </div>

                        <div className={`p-5 rounded-2xl border space-y-4 ${
                          d ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400">
                                  {c.tag}
                                </span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  owner ? 'bg-emerald-500/15 text-emerald-500' : 'bg-indigo-500/15 text-indigo-400'
                                }`}>
                                  {owner ? 'Lead' : 'Co-Admin'}
                                </span>
                              </div>
                              <h3 className="text-lg font-extrabold mt-1.5">{c.name}</h3>
                              <p className={`text-xs mt-1 leading-relaxed ${d ? 'text-zinc-400' : 'text-slate-600'}`}>
                                {c.description}
                              </p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                              c.hiringOpen
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                            }`}>
                              {c.hiringOpen ? 'Hiring Open' : 'Hiring Closed'}
                            </span>
                          </div>

                          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs ${
                            d ? 'border-zinc-800' : 'border-slate-200'
                          }`}>
                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Open Role</div>
                              <div className="font-bold mt-0.5">{c.role}</div>
                            </div>
                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Min CGPA Cutoff</div>
                              <div className="font-bold text-emerald-500 mt-0.5">{c.minCgpa} CGPA</div>
                            </div>
                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Vacancies</div>
                              <div className="font-bold mt-0.5">{c.vacancies} Seats</div>
                            </div>
                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Deadline</div>
                              <div className="font-bold mt-0.5">{fmtDate(Date.parse(`${c.deadline}T00:00:00`))}</div>
                            </div>
                          </div>

                          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t text-xs ${
                            d ? 'border-zinc-800' : 'border-slate-200'
                          }`}>
                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Eligibility & Lead</div>
                              <div className="mt-1 space-y-1">
                                <div>Eligibility: <b>{c.requiredBranch}</b></div>
                                <div>Committee Lead: <b>{c.lead}</b></div>
                                {acceptedCollabs.length > 0 && (
                                  <div>Co-Admins: <b>{acceptedCollabs.map((x) => x.name).join(', ')}</b></div>
                                )}
                                {pendingCollabs.length > 0 && (
                                  <div className="text-amber-500">Pending Invites: {pendingCollabs.map((x) => x.email).join(', ')}</div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className={`text-[10px] ${d ? 'text-zinc-500' : 'text-slate-400'}`}>Hiring Pipeline</div>
                              <div className="mt-1 space-y-1">
                                <div>Total Applicants: <b>{apps.length}</b></div>
                                <div>Shortlisted / Slotted: <b>{shortlistedCount}</b></div>
                                <div>Selected Members: <b className="text-emerald-500">{selectedCount}</b></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    {pendingInviteCommittees.length > 0 && (
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                          Pending Committee Invitations ({pendingInviteCommittees.length})
                        </h3>
                        <div className="space-y-2">
                          {pendingInviteCommittees.map((c) => (
                            <div
                              key={c.id}
                              className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                d ? 'bg-amber-950/25 border-amber-800/50' : 'bg-amber-50 border-amber-200'
                              }`}
                            >
                              <div>
                                <div className="font-bold text-sm">{c.name}</div>
                                <div className={d ? 'text-zinc-400' : 'text-slate-600'}>
                                  You are invited to join this committee by <b>{c.lead}</b> • Role: {c.role}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => respondToInvite(c, true)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button
                                  onClick={() => respondToInvite(c, false)}
                                  className={`px-3 py-1.5 rounded-xl font-semibold border ${
                                    d ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                          d ? 'text-zinc-400' : 'text-slate-500'
                        }`}>
                          <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Committees You Manage
                        </h3>

                        <button
                          onClick={() => {
                            closeProfileModal();
                            setTab('committees');
                          }}
                          className="text-xs font-bold text-emerald-500 hover:underline"
                        >
                          + Create / Manage Committees →
                        </button>
                      </div>

                      {myCommittees.length === 0 ? (
                        <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                          d ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <div className="text-xs">
                            You are not currently leading or co-managing any committee.
                          </div>
                          <button
                            onClick={() => {
                              closeProfileModal();
                              setTab('committees');
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors"
                          >
                            Create a Committee
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {myCommittees.map((c) => {
                            const owner = isPrimaryOwner(c);
                            return (
                              <div
                                key={c.id}
                                onClick={() => setSelectedProfileCommitteeId(c.id)}
                                title="Click to view full committee information"
                                className={`p-4 rounded-2xl border cursor-pointer transition-all group ${
                                  d
                                    ? 'bg-zinc-950/60 border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-950'
                                    : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="font-bold text-sm flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                                      {c.name}
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        owner
                                          ? 'bg-emerald-500/15 text-emerald-500'
                                          : 'bg-sky-500/15 text-sky-400'
                                      }`}>
                                        {owner ? 'Lead' : 'Co-Admin'}
                                      </span>
                                    </div>
                                    <div className={`text-xs mt-0.5 ${d ? 'text-zinc-400' : 'text-slate-600'}`}>
                                      Open Role: <span className="font-medium">{c.role}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => openDirectEdit(c, e)}
                                      title="Edit committee directly"
                                      className={`p-1.5 rounded-lg border transition-colors ${
                                        d
                                          ? 'border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 bg-zinc-900'
                                          : 'border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 bg-white'
                                      }`}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                      c.hiringOpen
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                                    }`}>
                                      {c.hiringOpen ? 'Hiring Open' : 'Closed'}
                                    </span>
                                  </div>
                                </div>
                                <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${
                                  d ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
                                }`}>
                                  <span>Min CGPA: <b>{c.minCgpa}</b></span>
                                  <span>{c.vacancies} Vacancies</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className={`px-6 py-4 md:px-8 border-t flex items-center justify-between gap-4 ${
                d ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-200 bg-slate-50'
              }`}>
                <button
                  onClick={() => {
                    closeProfileModal();
                    onLogout();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    d
                      ? 'bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border-rose-800/50'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>

                <button
                  onClick={closeProfileModal}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    d
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- DIRECT EDIT COMMITTEE MODAL FROM PROFILE --- */}
        {editingCommitteeForm && (
          <Modal title={`Edit ${editingCommitteeForm.name}`} onClose={() => setEditingCommitteeForm(null)} wide>
            <form onSubmit={saveDirectEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Committee name"><Input required value={editingCommitteeForm.name} onChange={setEditField('name')} /></Field>
              <Field label="Tag"><Input required value={editingCommitteeForm.tag} onChange={setEditField('tag')} /></Field>
              <Field label="Committee lead"><Input required value={editingCommitteeForm.lead} onChange={setEditField('lead')} /></Field>
              <Field label="Open role"><Input required value={editingCommitteeForm.role} onChange={setEditField('role')} /></Field>
              <Field label="Min CGPA"><Input type="number" step="0.1" min="0" max="10" required value={editingCommitteeForm.minCgpa} onChange={setEditField('minCgpa')} /></Field>
              <Field label="Vacancies"><Input type="number" min="0" required value={editingCommitteeForm.vacancies} onChange={setEditField('vacancies')} /></Field>
              <Field label="Eligibility">
                <Select value={editingCommitteeForm.requiredBranch} onChange={setEditField('requiredBranch')}>
                  {BRANCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </Select>
              </Field>
              <Field label="Application deadline"><Input type="date" required value={editingCommitteeForm.deadline} onChange={setEditField('deadline')} /></Field>

              <div className="sm:col-span-2">
                <Field label="Description"><Textarea rows={2} required value={editingCommitteeForm.description} onChange={setEditField('description')} /></Field>
              </div>

              <div className={`sm:col-span-2 p-3.5 rounded-xl border space-y-3 ${
                d ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" /> Invite Faculty / Admin to Contribute
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Faculty / Admin Name"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      type="email"
                      placeholder="faculty@college.edu"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <Btn type="button" onClick={addCollaboratorToEdit} className="w-full">
                    <UserPlus className="w-3.5 h-3.5" /> Request
                  </Btn>
                </div>

                {(editingCommitteeForm.collaborators || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {editingCommitteeForm.collaborators.map((col) => (
                      <span
                        key={col.email}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border ${
                          d ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <b>{col.name}</b>
                        <span className={d ? 'text-zinc-500' : 'text-slate-400'}>({col.email})</span>
                        <Badge tone={col.status === 'Accepted' ? 'good' : 'warn'}>{col.status}</Badge>
                        <button
                          type="button"
                          onClick={() => removeCollaboratorFromEdit(col.email)}
                          className="ml-1 text-rose-500 hover:opacity-75"
                          aria-label="Remove collaborator"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <Btn type="button" onClick={() => setEditingCommitteeForm(null)}>Cancel</Btn>
                <Btn type="submit" variant="primary">Save changes</Btn>
              </div>
            </form>
          </Modal>
        )}

        {/* Full-Screen Admin Notifications Modal */}
        {fullNotifOpen && (
          <div
            onClick={() => setFullNotifOpen(false)}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`max-w-3xl w-full rounded-3xl border p-6 md:p-8 shadow-2xl relative ${
                d ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className={`flex items-center justify-between pb-5 border-b ${
                d ? 'border-zinc-800' : 'border-slate-200'
              }`}>
                <div>
                  <h2 className="text-xl font-extrabold flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-500" /> Admin Alert Center
                  </h2>
                  <p className={`text-xs mt-0.5 ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Committee invitations, recruitment updates, escalations, and payment alerts.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => actions.markRead('ADMIN')}
                    className="text-xs text-emerald-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-4 h-4" /> Mark all read
                  </button>
                  <button
                    onClick={() => setFullNotifOpen(false)}
                    className={`p-2 rounded-xl border ${
                      d ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {pendingInviteCommittees.map((c) => (
                  <div
                    key={`full-inv-${c.id}`}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      d ? 'bg-emerald-950/25 border-emerald-700/40' : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-amber-400 animate-pulse" />
                      <div className="text-xs leading-relaxed">
                        You are invited to join <b>{c.name}</b> by <b>{c.lead}</b> ({c.role}). Accept or reject?
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => respondToInvite(c, true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => respondToInvite(c, false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                          d ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {adminNotifs.filter((n) => n.type !== 'COMMITTEE_INVITE').length === 0 && pendingInviteCommittees.length === 0 ? (
                  <div className={`p-8 text-center text-xs rounded-2xl border ${
                    d ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'
                  }`}>
                    No alerts recorded yet.
                  </div>
                ) : (
                  adminNotifs
                    .filter((n) => n.type !== 'COMMITTEE_INVITE')
                    .map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          d ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-emerald-500" />
                          <div className="text-xs leading-relaxed">{n.text}</div>
                        </div>
                        <span className={`text-[10px] shrink-0 font-mono ${d ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {fmtDateTime(n.ts)}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeCtx.Provider>
  );
}