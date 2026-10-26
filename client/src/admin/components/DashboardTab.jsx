import React from 'react';
import { Users, Ticket, AlertCircle, Zap, Clock, IndianRupee, Briefcase, Bot } from 'lucide-react';
import { useDB, fmtDateTime } from '../../shared/store';
import { Card, Stat, Badge, PageHeader, byBadge, Empty, useT } from '../ui';

const RULES = [
  ['autoScreening', 'Auto-screening'],
  ['autoSlot', 'Slot allocation'],
  ['autoSelect', 'Auto-selection'],
  ['autoPayment', 'Payment & pass'],
  ['autoEscalation', 'SLA escalation'],
  ['autoCloseHiring', 'Auto-close hiring'],
];

export default function DashboardTab({ now }) {
  const db = useDB();
  const t = useT();

  const pendingApps = db.applications.filter((a) => a.status === 'Applied').length;
  const awaitingInterview = db.applications.filter((a) => a.status === 'Slot Booked' && a.interviewScore == null).length;
  const vacancies = db.committees.filter((c) => c.hiringOpen).reduce((n, c) => n + c.vacancies, 0);
  const pendingPay = db.payments.filter((p) => p.status === 'Pending').length;
  const revenue = db.payments.filter((p) => p.status === 'Verified').reduce((n, p) => n + p.amount, 0);
  const openG = db.grievances.filter((g) => g.status !== 'Resolved').length;
  const escalated = db.grievances.filter((g) => g.status === 'Escalated').length;
  const autoCount = db.activity.filter((a) => a.by === 'AUTO').length;
  const adminNotifs = db.notifications.filter((n) => n.to === 'ADMIN').slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Control Center"
        subtitle="Everything students do lands here. Routine decisions are handled by automation; you only handle exceptions."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Applications to review" value={pendingApps} sub={`${awaitingInterview} awaiting interview score`} icon={Users} tone="info" />
        <Stat label="Open vacancies" value={vacancies} sub={`${db.committees.filter((c) => c.hiringOpen).length} committees hiring`} icon={Briefcase} />
        <Stat label="Pending payments" value={pendingPay} sub={`₹${revenue.toLocaleString('en-IN')} collected`} icon={IndianRupee} tone="warn" />
        <Stat label="Active grievances" value={openG} sub={`${escalated} escalated`} icon={AlertCircle} tone={escalated ? 'bad' : 'good'} />
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-emerald-500" />
          <span className={`text-sm font-bold ${t.strong}`}>Automation status</span>
          <span className={`text-[11px] ${t.faint}`}>• {autoCount} automatic actions logged</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {RULES.map(([key, label]) => (
            <Badge key={key} tone={db.settings[key] ? 'good' : 'neutral'}>
              <Zap className="w-3 h-3" /> {label}: {db.settings[key] ? 'ON' : 'OFF'}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className={`px-5 py-3 border-b text-sm font-bold ${t.border} ${t.strong}`}>Live activity feed</div>
          {db.activity.length === 0 && <Empty>No activity yet.</Empty>}
          <div className={`divide-y ${t.divide} max-h-[28rem] overflow-y-auto`}>
            {db.activity.slice(0, 25).map((a) => (
              <div key={a.id} className="px-5 py-2.5 flex items-start gap-3 text-xs">
                {byBadge(a.by)}
                <div className="flex-1">
                  <span className={t.text}>{a.text}</span>
                  <div className={`text-[10px] ${t.faint}`}>{fmtDateTime(a.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className={`px-5 py-3 border-b text-sm font-bold ${t.border} ${t.strong}`}>Needs your attention</div>
          <div className={`divide-y ${t.divide}`}>
            {adminNotifs.length === 0 && <Empty>Nothing needs attention.</Empty>}
            {adminNotifs.map((n) => (
              <div key={n.id} className={`px-5 py-2.5 text-xs ${t.text}`}>
                <Clock className="w-3 h-3 inline mr-1.5 text-amber-500" />
                {n.text}
                <div className={`text-[10px] ${t.faint}`}>{fmtDateTime(n.ts)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
