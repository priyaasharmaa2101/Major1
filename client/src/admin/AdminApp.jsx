import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Building2, Ticket, AlertCircle, Award, Bot,
  Sun, Moon, Bell, LogOut, Sparkles, ExternalLink,
} from 'lucide-react';

import AdminLogin from './AdminLogin';
import { ThemeCtx } from './ui';
import DashboardTab from './components/DashboardTab';
import RecruitmentTab from './components/RecruitmentTab';
import CommitteesAdminTab from './components/CommitteesAdminTab';
import EventsAdminTab from './components/EventsAdminTab';
import GrievancesAdminTab from './components/GrievancesAdminTab';
import Super50AdminTab from './components/Super50AdminTab';
import AutomationTab from './components/AutomationTab';

import { useDB, actions, fmtDateTime } from '../shared/store';
import { useAutomationLoop } from '../shared/hooks';

const SESSION_KEY = 'campussync:admin-session';

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
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY);
        if (onExternalLogout) onExternalLogout();
        else setAuthed(false);
      }}
    />
  );
}

function AdminShell({ onLogout }) {
  const db = useDB();
  const now = useAutomationLoop();
  const [tab, setTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const toast = (m) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const adminNotifs = db.notifications.filter((n) => n.to === 'ADMIN');
  const unread = adminNotifs.filter((n) => !n.read).length;

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recruitment', label: 'Recruitment', icon: Users, badge: db.applications.filter((a) => a.status === 'Applied').length },
    { id: 'committees', label: 'Committees', icon: Building2 },
    { id: 'events', label: 'Events & Payments', icon: Ticket, badge: db.payments.filter((p) => p.status === 'Pending').length },
    { id: 'grievances', label: 'Grievances', icon: AlertCircle, badge: db.grievances.filter((g) => g.status !== 'Resolved').length },
    { id: 'super50', label: 'Super 50', icon: Award },
    { id: 'automation', label: 'Automation', icon: Bot },
  ];

  const page = {
    dashboard: <DashboardTab now={now} />,
    recruitment: <RecruitmentTab toast={toast} />,
    committees: <CommitteesAdminTab toast={toast} />,
    events: <EventsAdminTab toast={toast} />,
    grievances: <GrievancesAdminTab now={now} toast={toast} />,
    super50: <Super50AdminTab toast={toast} />,
    automation: <AutomationTab toast={toast} />,
  }[tab];

  const d = isDark;

  return (
    <ThemeCtx.Provider value={isDark}>
      <div className={`flex min-h-screen font-sans transition-colors ${d ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
        {toastMsg && (
          <div className={`fixed bottom-5 right-5 z-[60] px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border ${
            d ? 'bg-zinc-900 text-zinc-100 border-zinc-700' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500" /> {toastMsg}
          </div>
        )}

        {/* Sidebar */}
        <aside className={`w-64 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen border-r ${
          d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className={`p-6 border-b flex items-center gap-3 ${d ? 'border-zinc-800' : 'border-slate-100'}`}>
              <div className={`p-2.5 rounded-xl font-black text-sm ${d ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'}`}>⚡</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-base ${d ? 'text-white' : 'text-slate-900'}`}>CampusSync</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    d ? 'text-amber-400 bg-amber-950/40 border-amber-800/40' : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>ADMIN</span>
                </div>
                <div className={`text-[10px] ${d ? 'text-zinc-400' : 'text-slate-400'}`}>Governance control panel</div>
              </div>
            </div>
            <nav className="p-4 space-y-1.5">
              {nav.map((n) => {
                const Icon = n.icon;
                const active = tab === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setTab(n.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      active
                        ? d ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : d ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-transparent' : 'text-slate-600 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5"><Icon className="w-4 h-4" />{n.label}</span>
                    {n.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                        d ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>{n.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className={`p-4 border-t space-y-2 ${d ? 'border-zinc-800' : 'border-slate-100'}`}>
            <a href="/" target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${d ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ExternalLink className="w-4 h-4" /> Open student view
            </a>
            <button onClick={onLogout} className={`w-full flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${d ? 'text-rose-400 hover:bg-rose-950/30' : 'text-rose-600 hover:bg-rose-50'}`}>
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className={`border-b sticky top-0 z-30 h-16 px-6 flex items-center justify-between backdrop-blur-md ${
            d ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'
          }`}>
            <div className={`text-xs font-medium ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
              Admin / <span className={`font-bold capitalize ${d ? 'text-white' : 'text-slate-900'}`}>{tab}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${
                d ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Automation running
              </div>
              <button onClick={() => setIsDark((v) => !v)} aria-label="Toggle theme" className={`p-2 rounded-xl border ${
                d ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-amber-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}>
                {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => { const o = !notifOpen; setNotifOpen(o); if (o) actions.markRead('ADMIN'); }}
                  className={`p-2 rounded-xl border relative ${d ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800' : 'text-slate-500 hover:bg-slate-100 border-slate-200'}`}
                >
                  <Bell className="w-4 h-4" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className={`absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border shadow-2xl z-40 ${d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <div className={`px-4 py-2.5 text-xs font-bold border-b ${d ? 'border-zinc-800 text-white' : 'border-slate-100 text-slate-900'}`}>Admin alerts</div>
                    {adminNotifs.length === 0 && <div className={`p-4 text-xs ${d ? 'text-zinc-500' : 'text-slate-400'}`}>No alerts.</div>}
                    {adminNotifs.slice(0, 20).map((n) => (
                      <div key={n.id} className={`px-4 py-2.5 text-xs border-b last:border-0 ${d ? 'border-zinc-800 text-zinc-300' : 'border-slate-100 text-slate-700'}`}>
                        {n.text}
                        <div className={`text-[10px] mt-0.5 ${d ? 'text-zinc-500' : 'text-slate-400'}`}>{fmtDateTime(n.ts)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Mobile nav */}
          <div className={`md:hidden flex overflow-x-auto border-b p-2 gap-2 ${d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            {nav.map((n) => (
              <button key={n.id} onClick={() => setTab(n.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                tab === n.id
                  ? d ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : d ? 'bg-zinc-950 text-zinc-400 border-zinc-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>{n.label}</button>
            ))}
          </div>

          <main className="p-6 max-w-7xl w-full mx-auto">{page}</main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
