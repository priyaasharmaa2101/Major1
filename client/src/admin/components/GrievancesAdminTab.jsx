import React, { useState } from 'react';
import { CheckCircle2, ArrowUp, RotateCcw, Clock } from 'lucide-react';
import { useDB, actions, fmtDate, slaRemainingMs } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Modal, Field, Textarea, Empty, statusTone, useT } from '../ui';

const FILTERS = ['Open', 'All', 'In Progress', 'Escalated', 'Resolved'];
const order = { Escalated: 0, 'In Progress': 1, Resolved: 2 };

export default function GrievancesAdminTab({ now, toast }) {
  const db = useDB();
  const t = useT();
  const [filter, setFilter] = useState('Open');
  const [resolving, setResolving] = useState(null);
  const [response, setResponse] = useState('');

  const list = db.grievances
    .filter((g) => (filter === 'All' ? true : filter === 'Open' ? g.status !== 'Resolved' : g.status === filter))
    .sort((a, b) => order[a.status] - order[b.status] || slaRemainingMs(a, now) - slaRemainingMs(b, now));

  const slaText = (g) => {
    if (g.status === 'Resolved') return 'Resolved';
    const ms = slaRemainingMs(g, now);
    if (g.status === 'Escalated' || ms <= 0) return `Overdue by ${Math.max(0, Math.floor(-ms / 36e5))}h`;
    return `${Math.floor(ms / 36e5)}h ${Math.floor((ms % 36e5) / 6e4)}m left`;
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Grievance Desk"
        subtitle={`Tickets auto-escalate to the Chief Warden after ${db.settings.slaHours}h (when auto-escalation is ON). Resolve with a note, the student is notified instantly.`}
      />

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
              filter === f ? 'bg-emerald-400 border-emerald-400 text-zinc-950' : `${t.border} ${t.muted} ${t.rowHover}`
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((g) => {
          const st = db.students.find((s) => s.rollNo === g.rollNo);
          return (
            <Card key={g.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-mono text-xs font-bold ${t.faint}`}>{g.id}</span>
                  <Badge tone="info">{g.committee}</Badge>
                  <Badge tone={statusTone[g.status]}>{g.status.toUpperCase()}</Badge>
                </div>
                <h4 className={`font-bold text-sm ${t.strong}`}>{g.title}</h4>
                <p className={`text-xs ${t.muted}`}>{g.description}</p>
                <div className={`text-[11px] ${t.faint}`}>
                  Raised by {st?.name} ({g.rollNo}) • {fmtDate(g.createdAtMs)}
                </div>
                {g.response && <p className="text-xs text-emerald-500"><b>Response:</b> {g.response}</p>}
              </div>
              <div className="flex flex-col md:items-end gap-3">
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${g.status === 'Escalated' ? 'text-rose-500' : t.text}`}>
                  <Clock className="w-4 h-4" /> {slaText(g)}
                </div>
                <div className="flex gap-1.5">
                  {g.status !== 'Resolved' && (
                    <Btn size="sm" variant="primary" onClick={() => { setResolving(g); setResponse(''); }}>
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </Btn>
                  )}
                  {g.status === 'In Progress' && (
                    <Btn size="sm" onClick={() => actions.escalateGrievance(g.id)}><ArrowUp className="w-3 h-3" /> Escalate</Btn>
                  )}
                  {g.status === 'Resolved' && (
                    <Btn size="sm" onClick={() => actions.reopenGrievance(g.id)}><RotateCcw className="w-3 h-3" /> Reopen</Btn>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && <Card><Empty>No tickets in this view.</Empty></Card>}
      </div>

      {resolving && (
        <Modal title={`Resolve ${resolving.id}`} onClose={() => setResolving(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              actions.resolveGrievance(resolving.id, response);
              toast(`${resolving.id} resolved, student notified`);
              setResolving(null);
            }}
            className="space-y-3"
          >
            <Field label="Response to student">
              <Textarea rows={4} required value={response} onChange={(e) => setResponse(e.target.value)} placeholder="What was done to fix it?" />
            </Field>
            <div className="flex justify-end gap-3">
              <Btn type="button" onClick={() => setResolving(null)}>Cancel</Btn>
              <Btn type="submit" variant="primary">Mark resolved</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
