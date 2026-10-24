import React from 'react';
import { 
  Users, Award, Calendar, AlertCircle, Ticket, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';

export default function OverviewTab({ 
  studentProfile, 
  appliedCommittees, 
  setActiveTab, 
  setIsSlotModalOpen, 
  setIsGrievanceModalOpen,
  isDarkMode = true
}) {
  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
    }`}>
      {/* Welcome Hero Banner */}
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
            Automated Lifecycle System Active
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome back, {studentProfile.name.split(' ')[0]} 👋
          </h1>
          <p className={`text-sm md:text-base leading-relaxed mb-6 ${
            isDarkMode ? 'text-zinc-300' : 'text-emerald-50'
          }`}>
            Your recruitment screening for <b className="text-white">Hostel & Mess Committee</b> is cleared. Next interview slot is confirmed with automated live rubric scoring.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('events')} 
              className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950' 
                  : 'bg-white hover:bg-emerald-50 text-emerald-900'
              }`}
            >
              <Ticket className="w-4 h-4 text-emerald-600" /> Book Garba Pass (₹150)
            </button>
            <button 
              onClick={() => setActiveTab('super50')} 
              className={`font-medium px-4 py-2 rounded-xl text-sm border transition-all flex items-center gap-2 ${
                isDarkMode 
                  ? 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border-zinc-700' 
                  : 'bg-emerald-850/40 hover:bg-emerald-850/60 text-white border-white/20'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" /> Super 50 Status
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Active Application
            </div>
            <div className={`text-xl font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              1 Drive
            </div>
            <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Auto-Screened (CGPA: {studentProfile.cgpa})
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' 
              : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}>
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Next Interview
            </div>
            <div className={`text-xl font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Today, 4:20 PM
            </div>
            <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Auto-booked Slot
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Super 50 Cohort
            </div>
            <div className={`text-xl font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Rank #4
            </div>
            <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Score: 94.2 / 100
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center gap-4 transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`p-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-rose-950/40 text-rose-400 border-rose-900/40' 
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Grievance SLA
            </div>
            <div className={`text-xl font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              1 Escalated
            </div>
            <div className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> &gt; 48 Hrs Warden Alert
            </div>
          </div>
        </div>
      </div>

      {/* Active Application Journey Tracker */}
      <div className={`rounded-2xl border p-6 shadow-sm transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-800' 
          : 'bg-white border-slate-200'
      }`}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between pb-5 border-b gap-2 ${
          isDarkMode ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`font-bold text-lg flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Recruitment Pipeline Status
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isDarkMode 
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Live
              </span>
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Real-time status of your committee application drives
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('committees')} 
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            Explore all drives <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {appliedCommittees.map(item => (
            <div key={item.id} className={`p-5 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                <div>
                  <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {item.name}
                  </h4>
                  <div className={`flex flex-wrap items-center gap-3 text-xs mt-1 ${
                    isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    <span>Applied for: <b className={isDarkMode ? 'text-zinc-200' : 'text-slate-800'}>{item.role}</b></span>
                    <span>•</span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded border ${
                      isDarkMode 
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}>
                      <ShieldCheck className="w-3 h-3" /> Auto-Screened (Passed: CGPA {studentProfile.cgpa} &ge; {item.minCgpa})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsSlotModalOpen(true)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all ${
                      isDarkMode 
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" /> Change Interview Slot
                  </button>
                </div>
              </div>

              {/* 4-Stage Automated Progress Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`p-1.5 rounded-full mt-0.5 border ${
                    isDarkMode 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      1. Form Submitted
                    </div>
                    <div className={`text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Auto-recorded
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`p-1.5 rounded-full mt-0.5 border ${
                    isDarkMode 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      2. Auto Screening
                    </div>
                    <div className="text-[11px] text-emerald-500 font-semibold">
                      Eligibility Met
                    </div>
                  </div>
                </div>

                {/* Step 3 (Active) */}
                <div className={`p-3.5 rounded-lg border ring-2 flex items-start gap-3 ${
                  isDarkMode 
                    ? 'bg-zinc-850/80 border-emerald-500/40 ring-emerald-500/20' 
                    : 'bg-emerald-50/50 border-emerald-300 ring-emerald-500/20'
                }`}>
                  <div className={`p-1.5 rounded-full mt-0.5 border ${
                    isDarkMode 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700/50' 
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  }`}>
                    <Clock className="w-4 h-4 animate-spin" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>
                      3. Interview Slot
                    </div>
                    <div className={`text-[11px] font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {item.interviewSlot}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`p-3.5 rounded-lg border opacity-40 flex items-start gap-3 ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`p-1.5 rounded-full mt-0.5 ${
                    isDarkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDarkMode ? 'text-zinc-400' : 'text-slate-700'}`}>
                      4. Final Selection
                    </div>
                    <div className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                      Post Rubric Scoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}