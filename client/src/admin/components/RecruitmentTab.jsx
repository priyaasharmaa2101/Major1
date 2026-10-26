import React, { useState } from 'react';
import { Check, X, UserCheck, Zap } from 'lucide-react';
import { useDB, actions, fmtDate } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Select, Empty, statusTone, useT } from '../ui';

const STATUSES = ['All', 'Applied', 'Shortlisted', 'Slot Booked', 'Selected', 'Rejected'];

export default function RecruitmentTab({ toast }) {
  const db = useDB();
  const t = useT();
  const [committee, setCommittee] = useState('all');
  const [status, setStatus] = useState('All');

  const rows = db.applications.filter(
    (a) => (committee === 'all' || a.committeeId === committee) && (status === 'All' || a.status === status),
  );

  const slotUsed = (slotId, appId) =>
    db.applications.filter((a) => a.slotId === slotId && a.status !== 'Rejected' && a.id !== appId).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Recruitment & Interviews"
        subtitle="Applications are screened, scheduled and (after interview score) selected automatically. Override any step manually here."
      >
        <Btn size="sm" onClick={() => toast(`Screened ${actions.screenPending()} application(s)`)}>
          <Zap className="w-3.5 h-3.5" /> Screen pending
        </Btn>
        <Btn size="sm" onClick={() => toast(`Allocated ${actions.allocateSlots()} slot(s)`)}>
          <Zap className="w-3.5 h-3.5" /> Allocate slots
        </Btn>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <Select value={committee} onChange={(e) => setCommittee(e.target.value)}>
            <option value="all">All committees</option>
            {db.committees.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                status === s
                  ? 'bg-emerald-400 border-emerald-400 text-zinc-950'
                  : `${t.border} ${t.muted} ${t.rowHover}`
              }`}
            >
              {s} {s !== 'All' && `(${db.applications.filter((a) => a.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={`text-left border-b ${t.head}`}>
              {['Student', 'Committee', 'Applied', 'Status', 'Interview slot', 'Score /10', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${t.divide}`}>
            {rows.map((a) => {
              const st = db.students.find((s) => s.rollNo === a.rollNo);
              const c = db.committees.find((x) => x.id === a.committeeId);
              const canSlot = ['Shortlisted', 'Slot Booked'].includes(a.status);
              return (
                <tr key={a.id} className={t.rowHover}>
                  <td className="px-4 py-3">
                    <div className={`font-bold ${t.strong}`}>{st?.name}</div>
                    <div className={t.faint}>{a.rollNo} • CGPA {st?.cgpa}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={t.text}>{c?.name}</div>
                    <div className={t.faint}>min CGPA {c?.minCgpa}</div>
                  </td>
                  <td className={`px-4 py-3 ${t.muted}`}>{fmtDate(a.appliedOn)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                    {a.decidedBy && <div className={`text-[10px] mt-1 ${t.faint}`}>by {a.decidedBy}</div>}
                    {a.remark && <div className="text-[10px] mt-1 text-rose-500 max-w-[10rem]">{a.remark}</div>}
                  </td>
                  <td className="px-4 py-3 w-56">
                    {canSlot ? (
                      <Select
                        value={a.slotId || ''}
                        onChange={(e) => {
                          const r = actions.assignSlotToApp(a.id, e.target.value);
                          if (r && !r.ok) toast(r.error || 'Could not assign');
                        }}
                      >
                        <option value="" disabled>Choose slot…</option>
                        {db.slots.map((s) => (
                          <option key={s.id} value={s.id} disabled={s.id !== a.slotId && slotUsed(s.id, a.id) >= s.capacity}>
                            {s.label}{slotUsed(s.id, a.id) >= s.capacity && s.id !== a.slotId ? ' (full)' : ''}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <span className={t.faint}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 w-24">
                    {a.status === 'Slot Booked' || a.status === 'Selected' ? (
                      <input
                        key={`${a.id}-${a.interviewScore}`}
                        type="number" min="0" max="10" step="0.1"
                        defaultValue={a.interviewScore ?? ''}
                        placeholder="0-10"
                        onBlur={(e) => {
                          const v = e.target.value;
                          if (String(a.interviewScore ?? '') !== v) actions.setInterviewScore(a.id, v);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                        className={`w-20 text-xs p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input}`}
                      />
                    ) : (
                      <span className={t.faint}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {a.status === 'Applied' && (
                        <Btn size="sm" onClick={() => actions.setApplicationStatus(a.id, 'Shortlisted')}>
                          <Check className="w-3 h-3" /> Shortlist
                        </Btn>
                      )}
                      {['Shortlisted', 'Slot Booked'].includes(a.status) && (
                        <Btn size="sm" variant="primary" onClick={() => actions.setApplicationStatus(a.id, 'Selected')}>
                          <UserCheck className="w-3 h-3" /> Select
                        </Btn>
                      )}
                      {a.status !== 'Rejected' && (
                        <Btn size="sm" onClick={() => actions.setApplicationStatus(a.id, 'Rejected')}>
                          <X className="w-3 h-3" /> Reject
                        </Btn>
                      )}
                      {a.status === 'Rejected' && (
                        <Btn size="sm" onClick={() => actions.setApplicationStatus(a.id, 'Shortlisted')}>Reconsider</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <Empty>No applications match these filters.</Empty>}
      </Card>
    </div>
  );
}
