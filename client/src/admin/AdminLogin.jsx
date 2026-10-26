import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

// DEMO ONLY: credentials live in the browser bundle, so this is NOT real security.
// Replace with a backend login (JWT / session) before going live.
export const ADMIN_EMAIL = 'admin@campus.edu';
export const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) onLogin();
    else setError('Invalid admin credentials');
  };

  const field =
    'w-full text-sm p-3 rounded-xl border bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <form onSubmit={submit} className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-zinc-950"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <div className="font-extrabold text-white">CampusSync Admin</div>
            <div className="text-[11px] text-zinc-400">Governance control panel</div>
          </div>
        </div>
        <input className={field} type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-xs text-rose-400">{error}</div>}
        <button type="submit" className="w-full py-3 rounded-xl text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-zinc-950">
          Sign in
        </button>
        <div className="text-[11px] text-zinc-500 text-center">
          Demo login: <span className="font-mono text-zinc-300">{ADMIN_EMAIL}</span> / <span className="font-mono text-zinc-300">{ADMIN_PASSWORD}</span>
        </div>
      </form>
    </div>
  );
}
