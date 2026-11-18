import React, { useState } from 'react';
import { CheckCircle2, ArrowUp, RotateCcw, Clock , Sparkles} from 'lucide-react';
import { useDB, actions, fmtDate, slaRemainingMs } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Modal, Field, Textarea, Empty, statusTone, useT } from '../ui';

import { updateGrievanceRemote, assessGrievanceAI } from '../../shared/grievanceService';
const FILTERS = ['Open', 'All', 'In Progress', 'Escalated', 'Resolved'];
const order = { Escalated: 0, 'In Progress': 1, Resolved: 2 };
function AiList({ title, items, t }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className={`font-semibold ${t.strong}`}>{title}</div>
      <ul className={`list-disc pl-5 mt-1 space-y-0.5 ${t.muted}`}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}
export default function GrievancesAdminTab({ now, toast }) {
  const db = useDB();
  const t = useT();
  const [filter, setFilter] = useState('Open');
  const [resolving, setResolving] = useState(null);
  const [response, setResponse] = useState('');
  const [ai, setAi] = useState(null);
  const [aiLoadingId, setAiLoadingId] = useState(null);

  const run = (promise) => promise.catch((e) => toast(e.message));

  const askAI = async (g) => {
    setAiLoadingId(g.id);
    try {
      const result = await assessGrievanceAI(g);
      setAi({ ticket: g, result });
    } catch (e) {
      toast(e.message || 'AI request failed.');
    } finally {
      setAiLoadingId(null);
    }
  };
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
                                    Raised by {g.studentName || st?.name} ({g.rollNo})• {fmtDate(g.createdAtMs)}
                </div>
                {g.response && <p className="text-xs text-emerald-500"><b>Response:</b> {g.response}</p>}
              </div>
              <div className="flex flex-col md:items-end gap-3">
                <div className={`text-xs font-semibold flex items-center gap-1.5 ${g.status === 'Escalated' ? 'text-rose-500' : t.text}`}>
                  <Clock className="w-4 h-4" /> {slaText(g)}
                </div>
                               <div className="flex gap-1.5 flex-wrap">
                  {g.status !== 'Resolved' && (
                    <Btn size="sm" onClick={() => askAI(g)} disabled={aiLoadingId === g.id}>
                      <Sparkles className="w-3 h-3" /> {aiLoadingId === g.id ? 'Thinking...' : 'AI assist'}
                    </Btn>
                  )}
                  {g.status !== 'Resolved' && (
                    <Btn size="sm" variant="primary" onClick={() => { setResolving(g); setResponse(''); }}>
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </Btn>
                  )}
                  {g.status === 'In Progress' && (
                    <Btn size="sm" onClick={() => run(updateGrievanceRemote(g.id, { action: 'escalate' }))}><ArrowUp className="w-3 h-3" /> Escalate</Btn>
                  )}
                  {g.status === 'Resolved' && (
                    <Btn size="sm" onClick={() => run(updateGrievanceRemote(g.id, { action: 'reopen' }))}><RotateCcw className="w-3 h-3" /> Reopen</Btn>
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
                       onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateGrievanceRemote(resolving.id, { action: 'resolve', response });
                toast(`${resolving.id} resolved`);
                setResolving(null);
              } catch (err) {
                toast(err.message);
              }
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
            {ai && (
        <Modal title={`AI assist for ${ai.ticket.id}`} onClose={() => setAi(null)} wide>
          <div className="space-y-3 text-xs">
            <p className={t.faint}>
              AI suggestions only. It does not decide whether anything is true. A person must review and respond.
            </p>
            {ai.result.safety_concerns?.length > 0 && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-500">
                <b>Safety concerns, review immediately:</b>
                <ul className="list-disc pl-5 mt-1">
                  {ai.result.safety_concerns.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            )}
            <div><b className={t.strong}>Summary:</b> <span className={t.muted}>{ai.result.summary}</span></div>
            <div>
              <b className={t.strong}>Suggested category:</b> <span className={t.muted}>{ai.result.suggested_category}</span>
              {' • '}
              <b className={t.strong}>Urgency:</b> <span className={t.muted}>{ai.result.suggested_urgency}</span>
            </div>
            <AiList title="Questions to ask the student" items={ai.result.clarification_questions} t={t} />
            <AiList title="Recommended actions" items={ai.result.recommended_actions} t={t} />
            <AiList title="Privacy considerations" items={ai.result.privacy_considerations} t={t} />
            {ai.result.acknowledgement_response && (
              <div>
                <div className={`font-semibold ${t.strong}`}>Draft reply to the student</div>
                <p className={`mt-1 ${t.muted}`}>{ai.result.acknowledgement_response}</p>
                <div className="mt-2">
                  <Btn
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setResponse(ai.result.acknowledgement_response);
                      setResolving(ai.ticket);
                      setAi(null);
                    }}
                  >
                    Use as my response
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
