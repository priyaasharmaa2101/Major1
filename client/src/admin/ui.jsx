import React, { createContext, useContext } from 'react';
import { X } from 'lucide-react';

/* Theme context so every admin component can be dark/light without prop drilling */
export const ThemeCtx = createContext(true);

export const useT = () => {
  const d = useContext(ThemeCtx);
  return {
    d,
    card: d ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200',
    inset: d ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200',
    strong: d ? 'text-white' : 'text-slate-900',
    text: d ? 'text-zinc-200' : 'text-slate-800',
    muted: d ? 'text-zinc-400' : 'text-slate-500',
    faint: d ? 'text-zinc-500' : 'text-slate-400',
    border: d ? 'border-zinc-800' : 'border-slate-200',
    divide: d ? 'divide-zinc-800' : 'divide-slate-100',
    head: d ? 'bg-zinc-950/70 text-zinc-400 border-zinc-800' : 'bg-slate-50 text-slate-500 border-slate-200',
    rowHover: d ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50',
    input: d
      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
  };
};

export function Card({ className = '', children }) {
  const t = useT();
  return <div className={`rounded-2xl border ${t.card} ${className}`}>{children}</div>;
}

const TONES = {
  good: {
    dark: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50',
    light: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  bad: {
    dark: 'text-rose-400 bg-rose-950/50 border-rose-800/50',
    light: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  warn: {
    dark: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    light: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  info: {
    dark: 'text-sky-400 bg-sky-950/50 border-sky-800/50',
    light: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  neutral: {
    dark: 'text-zinc-300 bg-zinc-800 border-zinc-700',
    light: 'text-slate-600 bg-slate-100 border-slate-200',
  },
};

export function Badge({ tone = 'neutral', children, className = '' }) {
  const t = useT();
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${
        TONES[tone][t.d ? 'dark' : 'light']
      } ${className}`}
    >
      {children}
    </span>
  );
}

export const statusTone = {
  Applied: 'neutral',
  Shortlisted: 'info',
  'Slot Booked': 'warn',
  Selected: 'good',
  Rejected: 'bad',
  Pending: 'warn',
  Verified: 'good',
  'In Progress': 'warn',
  Escalated: 'bad',
  Resolved: 'good',
  Confirmed: 'good',
  Waitlisted: 'warn',
};

const BTN = {
  primary: 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  warn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
};

export function Btn({ variant = 'ghost', size = 'md', className = '', children, ...rest }) {
  const t = useT();
  const ghost = t.d
    ? 'border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
    : 'border border-slate-200 text-slate-700 hover:bg-slate-100';
  const pad = size === 'sm' ? 'px-2.5 py-1.5 text-[11px]' : 'px-4 py-2.5 text-xs';
  return (
    <button
      {...rest}
      className={`${pad} rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
        BTN[variant] || ghost
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, children }) {
  const t = useT();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${t.strong}`}>{title}</h2>
        {subtitle && <p className={`text-xs mt-0.5 max-w-2xl ${t.muted}`}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  const t = useT();
  return (
    <label className="block">
      <span className={`text-xs font-semibold block mb-1 ${t.text}`}>{label}</span>
      {children}
      {hint && <span className={`text-[10px] block mt-1 ${t.faint}`}>{hint}</span>}
    </label>
  );
}

export function Input(props) {
  const t = useT();
  return (
    <input
      {...props}
      className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input} ${props.className || ''}`}
    />
  );
}

export function Select({ children, ...props }) {
  const t = useT();
  return (
    <select
      {...props}
      className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input} ${props.className || ''}`}
    >
      {children}
    </select>
  );
}

export function Textarea(props) {
  const t = useT();
  return (
    <textarea
      {...props}
      className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input}`}
    />
  );
}

export function Toggle({ checked, onChange }) {
  const t = useT();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-emerald-500' : t.d ? 'bg-zinc-700' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className={`border rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-6 shadow-2xl ${t.card} ${t.strong}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-lg ${t.muted} hover:opacity-70`} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, icon: Icon, tone = 'good' }) {
  const t = useT();
  const color = {
    good: 'text-emerald-500',
    bad: 'text-rose-500',
    warn: 'text-amber-500',
    info: 'text-sky-500',
  }[tone];
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold ${t.muted}`}>{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${color}`} />}
      </div>
      <div className={`text-2xl font-black mt-1 ${t.strong}`}>{value}</div>
      {sub && <div className={`text-[11px] mt-0.5 ${t.faint}`}>{sub}</div>}
    </Card>
  );
}

export function Empty({ children }) {
  const t = useT();
  return <div className={`text-center py-10 text-xs ${t.faint}`}>{children}</div>;
}

export const byBadge = (by) =>
  by === 'AUTO' ? <Badge tone="good">AUTO</Badge> : by === 'ADMIN' ? <Badge tone="info">ADMIN</Badge> : <Badge>STUDENT</Badge>;
