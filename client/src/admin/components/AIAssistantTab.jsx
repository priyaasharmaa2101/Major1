import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, Trash2, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '../../shared/api';
import { useDB } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Field, Textarea, Empty, useT } from '../ui';

const PRIORITY_TONE = { high: 'bad', medium: 'warn', low: 'info' };

const QUICK_PROMPTS = [
  'Which parts of our recruitment workflow could be automated further?',
  'Suggest how we should handle a spike in grievances this week.',
  'Help me plan admin tasks for the coming week.',
  'What risks should we watch for before the next hiring deadline?',
];

function List({ title, items }) {
  const t = useT();
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${t.muted}`}>{title}</p>
      <ul className={`space-y-1 text-xs ${t.text}`}>
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className={t.faint}>•</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultCard({ record, onApprove, onDelete, busy }) {
  const t = useT();
  const c = record.content || {};
  const isDraft = record.status === 'draft';
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className={`text-sm font-semibold ${t.strong}`}>{c.request_summary || 'AI suggestion'}</p>
          <p className={`text-[11px] mt-0.5 ${t.faint}`}>
            {new Date(record.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={isDraft ? 'warn' : 'good'}>{isDraft ? 'DRAFT' : 'REVIEWED'}</Badge>
          {isDraft && (
            <Btn size="sm" variant="primary" disabled={busy} onClick={() => onApprove(record.id)}>
              <Check className="w-3.5 h-3.5" /> Mark reviewed
            </Btn>
          )}
          <Btn size="sm" disabled={busy} onClick={() => onDelete(record.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Btn>
        </div>
      </div>

      {c.recommendations?.length > 0 && (
        <div className="space-y-2.5">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Recommendations</p>
          {c.recommendations.map((r, i) => (
            <div key={i} className={`rounded-xl border p-3 ${t.inset}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={`text-xs font-semibold ${t.strong}`}>{r.recommendation}</p>
                <Badge tone={PRIORITY_TONE[r.priority] || 'neutral'}>{(r.priority || '').toUpperCase()}</Badge>
              </div>
              <p className={`text-xs ${t.muted}`}>{r.reason}</p>
              <p className={`text-xs mt-1.5 ${t.text}`}>
                <span className="font-semibold">Suggested action: </span>
                {r.suggested_action}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <List title="Repetitive tasks" items={c.repetitive_tasks} />
        <List title="Automation opportunities" items={c.automation_opportunities} />
        <List title="Workflow improvements" items={c.workflow_improvements} />
        <List title="Missing information" items={c.missing_information} />
        <List title="Potential risks" items={c.potential_risks} />
      </div>

      <p className={`text-[11px] flex items-center gap-1.5 ${t.faint}`}>
        <AlertTriangle className="w-3 h-3" />
        AI suggestions only. Nothing here has been carried out. Review before acting.
      </p>
    </Card>
  );
}

export default function AIAssistantTab({ toast }) {
  const db = useDB();
  const t = useT();
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [records, setRecords] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    setListLoading(true);
    try {
      const list = await api('/ai/admin_assistant/drafts');
      setRecords([...list].reverse());
    } catch (e) {
      toast(e.message || 'Could not load AI history.');
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Counts only. No student names, roll numbers or grievance text are sent.
  const snapshot = () => ({
    committees: db.committees.length,
    open_hiring_committees: db.committees.filter((c) => c.hiringOpen).length,
    applications_total: db.applications.length,
    applications_pending_review: db.applications.filter((a) => a.status === 'Applied').length,
    interview_slots: db.slots.length,
    events: db.events.length,
    payments_pending: db.payments.filter((p) => p.status === 'Pending').length,
    grievances_open: db.grievances.filter((g) => g.status !== 'Resolved').length,
  });

  const ask = async () => {
    if (!request.trim()) {
      toast('Type a request first.');
      return;
    }
    setLoading(true);
    try {
      await api('/ai/admin-assistant/assist', {
        method: 'POST',
        body: { administrator_request: request.trim(), platform_snapshot: snapshot() },
      });
      setRequest('');
      await loadRecords();
      toast('AI suggestion ready. Please review it.');
    } catch (e) {
      toast(e.message || 'AI request failed.');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    setBusy(true);
    try {
      await api(`/ai/admin_assistant/drafts/${id}/approve`, { method: 'POST' });
      await loadRecords();
    } catch (e) {
      toast(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    setBusy(true);
    try {
      await api(`/ai/admin_assistant/drafts/${id}`, { method: 'DELETE' });
      await loadRecords();
    } catch (e) {
      toast(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask for recommendations, workflow ideas and risk checks. The AI only suggests. You decide and act."
      />

      <Card className="p-5 space-y-3">
        <Field label="What do you need help with?">
          <Textarea
            rows={3}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="e.g. Suggest how to reduce manual work during interview week"
          />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRequest(p)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition ${t.border} ${t.muted} ${t.rowHover}`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="primary" onClick={ask} disabled={loading}>
            <Sparkles className="w-4 h-4" /> {loading ? 'Thinking…' : 'Ask AI'}
          </Btn>
          <Btn onClick={loadRecords} disabled={listLoading}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Btn>
        </div>
      </Card>

      <div className="space-y-4">
        {records.map((r) => (
          <ResultCard key={r.id} record={r} busy={busy} onApprove={approve} onDelete={remove} />
        ))}
        {!listLoading && records.length === 0 && <Empty>No AI suggestions yet. Ask something above.</Empty>}
      </div>
    </div>
  );
}