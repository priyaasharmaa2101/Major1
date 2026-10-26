import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDB, actions, select } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Select, Input, Field, statusTone, Empty, useT } from '../ui';

export default function Super50AdminTab({ toast }) {
  const db = useDB();
  const t = useT();
  const ranked = select.rankedCandidates(db);
  const [add, setAdd] = useState({ rollNo: '', assessment: '', interview: '' });
  const available = db.students.filter((s) => !db.candidates.some((c) => c.rollNo === s.rollNo));

  const saveScore = (c, field, value) => {
    if (Number(value) === c[field] || value === '') return;
    actions.saveCandidate({ ...c, [field]: Number(value) });
  };

  const addCandidate = (e) => {
    e.preventDefault();
    const s = db.students.find((x) => x.rollNo === add.rollNo);
    if (!s) return;
    actions.saveCandidate({ rollNo: s.rollNo, name: s.name, branch: s.short, assessment: add.assessment, interview: add.interview });
    toast(`${s.name} added to ranking`);
    setAdd({ rollNo: '', assessment: '', interview: '' });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Super 50 Selection Engine"
        subtitle="Enter assessment and interview scores. Composite score, ranks and Confirmed / Waitlisted status are recalculated automatically and appear live on every student's leaderboard."
      />

      <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Cohort size (top N confirmed)">
          <Input type="number" min="1" defaultValue={db.settings.cohortSize} onBlur={(e) => actions.updateSettings({ cohortSize: Number(e.target.value) || 50 })} />
        </Field>
        <Field label="Assessment weight %">
          <Input type="number" min="0" max="100" defaultValue={db.settings.weightAssessment} onBlur={(e) => actions.updateSettings({ weightAssessment: Number(e.target.value) })} />
        </Field>
        <Field label="Interview weight %">
          <Input type="number" min="0" max="100" defaultValue={db.settings.weightInterview} onBlur={(e) => actions.updateSettings({ weightInterview: Number(e.target.value) })} />
        </Field>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={`text-left border-b ${t.head}`}>
              {['Rank', 'Student', 'Assessment /100', 'Interview /10', 'Composite', 'Status', ''].map((h) => <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody className={`divide-y ${t.divide}`}>
            {ranked.map((c) => (
              <tr key={`${c.rollNo}-${c.assessment}-${c.interview}`} className={t.rowHover}>
                <td className={`px-4 py-3 font-black ${t.strong}`}>#{c.rank}</td>
                <td className="px-4 py-3"><div className={`font-bold ${t.strong}`}>{c.name}</div><div className={t.faint}>{c.rollNo} • {c.branch}</div></td>
                <td className="px-4 py-3 w-32">
                  <input type="number" min="0" max="100" defaultValue={c.assessment} onBlur={(e) => saveScore(c, 'assessment', e.target.value)}
                    className={`w-24 text-xs p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input}`} />
                </td>
                <td className="px-4 py-3 w-32">
                  <input type="number" min="0" max="10" step="0.1" defaultValue={c.interview} onBlur={(e) => saveScore(c, 'interview', e.target.value)}
                    className={`w-24 text-xs p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${t.input}`} />
                </td>
                <td className="px-4 py-3 font-bold text-emerald-500">{c.composite.toFixed(1)}%</td>
                <td className="px-4 py-3"><Badge tone={statusTone[c.confirmed ? 'Confirmed' : 'Waitlisted']}>{c.confirmed ? 'Confirmed' : 'Waitlisted'}</Badge></td>
                <td className="px-4 py-3">
                  <Btn size="sm" variant="danger" onClick={() => actions.deleteCandidate(c.rollNo)}><Trash2 className="w-3 h-3" /></Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ranked.length === 0 && <Empty>No candidates yet.</Empty>}
      </Card>

      <Card className="p-4">
        <form onSubmit={addCandidate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <Field label="Add student">
            <Select required value={add.rollNo} onChange={(e) => setAdd((a) => ({ ...a, rollNo: e.target.value }))}>
              <option value="">Select student…</option>
              {available.map((s) => <option key={s.rollNo} value={s.rollNo}>{s.name} ({s.rollNo})</option>)}
            </Select>
          </Field>
          <Field label="Assessment /100"><Input type="number" min="0" max="100" required value={add.assessment} onChange={(e) => setAdd((a) => ({ ...a, assessment: e.target.value }))} /></Field>
          <Field label="Interview /10"><Input type="number" min="0" max="10" step="0.1" required value={add.interview} onChange={(e) => setAdd((a) => ({ ...a, interview: e.target.value }))} /></Field>
          <Btn type="submit" variant="primary"><Plus className="w-4 h-4" /> Add & rank</Btn>
        </form>
      </Card>
    </div>
  );
}
