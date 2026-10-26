import React from 'react';
import { Ticket, Calendar, MapPin, QrCode, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function EventsTab({ events, myPasses, handleBookPass, isDarkMode = true }) {
  return (
    <div className={`space-y-6 transition-colors duration-200 ${
      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
    }`}>
      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Garba & Fiesta Event Passes
        </h2>
        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
          Reserve your passes, make instant UPI payments, and access verified QR codes for college gate entry scanning.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div 
            key={event.id} 
            className={`rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="p-6">
              {/* Tag & Price */}
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                  isDarkMode 
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                    : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                }`}>
                  {event.tag}
                </span>
                <span className={`text-2xl font-black ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  {event.price}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className={`text-lg font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {event.title}
              </h3>
              <p className={`text-xs mb-4 leading-relaxed ${
                isDarkMode ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                {event.description}
              </p>

              {/* Info Box */}
              <div className={`space-y-2.5 text-xs p-4 rounded-xl border ${
                isDarkMode ? 'bg-zinc-950/70 border-zinc-800/80' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`flex items-center gap-2 ${
                  isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                }`}>
                  <Calendar className="w-4 h-4 text-emerald-500" /> {event.date}
                </div>
                <div className={`flex items-center gap-2 ${
                  isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                }`}>
                  <MapPin className="w-4 h-4 text-rose-500" /> {event.venue}
                </div>
                <div className={`flex items-center justify-between pt-2 border-t font-semibold ${
                  isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span>Seat Availability:</span>
                  <span className="text-emerald-500 font-bold">{event.seatsLeft} Passes Remaining</span>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <div className="p-6 pt-0">
              <button 
                onClick={() => handleBookPass(event)}
                disabled={event.seatsLeft <= 0}
                className={`w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-emerald-500/10' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Ticket className="w-4 h-4" /> {event.seatsLeft <= 0 ? 'Sold Out' : `Book & Pay (${event.price})`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Issued Digital Passes (With QR Code) */}
      {myPasses.length > 0 && (
        <div className="mt-10">
          <h3 className={`font-bold text-base mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <QrCode className="w-5 h-5 text-emerald-500" /> Your Verified Digital Passes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {myPasses.map(pass => (
              <div 
                key={pass.id} 
                className={`p-5 rounded-2xl shadow-lg border flex justify-between items-center transition-all ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border-zinc-800' 
                    : 'bg-gradient-to-br from-emerald-900 to-slate-900 text-white border-emerald-800'
                }`}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                    Official Gate Entry Pass
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5 leading-snug">
                    {pass.eventTitle}
                  </h4>
                  <div className="text-xs text-zinc-300 mt-2.5 space-y-1">
                    <div>Attendee: <b className="text-white">{pass.userName}</b></div>
                    <div>Roll No: <span className="font-mono text-zinc-300">{pass.rollNo}</span></div>
                    <div>Pass ID: <span className="font-mono text-emerald-400 font-semibold">{pass.passId}</span></div>
                  </div>
                  <div className="mt-3.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Payment Verified
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-xl shadow-inner flex flex-col items-center shrink-0 ml-4">
                  <div className="w-20 h-20 bg-zinc-950 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-16 h-16 text-emerald-400" />
                  </div>
                  <span className="text-[9px] text-zinc-600 font-mono mt-1 font-bold tracking-tighter">
                    SCAN AT GATE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}