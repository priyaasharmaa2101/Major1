import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Lock, Unlock } from 'lucide-react';
import { useDB, actions, fmtDate } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Modal, Field, Input, Select, Textarea, useT } from '../ui';

const BRANCH_OPTIONS = ['All Branches', 'Hostel Residents Only', 'Computer Science', 'Electronics', 'Information Technology', 'Mechanical'];

const blank = () => ({
  id: '', name: '', tag: 'Governance', lead: '', role: '',
  deadline: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
  minCgpa: 7, requiredBranch: 'All Branches', vacancies: 5, hiringOpen: true, description: '',
});

export default function CommitteesAdminTab({ toast }) {
  const db = useDB();
  const t = useT();
  const [form, setForm] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    const id = form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `c-${Date.now()}`;
    actions.saveCommittee({ ...form, id });
    toast(`Committee ${form.id ? 'updated' : 'created'}`);
    setForm(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Committees & Hiring"
        subtitle="Create committees, set CGPA / branch cutoffs and vacancies. Hiring closes automatically on deadline or when vacancies reach zero."
      >
        <Btn variant="primary" onClick={() => setForm(blank())}><Plus className="w-4 h-4" /> New committee</Btn>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {db.committees.map((c) => {
          const apps = db.applications.filter((a) => a.committeeId === c.id);
          return (
            <Card key={c.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="info">{c.tag}</Badge>
                  <Badge tone={c.hiringOpen ? 'good' : 'bad'}>{c.hiringOpen ? 'HIRING OPEN' : 'HIRING CLOSED'}</Badge>
                </div>
                <h3 className={`font-bold text-base ${t.strong}`}>{c.name}</h3>
                <p className={`text-xs mt-1 mb-3 ${t.muted}`}>{c.description}</p>
                <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${t.inset}`}>
                  <Row k="Role" v={c.role} />
                  <Row k="Head" v={c.lead} />
                  <Row k="Min CGPA" v={c.minCgpa} />
                  <Row k="Eligibility" v={c.requiredBranch} />
                  <Row k="Vacancies" v={c.vacancies} />
                  <Row k="Deadline" v={fmtDate(Date.parse(`${c.deadline}T00:00:00`))} />
                  <Row k="Applicants" v={`${apps.length} (${apps.filter((a) => a.status === 'Selected').length} selected)`} />
                </div>
              </div>
              <div className={`pt-3 mt-4 border-t flex gap-2 ${t.border}`}>
                <Btn size="sm" onClick={() => setForm({ ...c })}><Pencil className="w-3 h-3" /> Edit</Btn>
                <Btn size="sm" onClick={() => actions.toggleHiring(c.id)}>
                  {c.hiringOpen ? <><Lock className="w-3 h-3" /> Close</> : <><Unlock className="w-3 h-3" /> Open</>}
                </Btn>
                <Btn
                  size="sm" variant="danger" className="ml-auto"
                  onClick={() => window.confirm(`Delete ${c.name} and all its applications?`) && actions.deleteCommittee(c.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>

      {form && (
        <Modal title={form.id ? 'Edit committee' : 'New committee'} onClose={() => setForm(null)} wide>
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Committee name"><Input required value={form.name} onChange={set('name')} /></Field>
            <Field label="Tag"><Input required value={form.tag} onChange={set('tag')} /></Field>
            <Field label="Current head"><Input required value={form.lead} onChange={set('lead')} /></Field>
            <Field label="Open role"><Input required value={form.role} onChange={set('role')} /></Field>
            <Field label="Min CGPA"><Input type="number" step="0.1" min="0" max="10" required value={form.minCgpa} onChange={set('minCgpa')} /></Field>
            <Field label="Vacancies"><Input type="number" min="0" required value={form.vacancies} onChange={set('vacancies')} /></Field>
            <Field label="Eligibility">
              <Select value={form.requiredBranch} onChange={set('requiredBranch')}>
                {BRANCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Application deadline"><Input type="date" required value={form.deadline} onChange={set('deadline')} /></Field>
            <div className="sm:col-span-2">
              <Field label="Description"><Textarea rows={3} required value={form.description} onChange={set('description')} /></Field>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Btn type="button" onClick={() => setForm(null)}>Cancel</Btn>
              <Btn type="submit" variant="primary">Save committee</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Row({ k, v }) {
  const t = useT();
  return (
    <div className={`flex justify-between gap-3 ${t.muted}`}>
      <span>{k}</span>
      <span className={`font-semibold text-right ${t.text}`}>{v}</span>
    </div>
  );
}
