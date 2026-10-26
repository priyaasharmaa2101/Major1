import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

export default function GrievanceTab({ 
  grievances, 
  setIsGrievanceModalOpen, 
  setSelectedCommitteeForGrievance,
  isDarkMode = true
}) {
  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            48-Hour SLA Grievance Helpdesk
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Directly route hostel, mess, and maintenance issues to student committees. If unresolved within 48 hours, issues auto-escalate to the Chief Warden.
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectedCommitteeForGrievance('Hostel & Mess Committee');
            setIsGrievanceModalOpen(true);
          }}
          className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 self-start"
        >
          <AlertCircle className="w-4 h-4" /> Raise New Complaint
        </button>
      </div>

      {/* Grievance Ticket Cards */}
      <div className="space-y-4">
        {grievances.map(ticket => (
          <div 
            key={ticket.id} 
            className={`p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-mono text-xs font-bold ${
                  isDarkMode ? 'text-zinc-500' : 'text-slate-400'
                }`}>
                  {ticket.id}
                </span>

                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                  isDarkMode 
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}>
                  {ticket.committee}
                </span>

                {ticket.status === 'Escalated' && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border animate-pulse flex items-center gap-1 ${
                    isDarkMode 
                      ? 'text-rose-400 bg-rose-950/50 border-rose-800/50' 
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    <AlertCircle className="w-3 h-3" /> ESCALATED TO CHIEF WARDEN
                  </span>
                )}

                {ticket.status === 'Resolved' && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isDarkMode 
                      ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50' 
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" /> RESOLVED
                  </span>
                )}

                {ticket.status === 'In Progress' && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isDarkMode 
                      ? 'text-amber-400 bg-amber-950/50 border-amber-800/50' 
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    <Clock className="w-3 h-3" /> IN PROGRESS
                  </span>
                )}
              </div>

              <h4 className={`font-bold text-sm md:text-base ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {ticket.title}
              </h4>
              <p className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                {ticket.description}
              </p>
              {ticket.response && (
                <p className={`text-xs leading-relaxed p-2.5 rounded-lg border ${
                  isDarkMode ? 'bg-zinc-950 border-zinc-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <b>Admin response:</b> {ticket.response}
                </p>
              )}
            </div>

            <div className={`flex flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-2 ${
              isDarkMode ? 'border-zinc-800' : 'border-slate-100'
            }`}>
              <div className={`text-xs font-semibold flex items-center gap-1.5 ${
                isDarkMode ? 'text-zinc-300' : 'text-slate-700'
              }`}>
                <Clock className={`w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                Auto-Escalation SLA: <b className="text-rose-500">{ticket.slaRemaining}</b>
              </div>
              <div className={`text-[11px] ${
                isDarkMode ? 'text-zinc-500' : 'text-slate-400'
              }`}>
                Created: {ticket.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}