import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Sparkles } from 'lucide-react';
import { useDB, actions, fmtDateTime } from '../../shared/store';
import { api } from '../../shared/api';
import { saveEventRemote, deleteEventRemote, verifyPaymentRemote, rejectPaymentRemote } from '../../shared/eventService';
import { Card, Badge, Btn, PageHeader, Modal, Field, Input, Select, Textarea, Empty, statusTone, byBadge, useT } from '../ui';
import { toInputValue, nowLocal, formatEventDate } from '../../shared/dateUtils';
const blank = () => ({
  id: '', title: '', tag: 'Fiesta', date: '', venue: '', price: 100, priceUnit: '',entry: 'paid',
  seatsTotal: 100, seatsLeft: 100, description: '',
});

export default function EventsAdminTab({ toast }) {
  const db = useDB();
  const t = useT();
  const [form, setForm] = useState(null);
    const [aiBusy, setAiBusy] = useState(false);

  const fillWithAI = async () => {
    if (!form.title.trim()) return toast('Type the event title first');
    setAiBusy(true);
    try {
      const res = await api('/ai/events/plan', {
        method: 'POST',
        body: JSON.stringify({
          event_name: form.title,
          event_type: form.tag || 'College event',
          event_objective: form.description || `Organise "${form.title}" for college students`,
          venue: form.venue || undefined,
          date: form.date || undefined,
        }),
      });
      const plan = res?.data ?? res?.plan ?? res;
      if (!plan?.description) return toast('AI returned no description');
      setForm((f) => ({ ...f, description: plan.description }));
      toast('Description written by AI. Review it before saving.');
    } catch (err) {
      toast(err.message || 'AI is not available right now');
    } finally {
      setAiBusy(false);
    }
  };
    const [aiPlan, setAiPlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const aiFill = async () => {
    if (!form.title.trim()) {
      toast('Type the event name first.');
      return;
    }
    setAiLoading(true);
    try {
      const record = await api('/ai/events/plan', {
        method: 'POST',
        body: {
          event_name: form.title.trim(),
          event_type: (form.tag || '').trim() || 'General',
          event_objective: form.description.trim() || form.title.trim(),
          event_date: form.date,
          venue: form.venue,
          expected_seats: form.seatsTotal,
        },
      });
      const plan = record.content || {};
      setAiPlan(plan);
      setForm((f) => ({ ...f, description: plan.description || f.description }));
      toast('AI draft applied. Please review before saving.');
    } catch (e) {
      toast(e.message || 'AI request failed.');
    } finally {
      setAiLoading(false);
    }
  };
     const save = async (e) => {
    e.preventDefault();
    const id =
      form.id ||
      form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `c-${Date.now()}`;

    const prevCommittee = db.committees.find((x) => x.id === id);
    const prevEmails = new Set((prevCommittee?.collaborators || []).map((x) => x.email.toLowerCase()));
    const newlyInvited = (form.collaborators || []).filter(
      (col) => col.status === 'Pending' && !prevEmails.has(col.email.toLowerCase())
    );

    try {
      const saved = await saveCommitteeRemote({
        ...form,
        id,
        createdBy: form.createdBy || adminProfile?.email || '',
        collaborators: form.collaborators || [],
      });
      const realId = saved?.id || id;
      const failed = [];
      for (const col of newlyInvited) {
        try { await inviteCollaboratorRemote(realId, col); }
        catch (err) { failed.push(`${col.email}: ${err.message}`); }
      }
      await loadCommittees();
      toast(
        failed.length
          ? `Saved, but invite failed. ${failed[0]}`
          : `Committee ${form.id ? 'updated' : 'created'}${newlyInvited.length ? ` • ${newlyInvited.length} invite(s) sent` : ''}`
      );
      setForm(null);
      setInviteEmail('');
      setInviteName('');
    } catch (err) {
      toast(err.message);
    }
  };

  const pending = db.payments.filter((p) => p.status === 'Pending');
  const history = db.payments.filter((p) => p.status !== 'Pending');
  const eventName = (id) => db.events.find((e) => e.id === id)?.title || id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events, Payments & Passes"
        subtitle="With auto-payment ON every payment is verified and the QR pass is issued instantly. Turn it OFF in Automation to approve manually."
      >
        <Btn variant="primary" onClick={() => { setAiPlan(null); setForm(blank()); }}><Plus className="w-4 h-4" /> New event</Btn>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {db.events.map((e) => {
          const sold = e.seatsTotal - e.seatsLeft;
          const pct = e.seatsTotal ? Math.round((sold / e.seatsTotal) * 100) : 0;
          const rev = db.payments.filter((p) => p.eventId === e.id && p.status === 'Verified').reduce((n, p) => n + p.amount, 0);
          return (
            <Card key={e.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge tone="info">{e.tag}</Badge>
                <Badge tone={e.seatsLeft > 0 ? 'good' : 'bad'}>{e.seatsLeft > 0 ? `${e.seatsLeft} left` : 'SOLD OUT'}</Badge>
              </div>
              <h3 className={`font-bold ${t.strong}`}>{e.title}</h3>
              <p className={`text-xs mt-1 ${t.muted}`}>{formatEventDate(e.date)} • {e.venue}</p>
              <div className={`mt-3 h-2 rounded-full overflow-hidden ${t.d ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
              <div className={`text-[11px] mt-1 ${t.faint}`}>
                {sold}/{e.seatsTotal} booked • {e.price === 0 ? 'Free' : `₹${e.price}${e.priceUnit}`} • revenue ₹{rev.toLocaleString('en-IN')}
              </div>
              <div className="flex gap-2 mt-4">
               <Btn size="sm" disabled={!e.canManage} onClick={() => { setAiPlan(null); setForm({ ...e, entry: Number(e.price) === 0 ? 'free' : 'paid' }); }}><Pencil className="w-3 h-3" /> Edit</Btn>
                <Btn
                 size="sm" variant="danger" className="ml-auto" disabled={!e.canManage}
                  onClick={() => window.confirm(`Delete ${e.title}?`) && deleteEventRemote(e.id).catch((err) => toast(err.message))}
                ><Trash2 className="w-3 h-3" /></Btn>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-x-auto">
        <div className={`px-5 py-3 border-b text-sm font-bold flex items-center gap-2 ${t.border} ${t.strong}`}>
          Payment queue {pending.length > 0 && <Badge tone="warn">{pending.length} pending</Badge>}
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className={`text-left border-b ${t.head}`}>
              {['Student', 'Event', 'Amount', 'Time', 'Status', ''].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className={`divide-y ${t.divide}`}>
            {[...pending, ...history].slice(0, 30).map((p) => (
              <tr key={p.id} className={t.rowHover}>
                <td className="px-4 py-3"><div className={`font-bold ${t.strong}`}>{p.name}</div><div className={t.faint}>{p.rollNo}</div></td>
                <td className={`px-4 py-3 ${t.text}`}>{eventName(p.eventId)}</td>
                <td className={`px-4 py-3 font-semibold ${t.strong}`}>₹{p.amount}</td>
                <td className={`px-4 py-3 ${t.muted}`}>{fmtDateTime(p.createdAt)}</td>
                <td className="px-4 py-3"><Badge tone={statusTone[p.status] || 'bad'}>{p.status}</Badge> {p.by && byBadge(p.by)}</td>
                <td className="px-4 py-3">
                  {p.status === 'Pending' && (
                    <div className="flex gap-1.5">
                     <Btn size="sm" variant="primary" disabled={!p.canManage} onClick={() => verifyPaymentRemote(p.id).catch((err) => toast(err.message))}
                        ><Check className="w-3 h-3" /> Verify</Btn>
                      <Btn size="sm" disabled={!p.canManage} onClick={() => rejectPaymentRemote(p.id).catch((err) => toast(err.message))}
                        ><X className="w-3 h-3" /> Reject</Btn>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {db.payments.length === 0 && <Empty>No payments yet.</Empty>}
      </Card>

      <Card className="overflow-x-auto">
        <div className={`px-5 py-3 border-b text-sm font-bold ${t.border} ${t.strong}`}>Issued passes ({db.passes.length})</div>
        <table className="w-full text-xs">
          <thead>
            <tr className={`text-left border-b ${t.head}`}>
              {['Pass ID', 'Student', 'Event', 'Price'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className={`divide-y ${t.divide}`}>
            {db.passes.slice(0, 30).map((p) => (
              <tr key={p.id} className={t.rowHover}>
                <td className="px-4 py-3 font-mono font-semibold text-emerald-500">{p.passId}</td>
                <td className={`px-4 py-3 ${t.text}`}>{p.userName} <span className={t.faint}>({p.rollNo})</span></td>
                <td className={`px-4 py-3 ${t.muted}`}>{p.eventTitle}</td>
                <td className={`px-4 py-3 ${t.strong}`}>{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {db.passes.length === 0 && <Empty>No passes issued.</Empty>}
      </Card>

      {form && (
        <Modal title={form.id ? 'Edit event' : 'New event'} onClose={() => setForm(null)} wide>
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Field label="Title"><Input required value={form.title} onChange={set('title')} /></Field></div>
            <Field label="Tag"><Input required value={form.tag} onChange={set('tag')} /></Field>
            <Field label="Event date">
  <Input
    type="date" required
    min={form.id ? undefined : nowLocal().slice(0, 10)}
    style={{ colorScheme: t.d ? 'dark' : 'light' }}
    value={toInputValue(form.date).slice(0, 10)}
    onChange={(e) => {
      const d = e.target.value;
      setForm((f) => ({ ...f, date: d ? `${d}T${toInputValue(f.date).slice(11, 16) || '10:00'}` : '' }));
    }}
  />
</Field>
<Field label="Start time">
  <Input
    type="time" required
    style={{ colorScheme: t.d ? 'dark' : 'light' }}
    value={toInputValue(form.date).slice(11, 16)}
    onChange={(e) => {
      const tm = e.target.value || '10:00';
      setForm((f) => ({ ...f, date: `${toInputValue(f.date).slice(0, 10) || nowLocal().slice(0, 10)}T${tm}` }));
    }}
  />
</Field>
            <Field label="Entry type">
              <Select
                value={form.entry}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({ ...f, entry: v, price: v === 'free' ? 0 : (Number(f.price) || 100) }));
                }}
              >
                <option value="paid">Paid (students pay)</option>
                <option value="free">Free (just register)</option>
              </Select>
            </Field>
            {form.entry === 'paid' && (
              <>
                <Field label="Price (₹)"><Input type="number" min="1" required value={form.price} onChange={set('price')} /></Field>
                <Field label="Price unit">
                  <Select value={form.priceUnit} onChange={set('priceUnit')}>
                    <option value="">Per person</option>
                    <option value=" / Team">Per team</option>
                  </Select>
                </Field>
              </>
            )}
            <Field label={form.id ? 'Total seats' : 'Total seats (all open at start)'}>
              <Input type="number" min="1" required value={form.seatsTotal} onChange={set('seatsTotal')} />
            </Field>
            {form.id && (
              <Field label="Seats left"><Input type="number" min="0" required value={form.seatsLeft} onChange={set('seatsLeft')} /></Field>
            )}
            <div className="sm:col-span-2 flex justify-end">
  <Btn type="button" size="sm" onClick={fillWithAI} disabled={aiBusy}>
    <Sparkles className="w-3 h-3" /> {aiBusy ? 'AI is writing...' : 'Fill with AI'}
  </Btn>
</div>
            <div className="sm:col-span-2"><Field label="Description"><Textarea rows={3} required value={form.description} onChange={set('description')} /></Field></div>
                        <div className="sm:col-span-2">
              <Btn type="button" onClick={aiFill} disabled={aiLoading}>
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? 'Generating...' : 'Generate plan with AI'}
              </Btn>
            </div>

            {aiPlan && (
              <div className="sm:col-span-2">
                <details open className={`rounded-xl border p-3 text-xs ${t.border}`}>
                  <summary className={`font-bold cursor-pointer ${t.strong}`}>AI event plan (draft, for your reference)</summary>
                  {[
                    ['Objectives', aiPlan.objectives],
                    ['Agenda', aiPlan.agenda],
                    ['Preparation timeline', aiPlan.preparation_timeline],
                    ['Resources needed', aiPlan.resource_requirements],
                    ['Risks', aiPlan.potential_risks],
                    ['Backup plans', aiPlan.backup_plans],
                    ['Registration fields', aiPlan.registration_fields],
                    ['Post-event tasks', aiPlan.post_event_tasks],
                  ].map(([label, items]) => items?.length > 0 && (
                    <div key={label} className="mt-3">
                      <div className={`font-semibold ${t.strong}`}>{label}</div>
                      <ul className={`list-disc pl-5 mt-1 space-y-0.5 ${t.muted}`}>
                        {items.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  ))}
                  {aiPlan.tasks?.length > 0 && (
                    <div className="mt-3">
                      <div className={`font-semibold ${t.strong}`}>Tasks</div>
                      <ul className={`list-disc pl-5 mt-1 space-y-0.5 ${t.muted}`}>
                        {aiPlan.tasks.map((x, i) => <li key={i}>{x.task} — {x.responsible_role} ({x.suggested_deadline})</li>)}
                      </ul>
                    </div>
                  )}
                  {aiPlan.promotional_content && (
                    <div className="mt-3">
                      <div className={`font-semibold ${t.strong}`}>Promotional text</div>
                      <p className={`mt-1 ${t.muted}`}>{aiPlan.promotional_content}</p>
                    </div>
                  )}
                </details>
              </div>
            )}
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Btn type="button" onClick={() => setForm(null)}>Cancel</Btn>
              <Btn type="submit" variant="primary">Save event</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}