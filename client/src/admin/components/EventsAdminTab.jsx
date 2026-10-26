import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useDB, actions, fmtDateTime } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Modal, Field, Input, Select, Textarea, Empty, statusTone, byBadge, useT } from '../ui';

const blank = () => ({
  id: '', title: '', tag: 'Fiesta', date: '', venue: '', price: 100, priceUnit: '',
  seatsTotal: 100, seatsLeft: 100, description: '',
});

export default function EventsAdminTab({ toast }) {
  const db = useDB();
  const t = useT();
  const [form, setForm] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    const isNew = !form.id;
    const id = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `ev-${Date.now()}`;
    actions.saveEvent({ ...form, id, seatsLeft: isNew ? form.seatsTotal : form.seatsLeft });
    toast(`Event ${isNew ? 'created' : 'updated'}`);
    setForm(null);
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
        <Btn variant="primary" onClick={() => setForm(blank())}><Plus className="w-4 h-4" /> New event</Btn>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {db.events.map((e) => {
          const sold = e.seatsTotal - e.seatsLeft;
          const pct = e.seatsTotal ? Math.round((sold / e.seatsTotal) * 100) : 0;
          return (
            <Card key={e.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge tone="info">{e.tag}</Badge>
                <Badge tone={e.seatsLeft > 0 ? 'good' : 'bad'}>{e.seatsLeft > 0 ? `${e.seatsLeft} left` : 'SOLD OUT'}</Badge>
              </div>
              <h3 className={`font-bold ${t.strong}`}>{e.title}</h3>
              <p className={`text-xs mt-1 ${t.muted}`}>{e.date} • {e.venue}</p>
              <div className={`mt-3 h-2 rounded-full overflow-hidden ${t.d ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
              <div className={`text-[11px] mt-1 ${t.faint}`}>
                {sold}/{e.seatsTotal} booked • ₹{e.price}{e.priceUnit} • revenue ₹{(db.payments.filter((p) => p.eventId === e.id && p.status === 'Verified').reduce((n, p) => n + p.amount, 0)).toLocaleString('en-IN')}
              </div>
              <div className="flex gap-2 mt-4">
                <Btn size="sm" onClick={() => setForm({ ...e })}><Pencil className="w-3 h-3" /> Edit</Btn>
                <Btn
                  size="sm" variant="danger" className="ml-auto"
                  onClick={() => window.confirm(`Delete ${e.title}?`) && actions.deleteEvent(e.id)}
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
                      <Btn size="sm" variant="primary" onClick={() => actions.verifyPayment(p.id)}><Check className="w-3 h-3" /> Verify</Btn>
                      <Btn size="sm" onClick={() => actions.rejectPayment(p.id)}><X className="w-3 h-3" /> Reject</Btn>
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
            <Field label="Date & time (text)"><Input required placeholder="Nov 12, 2026 • 10:00 AM" value={form.date} onChange={set('date')} /></Field>
            <Field label="Venue"><Input required value={form.venue} onChange={set('venue')} /></Field>
            <Field label="Price (₹)"><Input type="number" min="0" required value={form.price} onChange={set('price')} /></Field>
            <Field label="Price unit">
              <Select value={form.priceUnit} onChange={set('priceUnit')}>
                <option value="">Per person</option>
                <option value=" / Team">Per team</option>
              </Select>
            </Field>
            <Field label={form.id ? 'Total seats' : 'Total seats (all open at start)'}>
              <Input type="number" min="1" required value={form.seatsTotal} onChange={set('seatsTotal')} />
            </Field>
            {form.id && (
              <Field label="Seats left"><Input type="number" min="0" required value={form.seatsLeft} onChange={set('seatsLeft')} /></Field>
            )}
            <div className="sm:col-span-2"><Field label="Description"><Textarea rows={3} required value={form.description} onChange={set('description')} /></Field></div>
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
