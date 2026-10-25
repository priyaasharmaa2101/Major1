import React from 'react';
import { Award, ShieldCheck, Clock, CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function Super50Tab({ super50List, studentProfile, isDarkMode = true }) {
  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
    }`}>
      {/* Top Banner */}
      <div className={`rounded-2xl p-6 shadow-md border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border-zinc-800' 
          : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-800'
      }`}>
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Flagship Campus Talent Cohort
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Super 50 Automated Selection Engine</h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl leading-relaxed">
            Real-time evaluation combines proctored coding assessments, automated aptitude grading, and panel live rubric scoring.
          </p>
        </div>

        <div className={`px-5 py-3 rounded-xl flex items-center gap-4 border ${
          isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/10 border-white/20 backdrop-blur-xs'
        }`}>
          <div>
            <div className="text-[11px] text-zinc-300">Your Current Rank</div>
            <div className="text-2xl font-black text-amber-400">#4 / 350+</div>
          </div>
          <div className={`h-8 w-px ${isDarkMode ? 'bg-zinc-800' : 'bg-white/20'}`}></div>
          <div>
            <div className="text-[11px] text-zinc-300">Aggregate Score</div>
            <div className="text-2xl font-black text-emerald-400">94.2%</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className={`rounded-2xl border shadow-xs overflow-hidden transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div className={`p-5 border-b flex items-center justify-between ${
          isDarkMode ? 'border-zinc-800' : 'border-slate-100'
        }`}>
          <h3 className={`font-bold text-sm md:text-base flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Award className="w-5 h-5 text-amber-400" />
            Live Top 50 Cohort Leaderboard
          </h3>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border ${
            isDarkMode 
              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Anti-cheat Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-left text-xs ${
            isDarkMode ? 'text-zinc-300' : 'text-slate-600'
          }`}>
            <thead className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
              isDarkMode 
                ? 'bg-zinc-950/70 text-zinc-400 border-zinc-800' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Roll No</th>
                <th className="px-6 py-3.5">Aptitude / Coding</th>
                <th className="px-6 py-3.5">Panel Rubric</th>
                <th className="px-6 py-3.5">Final Score</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-slate-100'}`}>
              {super50List.map(candidate => {
                const isCurrentUser = candidate.name.includes(studentProfile.name.split(' ')[0]);
                return (
                  <tr 
                    key={candidate.rollNo} 
                    className={`transition-colors ${
                      isCurrentUser 
                        ? isDarkMode 
                          ? 'bg-emerald-950/30 font-medium' 
                          : 'bg-emerald-50/70 font-medium'
                        : isDarkMode
                          ? 'hover:bg-zinc-800/40'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className={`px-6 py-4 font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {candidate.rank <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          isDarkMode 
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {candidate.rank}
                        </span>
                      ) : (
                        `#${candidate.rank}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {candidate.name}
                      </div>
                      <div className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {candidate.branch}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-mono text-[11px] ${
                      isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                    }`}>
                      {candidate.rollNo}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-slate-700'}`}>
                      {candidate.assessmentScore}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-slate-700'}`}>
                      {candidate.interviewScore}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-500">
                      {candidate.compositeScore}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {candidate.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}