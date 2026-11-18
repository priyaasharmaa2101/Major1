import React, { useState } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../../shared/api';
import { Modal, Btn, Badge, useT } from '../ui';

const STATUS_TONE = { eligible: 'good', not_eligible: 'bad', needs_review: 'warn' };
const STATUS_LABEL = { eligible: 'LOOKS ELIGIBLE', not_eligible: 'NOT ELIGIBLE', needs_review: 'NEEDS REVIEW' };

function Section({ title, items }) {
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

/**
 * Asks the AI service for a preliminary review of ONE application.
 * Privacy: the student's name, roll number and email are never sent.
 * The AI only suggests; the admin still shortlists / selects / rejects.
 */
export default function AIReviewModal({ application, student, committee, onClose }) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      const record = await api('/ai/recruitment/assess', {
        method: 'POST',
        body: {
          candidate_information: {
            cgpa: student?.cgpa ?? null,
            branch: student?.branch || null,
            hostel_resident: Boolean(student?.hostel),
            semester: student?.semester ?? null,
            application_status: application.status,
            interview_score_out_of_10: application.interviewScore ?? null,
          },
          eligibility_criteria: {
            committee: committee?.name,
            role: committee?.role,
            minimum_cgpa: committee?.minCgpa,
            required_branch: committee?.requiredBranch || 'All Branches',
            committee_description: committee?.description,
          },
        },
      });
      setResult(record.content || {});
    } catch (e) {
      setError(e.message || 'AI request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`AI review • ${committee?.name || 'Application'}`} onClose={onClose} wide>
      <div className="space-y-4">
        <p className={`text-xs ${t.muted}`}>
          Preliminary review based only on CGPA, branch, hostel status and interview score. The student's
          name and roll number are not sent to the AI.
        </p>

        {!result && (
          <Btn variant="primary" onClick={run} disabled={loading}>
            <Sparkles className="w-4 h-4" /> {loading ? 'Reviewing…' : 'Generate AI review'}
          </Btn>
        )}

        {error && <p className="text-xs text-rose-500">{error}</p>}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={STATUS_TONE[result.eligibility_status] || 'neutral'}>
                {STATUS_LABEL[result.eligibility_status] || 'REVIEW'}
              </Badge>
              <Badge tone="neutral">FINAL DECISION: PENDING (YOU DECIDE)</Badge>
            </div>
            {result.candidate_summary && <p className={`text-xs ${t.text}`}>{result.candidate_summary}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Eligibility reasons" items={result.eligibility_reasons} />
              <Section title="Strengths" items={result.strengths} />
              <Section title="Missing information" items={result.missing_information} />
              <Section title="Needs clarification" items={result.clarification_areas} />
              <Section title="Suggested interview questions" items={result.interview_questions} />
              <Section title="Assessment rubric" items={result.assessment_rubric} />
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className={`text-[11px] flex items-center gap-1.5 ${t.faint}`}>
                <AlertTriangle className="w-3 h-3" /> AI suggestion only. Verify before acting.
              </p>
              <Btn size="sm" onClick={run} disabled={loading}>
                {loading ? 'Reviewing…' : 'Regenerate'}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}