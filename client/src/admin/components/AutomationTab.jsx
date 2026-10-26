import React, { useState } from 'react';
import { Zap, Trash2, Plus, RotateCcw, Play } from 'lucide-react';
import { useDB, actions, fmtDateTime } from '../../shared/store';
import { Card, Btn, PageHeader, Toggle, Field, Input, Badge, byBadge, useT } from '../ui';

const RULES = [
  ['autoScreening', 'Auto-screening', 'Checks CGPA, branch and hostel eligibility the moment a student applies. Pass → Shortlisted, fail → Rejected with reason.'],
  ['autoSlot', 'Interview slot allocation', 'Gives every shortlisted student the next free interview slot (no double booking, no clash for the same student).'],
  ['autoSelect', 'Auto-selection after interview', 'When you enter an interview score: ≥ threshold → Selected (vacancy −1), below → Rejected. Student is notified.'],
  ['autoPayment', 'Payment verification & pass', 'Verifies event payments and issues the QR pass instantly. Turn OFF to approve payments manually.'],
  ['autoEscalation', 'Grievance SLA escalation', 'Tickets not resolved within the SLA hours are escalated to the Chief Warden and both sides are notified.'],
  ['autoCloseHiring', 'Auto-close hiring', 'Closes a committee on its deadline or when vacancies hit zero.'],
];

export default function AutomationTab({ toast }) {
  const db = useDB();
  const t = useT();
  const s = db.settings;
  const [slot, setSlot] = useState('');

  const usage = (id) => db.applications.filter((a) => a.slotId === id && a.status !== 'Rejected').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Automation Center" subtitle="Switch rules on or off, tune thresholds and manage interview slots. Changes apply instantly to the student side.">
        <Btn onClick={() => { actions.runAutomationNow(); toast('Automation run completed'); }}><Play className="w-3.5 h-3.5" /> Run all rules now</Btn>
      </PageHeader>

      <Card className="divide-y overflow-hidden">
        {RULES.map(([key, title, desc]) => (
          <div key={key} className={`p-4 flex items-center gap-4 border-t first:border-t-0 ${t.border}`}>
            <Zap className={`w-4 h-4 shrink-0 ${s[key] ? 'text-emerald-500' : t.faint}`} />
            <div className="flex-1">
              <div className={`text-sm font-bold ${t.strong}`}>{title}</div>
              <div className={`text-xs ${t.muted}`}>{desc}</div>
            </div>
            <Toggle checked={s[key]} onChange={(v) => actions.updateSettings({ [key]: v })} />
          </div>
        ))}
      </Card>

      <Card className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Grievance SLA (hours)" hint="Applies to new tickets">
          <Input type="number" min="1" defaultValue={s.slaHours} onBlur={(e) => actions.updateSettings({ slaHours: Number(e.target.value) || 48 })} />
        </Field>
        <Field label="Selection threshold (interview score /10)" hint="Used by auto-selection">
          <Input type="number" min="0" max="10" step="0.1" defaultValue={s.selectionThreshold} onBlur={(e) => actions.updateSettings({ selectionThreshold: Number(e.target.value) })} />
        </Field>
      </Card>

      <Card className="overflow-hidden">
        <div className={`px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap ${t.border}`}>
          <span className={`text-sm font-bold ${t.strong}`}>Interview slots ({db.slots.length})</span>
          <div className="flex gap-2">
            <Btn size="sm" onClick={() => { actions.generateSlots(3); toast('Generated slots for the next 3 days'); }}><Zap className="w-3 h-3" /> Generate next 3 days</Btn>
          </div>
        </div>
        <div className={`divide-y ${t.divide}`}>
          {db.slots.map((x) => (
            <div key={x.id} className="px-5 py-2.5 flex items-center justify-between text-xs">
              <span className={t.text}>{x.label}</span>
              <div className="flex items-center gap-3">
                <Badge tone={usage(x.id) >= x.capacity ? 'bad' : 'good'}>{usage(x.id)}/{x.capacity} booked</Badge>
                <Btn size="sm" variant="danger" onClick={() => actions.deleteSlot(x.id)}><Trash2 className="w-3 h-3" /></Btn>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (slot.trim()) { actions.addSlot(slot.trim()); setSlot(''); } }}
          className={`p-4 border-t flex gap-2 ${t.border}`}
        >
          <Input placeholder="Custom slot e.g. Mon, Oct 27 • 5:00 PM - 5:20 PM" value={slot} onChange={(e) => setSlot(e.target.value)} />
          <Btn type="submit" variant="primary"><Plus className="w-4 h-4" /> Add</Btn>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className={`px-5 py-3 border-b text-sm font-bold ${t.border} ${t.strong}`}>Recent automation log</div>
        <div className={`divide-y ${t.divide} max-h-80 overflow-y-auto`}>
          {db.activity.slice(0, 40).map((a) => (
            <div key={a.id} className="px-5 py-2 flex items-start gap-3 text-xs">
              {byBadge(a.by)}
              <span className={`flex-1 ${t.text}`}>{a.text}</span>
              <span className={`text-[10px] ${t.faint}`}>{fmtDateTime(a.ts)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between gap-3">
        <div>
          <div className={`text-sm font-bold ${t.strong}`}>Reset demo data</div>
          <div className={`text-xs ${t.muted}`}>Restores the original sample students, committees, events and tickets.</div>
        </div>
        <Btn variant="danger" onClick={() => window.confirm('Reset ALL data to the sample set?') && (actions.resetDemoData(), toast('Demo data reset'))}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </Btn>
      </Card>
    </div>
  );
}
