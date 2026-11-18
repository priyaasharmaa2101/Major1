import React from 'react';
import {
  Users, Award, Calendar, AlertCircle, Ticket, Clock,
  ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { formatEventDate } from '../../shared/dateUtils';
export default function OverviewTab({
  studentProfile = {},
  appliedCommittees = [],
  setActiveTab,
  setIsSlotModalOpen,
  setSlotTargetId,
  setIsGrievanceModalOpen,
  super50 = null,
  grievances = [],
  isDarkMode = true
}) {
  const applications = Array.isArray(appliedCommittees) ? appliedCommittees : [];
  const bookedInterview = applications.find((item) => item?.status === 'Slot Booked');

  const grievanceList = Array.isArray(grievances) ? grievances : [];
  const escalated = grievanceList.filter((g) => g.status === 'Escalated').length;
  const openGrievances = grievanceList.filter((g) => g.status !== 'Resolved').length;

  const myRank = super50?.myRank || null;
  const myScore = myRank ? super50?.rows?.find((r) => r.rank === myRank)?.compositeScore : null;

  const panelClass = isDarkMode
    ? 'bg-zinc-900 border-zinc-800'
    : 'bg-white border-slate-200';
  const primaryText = isDarkMode ? 'text-white' : 'text-slate-900';
  const secondaryText = isDarkMode ? 'text-zinc-400' : 'text-slate-500';

  const metrics = [
    {
      label: 'Active Applications',
      value: String(applications.length),
      detail: applications.length === 1 ? '1 application recorded' : `${applications.length} applications recorded`,
      Icon: Users,
      iconClass: isDarkMode
        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      label: 'Next Interview',
      value: bookedInterview?.interviewSlot || 'Not scheduled',
      detail: bookedInterview?.name || 'No interview slot booked',
      Icon: Calendar,
      iconClass: isDarkMode
        ? 'bg-amber-950/40 text-amber-400 border-amber-900/40'
        : 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      label: 'Super 50 Status',
      value: myRank ? `Rank #${myRank}` : 'Not ranked yet',
      detail: myRank ? `Score: ${myScore}` : 'Appears after assessment',
      Icon: Award,
      iconClass: isDarkMode
        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      label: 'Grievances',
      value: escalated > 0 ? `${escalated} Escalated` : openGrievances > 0 ? `${openGrievances} Open` : 'No tickets',
      detail: escalated > 0 ? 'Escalated to Chief Warden' : openGrievances > 0 ? 'Being handled within SLA' : 'Nothing pending',
      Icon: AlertCircle,
      iconClass: isDarkMode
        ? 'bg-rose-950/40 text-rose-400 border-rose-900/40'
        : 'bg-rose-50 text-rose-700 border-rose-100'
    }
  ];

  return (
    <div className={`space-y-6 transition-colors duration-200 ${primaryText}`}>
      {/* Welcome banner */}
      <div className={`rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white border-zinc-800'
          : 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-emerald-600 shadow-emerald-900/10'
      }`}>
        <div className="relative z-10 max-w-2xl">
          <div className={`inline-flex items-center gap-2 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDarkMode
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
              : 'bg-white/15 border-white/25 text-emerald-100'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            CampusSync Student Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome back{studentProfile?.name ? `, ${studentProfile.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className={`text-sm md:text-base leading-relaxed mb-6 ${
            isDarkMode ? 'text-zinc-300' : 'text-emerald-50'
          }`}>
            View your committee applications, check interview updates, and explore campus events from one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab?.('committees')}
              className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900'
              }`}
            >
              <Users className="w-4 h-4" /> Explore Committees
            </button>
            <button
              onClick={() => setActiveTab?.('events')}
              className={`font-medium px-4 py-2 rounded-xl text-sm border transition-all flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border-zinc-700'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
              }`}
            >
              <Ticket className="w-4 h-4" /> View Events
            </button>
          </div>
        </div>
      </div>

      {/* Live data summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, detail, Icon, iconClass }) => (
          <div key={label} className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${panelClass}`}>
            <div className={`p-3 rounded-xl border ${iconClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className={`text-xs font-medium ${secondaryText}`}>{label}</div>
              <div className={`text-xl font-bold mt-0.5 break-words ${primaryText}`}>{value}</div>
              <div className={`text-[11px] font-medium mt-0.5 ${secondaryText}`}>{detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actual application records */}
      <div className={`rounded-2xl border p-6 shadow-sm transition-colors ${panelClass}`}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between pb-5 border-b gap-2 ${
          isDarkMode ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`font-bold text-lg flex items-center gap-2 ${primaryText}`}>
              Your Recruitment Applications
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isDarkMode
                  ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {applications.length}
              </span>
            </h3>
            <p className={`text-xs ${secondaryText}`}>
              Application information available for your account
            </p>
          </div>
          <button
            onClick={() => setActiveTab?.('committees')}
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            Explore all drives <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {applications.length === 0 ? (
          <div className={`mt-6 rounded-xl border border-dashed p-8 text-center ${
            isDarkMode ? 'border-zinc-700 bg-zinc-950/40' : 'border-slate-300 bg-slate-50'
          }`}>
            <Users className={`w-8 h-8 mx-auto mb-3 ${secondaryText}`} />
            <p className={`font-semibold ${primaryText}`}>No applications yet</p>
            <p className={`text-sm mt-1 ${secondaryText}`}>
              Your committee applications will appear here once you apply.
            </p>
            <button
              onClick={() => setActiveTab?.('committees')}
              className="mt-4 text-sm font-semibold text-emerald-500 hover:text-emerald-400"
            >
              Browse committees <ArrowRight className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {applications.map((item, index) => (
              <div
                key={item?.id || `${item?.name || 'application'}-${index}`}
                className={`p-5 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h4 className={`font-bold text-base ${primaryText}`}>
                      {item?.name || 'Committee application'}
                    </h4>
                    <div className={`flex flex-wrap items-center gap-3 text-xs mt-1 ${secondaryText}`}>
                      {item?.role && <span>Applied for: <b className={primaryText}>{item.role}</b></span>}
                      {item?.status && <span>Status: <b className={primaryText}>{item.status}</b></span>}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    {item?.interviewSlot ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-500 font-semibold">
                        <Calendar className="w-4 h-4" />
                        {item.status === 'Slot Booked' ? `Interview: ${item.interviewSlot}` : item.interviewSlot}
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 text-xs ${secondaryText}`}>
                        <Clock className="w-4 h-4" /> Interview not scheduled
                      </div>
                    )}

                    {['Shortlisted', 'Slot Booked'].includes(item?.status) && (
                      <button
                        onClick={() => {
                          setSlotTargetId?.(item.id);
                          setIsSlotModalOpen?.(true);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          isDarkMode
                            ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {item.status === 'Shortlisted' ? 'Pick Interview Slot' : 'Change Interview Slot'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}