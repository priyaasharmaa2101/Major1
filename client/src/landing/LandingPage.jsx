import React from 'react';
import {
  ArrowRight,
  Users,
  Award,
  Ticket,
  AlertCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  const modules = [
    {
      icon: Users,
      title: 'Committee Recruitment & Slots',
      desc: 'Automated CGPA and branch eligibility screening with self-service interview slot booking that prevents double bookings.',
    },
    {
      icon: Award,
      title: 'Super 50 Merit Cohort',
      desc: 'Transparent composite scoring combining proctored assessments and panel rubrics with live leaderboard standings.',
    },
    {
      icon: Ticket,
      title: 'Event & Fest Passes',
      desc: 'Instant seat reservations for Garba Nights, Fiesta, and inter-college hackathons with verifiable digital QR gate passes.',
    },
    {
      icon: AlertCircle,
      title: '48-Hour SLA Grievance Desk',
      desc: 'Structured campus issue tracking with automated escalation timers so student complaints never stall.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-400 selection:text-zinc-950 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                CampusNexus
              </span>
              <span className="text-[10px] text-zinc-400">
                College Governance Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-4 py-2 text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-zinc-950 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* Hero Section */}
        <section className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" /> Unified Student & Admin Operations
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Run campus committees, events, and grievances in one place.
          </h1>

          <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            CampusNexus replaces scattered forms, manual shortlisting, and untracked complaints with an automated workflow connecting students, committee leads, and faculty administrators.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-xl shadow-emerald-500/15 transition-all flex items-center gap-2"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 transition-all"
            >
              Sign In to Portal
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Role-based Student & Admin access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant CGPA auto-screening
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live SLA escalation tracking
            </span>
          </div>
        </section>

        {/* Core Modules Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Platform Modules
            </h2>
            <p className="text-xl font-bold text-white mt-1">
              Built for every part of student governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Strip */}
        <section className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Students & Faculty Leads
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Ready to access your campus workspace?
            </h3>
            <p className="text-xs text-zinc-400">
              Sign in with your college credentials or register a new student or committee lead account.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-zinc-700 text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-zinc-950 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>CampusNexus • Student Governance & Operations</span>
          <span>© 2026 All rights reserved</span>
        </div>
      </footer>
    </div>
  );
}