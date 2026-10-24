import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, Search, ChevronRight, 
  MapPin, AlertCircle, MessageSquare 
} from 'lucide-react';

export default function CommitteesTab({ 
  committees, 
  handleApplyClick, 
  setIsGrievanceModalOpen, 
  setSelectedCommitteeForGrievance,
  isDarkMode = true
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommittees = committees.filter(comm => 
    comm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
    }`}>
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Campus Committees & Dynamic Hiring
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Verified campus bodies. Apply during active recruitment or reach out directly for assistance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3 top-2.5 ${
              isDarkMode ? 'text-zinc-500' : 'text-slate-400'
            }`} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search committee, role..." 
              className={`pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors w-64 ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Committee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredCommittees.map(comm => (
          <div 
            key={comm.id} 
            className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Badges Bar */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                  isDarkMode 
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}>
                  {comm.tag}
                </span>
                <span className={`text-xs flex items-center gap-1 ${
                  isDarkMode ? 'text-zinc-400' : 'text-slate-400'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> Closes {comm.deadline}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className={`font-bold text-base mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {comm.name}
              </h3>
              <p className={`text-xs mb-4 leading-relaxed line-clamp-2 ${
                isDarkMode ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                {comm.description}
              </p>

              {/* Key Specs Box */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 mb-4 ${
                isDarkMode ? 'bg-zinc-950/70 border-zinc-800/80' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`flex justify-between ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span>Current Head:</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {comm.lead}
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span>Cutoff Criteria:</span>
                  <span className="font-semibold text-emerald-500">
                    Min {comm.minCgpa} CGPA
                  </span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span>Open Seats:</span>
                  <span className="font-bold text-emerald-500">
                    {comm.vacancies} Vacancies
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`pt-3 border-t flex items-center gap-2 ${
              isDarkMode ? 'border-zinc-800' : 'border-slate-100'
            }`}>
              <button 
                onClick={() => handleApplyClick(comm)}
                className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-all shadow-xs ${
                  isDarkMode 
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                Apply for {comm.role}
              </button>
              <button 
                onClick={() => {
                  setSelectedCommitteeForGrievance(comm.name);
                  setIsGrievanceModalOpen(true);
                }}
                title="Submit Grievance / Query"
                className={`p-2.5 border rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommittees.length === 0 && (
        <div className={`text-center py-12 rounded-2xl border ${
          isDarkMode ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400' : 'border-slate-200 bg-white text-slate-500'
        }`}>
          No committees found matching "{searchTerm}".
        </div>
      )}
    </div>
  );
}