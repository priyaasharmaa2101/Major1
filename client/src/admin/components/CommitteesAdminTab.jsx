// import React, { useState } from 'react';
// import { Plus, Pencil, Trash2, Lock, Unlock, ShieldAlert, UserPlus, Check, X, Users, Sparkles } from 'lucide-react';
// import { api } from '../../shared/api';
// import { useDB, actions, getDB, fmtDate } from '../../shared/store';
// import { Card, Badge, Btn, PageHeader, Modal, Field, Input, Select, Textarea, useT } from '../ui';
// import {
//   saveCommitteeRemote, toggleHiringRemote, deleteCommitteeRemote, loadCommittees,
//   inviteCollaboratorRemote, removeCollaboratorRemote, respondInviteRemote,
// } from '../../shared/committeeService';
// const BRANCH_OPTIONS = ['All Branches', 'Hostel Residents Only', 'Computer Science', 'Electronics', 'Information Technology', 'Mechanical'];

// const blank = (adminProfile) => ({
//   id: '',
//   name: '',
//   tag: 'Governance',
//   lead: adminProfile?.name || '',
//   createdBy: adminProfile?.email || '',
//   collaborators: [],
//   role: '',
//   deadline: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
//   minCgpa: 7,
//   requiredBranch: 'All Branches',
//   vacancies: 5,
//   hiringOpen: true,
//   description: '',
// });

// export default function CommitteesAdminTab({ toast, adminProfile }) {
//   const db = useDB();
//   const t = useT();
//   const [form, setForm] = useState(null);
//     const [aiBusy, setAiBusy] = useState(false);

//   const fillWithAI = async () => {
//     if (!form.title.trim()) return toast('Type the event title first');
//     setAiBusy(true);
//     try {
//       const res = await api('/ai/events/plan', {
//         method: 'POST',
//         body: JSON.stringify({
//           event_name: form.title,
//           event_type: form.tag || 'College event',
//           event_objective: form.description || `Organise "${form.title}" for college students`,
//           venue: form.venue || undefined,
//           date: form.date || undefined,
//         }),
//       });
//       const plan = res?.data ?? res?.plan ?? res;
//       if (!plan?.description) return toast('AI returned no description');
//       setForm((f) => ({ ...f, description: plan.description }));
//       toast('Description written by AI. Review it before saving.');
//     } catch (err) {
//       toast(err.message || 'AI is not available right now');
//     } finally {
//       setAiBusy(false);
//     }
//   };
//     const [aiPlan, setAiPlan] = useState(null);
  
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [inviteName, setInviteName] = useState('');
//     const [aiLoading, setAiLoading] = useState(false);
//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const myEmail = (adminProfile?.email || '').trim().toLowerCase();
//   const myName = (adminProfile?.name || '').trim().toLowerCase();

//   const isPrimaryOwner = (c) => {
//     if (!c || !adminProfile) return false;
//     if (c.createdBy && myEmail) {
//       return c.createdBy.toLowerCase() === myEmail;
//     }
//     const leadName = (c.lead || '').toLowerCase();
//     return Boolean(myName && leadName.includes(myName));
//   };

//   const isAcceptedContributor = (c) => {
//     const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
//     return list.some(
//       (col) =>
//         col.status === 'Accepted' &&
//         ((myEmail && col.email?.toLowerCase() === myEmail) ||
//           (myName && col.name?.toLowerCase() === myName))
//     );
//   };

//   const getMyPendingInvite = (c) => {
//     const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
//     return list.find(
//       (col) =>
//         col.status === 'Pending' &&
//         ((myEmail && col.email?.toLowerCase() === myEmail) ||
//           (myName && col.name?.toLowerCase() === myName))
//     );
//   };

//   const addCollaboratorInvite = () => {
//     const email = inviteEmail.trim().toLowerCase();
//     const name = inviteName.trim() || email.split('@')[0];
//     if (!email) return;

//     if (email === myEmail) {
//       toast('You are already the committee lead.');
//       return;
//     }

//     const existing = Array.isArray(form.collaborators) ? form.collaborators : [];
//     if (existing.some((x) => x.email.toLowerCase() === email)) {
//       toast('An invitation has already been sent to this admin.');
//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       collaborators: [...existing, { email, name, status: 'Pending', invitedBy: adminProfile?.name || 'Committee Lead' }],
//     }));
//     setInviteEmail('');
//     setInviteName('');
//     toast(`Request added for ${name}`);
//   };

//     const removeCollaborator = async (email) => {
//     const alreadySaved = form.id && db.committees.find((x) => x.id === form.id)?.collaborators?.some((x) => x.email.toLowerCase() === email.toLowerCase());
//     if (alreadySaved) {
//       try {
//         await removeCollaboratorRemote(form.id, email);
//         await loadCommittees();
//       } catch (err) {
//         return toast(err.message);
//       }
//     }
//     setForm((prev) => ({
//       ...prev,
//       collaborators: (prev.collaborators || []).filter((x) => x.email.toLowerCase() !== email.toLowerCase()),
//     }));
//   };

//     const respondToInvite = async (c, accept) => {
//     try {
//       await respondInviteRemote(c.id, accept);
//       await loadCommittees();
//       toast(accept ? `Accepted! You are now a Co-Admin of ${c.name}.` : `Rejected invitation for ${c.name}.`);
//     } catch (err) {
//       toast(err.message);
//     }
//   };
//     const AI_CATEGORIES = ['Core Committee', 'Technical', 'Non-Technical', 'Sports', 'Cultural', 'Other'];

//   const aiFill = async () => {
//     if (!form.name.trim()) {
//       toast('Type the committee name first.');
//       return;
//     }
//     setAiLoading(true);
//     try {
//       const record = await api('/ai/committees/generate', {
//         method: 'POST',
//         body: {
//           name: form.name.trim(),
//           category: AI_CATEGORIES.includes(form.tag) ? form.tag : 'Other',
//           purpose: form.description.trim() || form.name.trim(),
//         },
//       });
//       const ai = record.content || {};
//       const firstRole = ai.roles?.[0];
//       setForm((f) => ({
//         ...f,
//         description: ai.description || f.description,
//         role: f.role || firstRole?.name || '',
//         vacancies: firstRole?.capacity ?? f.vacancies,
//       }));
//       toast('AI draft applied. Please review before saving.');
//     } catch (e) {
//       toast(e.message || 'AI request failed.');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const save = (e) => {
//     e.preventDefault();
//     const id =
//       form.id ||
//       form.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/^-|-$/g, '') ||
//       `c-${Date.now()}`;

//     const prevCommittee = db.committees.find((x) => x.id === id);
//     const prevEmails = new Set((prevCommittee?.collaborators || []).map((x) => x.email.toLowerCase()));
//     const newlyInvited = (form.collaborators || []).filter(
//       (col) => col.status === 'Pending' && !prevEmails.has(col.email.toLowerCase())
//     );

//     saveCommitteeRemote({
//       ...form,
//       id,
//       createdBy: form.createdBy || adminProfile?.email || '',
//       collaborators: form.collaborators || [],
//     }).catch((e) => toast(e.message))

//     // Record notification entries in the shared store for newly invited admins
//     if (newlyInvited.length > 0) {
//       const store = getDB();
//       newlyInvited.forEach((col) => {
//         store.notifications.unshift({
//           id: `notif-inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
//           to: 'ADMIN',
//           targetEmail: col.email.toLowerCase(),
//           targetName: col.name.toLowerCase(),
//           committeeId: id,
//           type: 'COMMITTEE_INVITE',
//           text: `${adminProfile?.name || form.lead} invited ${col.name} (${col.email}) to join ${form.name}.`,
//           tone: 'info',
//           read: false,
//           ts: Date.now(),
//         });
//       });
//     }

//     toast(`Committee ${form.id ? 'updated' : 'created'}${newlyInvited.length ? ` • ${newlyInvited.length} invite(s) sent` : ''}`);
//     setForm(null);
//     setInviteEmail('');
//     setInviteName('');
//   };

//   return (
//     <div className="space-y-5">
//       <PageHeader
//         title="Committees & Hiring"
//         subtitle="Create committees, invite faculty or co-admins to collaborate, and manage recruitment for committees you lead or contribute to."
//       >
//         <Btn
//           variant="primary"
//           onClick={() => {
//             setInviteEmail('');
//             setInviteName('');
//             setForm(blank(adminProfile));
//           }}
//         >
//           <Plus className="w-4 h-4" /> New committee
//         </Btn>
//       </PageHeader>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//         {db.committees.map((c) => {
//           const apps = db.applications.filter((a) => a.committeeId === c.id);
//           const owner = isPrimaryOwner(c);
//           const contributor = isAcceptedContributor(c);
//           const canManage = owner || contributor;
//           const pendingInvite = getMyPendingInvite(c);
//           const acceptedCollabs = (c.collaborators || []).filter((x) => x.status === 'Accepted');
//           const pendingCollabs = (c.collaborators || []).filter((x) => x.status === 'Pending');

//           return (
//             <Card key={c.id} className={`p-5 flex flex-col justify-between ${!canManage && !pendingInvite ? 'opacity-80' : ''}`}>
//               <div>
//                 <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
//                   <Badge tone="info">{c.tag}</Badge>
//                   <div className="flex items-center gap-1.5 flex-wrap">
//                     {owner && <Badge tone="good">LEAD</Badge>}
//                     {!owner && contributor && <Badge tone="info">CO-ADMIN</Badge>}
//                     {pendingInvite && <Badge tone="warn">INVITED</Badge>}
//                     <Badge tone={c.hiringOpen ? 'good' : 'bad'}>{c.hiringOpen ? 'HIRING OPEN' : 'HIRING CLOSED'}</Badge>
//                   </div>
//                 </div>

//                 {pendingInvite && (
//                   <div className={`mb-3 p-3 rounded-xl border text-xs space-y-2 ${
//                     t.d ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
//                   }`}>
//                     <div className="font-semibold">
//                       You are invited by <b>{c.lead}</b> to join this committee.
//                     </div>
//                     <div className="flex gap-2">
//                       <Btn size="sm" variant="primary" onClick={() => respondToInvite(c, true)}>
//                         <Check className="w-3 h-3" /> Accept
//                       </Btn>
//                       <Btn size="sm" onClick={() => respondToInvite(c, false)}>
//                         <X className="w-3 h-3" /> Reject
//                       </Btn>
//                     </div>
//                   </div>
//                 )}

//                 <h3 className={`font-bold text-base ${t.strong}`}>{c.name}</h3>
//                 <p className={`text-xs mt-1 mb-3 ${t.muted}`}>{c.description}</p>

//                 <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${t.inset}`}>
//                   <Row k="Role" v={c.role} />
//                   <Row k="Lead" v={c.lead} />
//                   {acceptedCollabs.length > 0 && (
//                     <Row k="Co-Admins" v={acceptedCollabs.map((x) => x.name).join(', ')} />
//                   )}
//                   {owner && pendingCollabs.length > 0 && (
//                     <Row k="Pending Invites" v={pendingCollabs.map((x) => x.email).join(', ')} />
//                   )}
//                   <Row k="Min CGPA" v={c.minCgpa} />
//                   <Row k="Eligibility" v={c.requiredBranch} />
//                   <Row k="Vacancies" v={c.vacancies} />
//                   <Row k="Deadline" v={fmtDate(Date.parse(`${c.deadline}T00:00:00`))} />
//                   <Row k="Applicants" v={`${apps.length} (${apps.filter((a) => a.status === 'Selected').length} selected)`} />
//                 </div>
//               </div>

//               {canManage ? (
//                 <div className={`pt-3 mt-4 border-t flex gap-2 ${t.border}`}>
//                   <Btn
//                     size="sm"
//                     onClick={() => {
//                       setInviteEmail('');
//                       setInviteName('');
//                       setForm({ ...c, collaborators: c.collaborators || [] });
//                     }}
//                   >
//                     <Pencil className="w-3 h-3" /> Edit
//                   </Btn>
//                   <Btn size="sm" onClick={() => toggleHiringRemote(c).catch((e) => toast(e.message))}>
//                     {c.hiringOpen ? <><Lock className="w-3 h-3" /> Close</> : <><Unlock className="w-3 h-3" /> Open</>}
//                   </Btn>
//                   {owner && (
//                     <Btn
//                       size="sm"
//                       variant="danger"
//                       className="ml-auto"
                      
//                       onClick={() => window.confirm(`Delete ${c.name} and all its applications?`) && deleteCommitteeRemote(c.id).catch((e) => toast(e.message))}
                      
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Btn>
//                   )}
//                 </div>
//               ) : (
//                 <div className={`pt-3 mt-4 border-t flex items-center gap-2 text-[11px] ${t.border} ${t.faint}`}>
//                   <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
//                   <span>Read-only • Managed by <b className={t.muted}>{c.lead}</b></span>
//                 </div>
//               )}
//             </Card>
//           );
//         })}
//       </div>

//       {form && (
//         <Modal title={form.id ? 'Edit committee' : 'New committee'} onClose={() => setForm(null)} wide>
//           <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Committee name"><Input required value={form.name} onChange={set('name')} /></Field>
//             <Field label="Tag"><Input required value={form.tag} onChange={set('tag')} /></Field>
//             <Field label="Committee lead"><Input required value={form.lead} onChange={set('lead')} /></Field>
//             <Field label="Open role"><Input required value={form.role} onChange={set('role')} /></Field>
//             <Field label="Min CGPA"><Input type="number" step="0.1" min="0" max="10" required value={form.minCgpa} onChange={set('minCgpa')} /></Field>
//             <Field label="Vacancies"><Input type="number" min="0" required value={form.vacancies} onChange={set('vacancies')} /></Field>
//             <Field label="Eligibility">
//               <Select value={form.requiredBranch} onChange={set('requiredBranch')}>
//                 {BRANCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
//               </Select>
//             </Field>
//             <Field label="Application deadline"><Input type="date" required value={form.deadline} onChange={set('deadline')} /></Field>

//             <div className="sm:col-span-2">
//               <Field label="Description"><Textarea rows={2} required value={form.description} onChange={set('description')} /></Field>
//             </div>
//                         <div className="sm:col-span-2">
//               <Btn type="button" onClick={aiFill} disabled={aiLoading}>
//                 <Sparkles className="w-3.5 h-3.5" />
//                 {aiLoading ? 'Generating...' : 'Generate with AI'}
//               </Btn>
//             </div>

//             <div className={`sm:col-span-2 p-3.5 rounded-xl border space-y-3 ${t.inset}`}>
//               <div className="flex items-center justify-between">
//                 <span className={`text-xs font-bold flex items-center gap-1.5 ${t.strong}`}>
//                   <Users className="w-3.5 h-3.5 text-emerald-500" /> Invite Faculty / Admin to Contribute
//                 </span>
//                 <span className={`text-[10px] ${t.faint}`}>Recipient gets a notification with Accept / Reject</span>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
//                 <div className="sm:col-span-2">
//                   <Input
//                     placeholder="Faculty / Admin Name"
//                     value={inviteName}
//                     onChange={(e) => setInviteName(e.target.value)}
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <Input
//                     type="email"
//                     placeholder="faculty@college.edu"
//                     value={inviteEmail}
//                     onChange={(e) => setInviteEmail(e.target.value)}
//                   />
//                 </div>
//                 <Btn type="button" onClick={addCollaboratorInvite} className="w-full">
//                   <UserPlus className="w-3.5 h-3.5" /> Request
//                 </Btn>
//               </div>

//               {(form.collaborators || []).length > 0 && (
//                 <div className="flex flex-wrap gap-2 pt-1">
//                   {form.collaborators.map((col) => (
//                     <span
//                       key={col.email}
//                       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border ${
//                         t.d ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
//                       }`}
//                     >
//                       <b>{col.name}</b>
//                       <span className={t.faint}>({col.email})</span>
//                       <Badge tone={col.status === 'Accepted' ? 'good' : 'warn'}>{col.status}</Badge>
//                       <button
//                         type="button"
//                         onClick={() => removeCollaborator(col.email)}
//                         className="ml-1 text-rose-500 hover:opacity-75"
//                         aria-label="Remove collaborator"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
//               <Btn type="button" onClick={() => setForm(null)}>Cancel</Btn>
//               <Btn type="submit" variant="primary">Save committee</Btn>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function Row({ k, v }) {
//   const t = useT();
//   return (
//     <div className={`flex justify-between gap-3 ${t.muted}`}>
//       <span>{k}</span>
//       <span className={`font-semibold text-right ${t.text}`}>{v}</span>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Lock, Unlock, ShieldAlert, UserPlus, Check, X, Users, Sparkles } from 'lucide-react';
import { api } from '../../shared/api';
import { useDB, actions, getDB, fmtDate } from '../../shared/store';
import { Card, Badge, Btn, PageHeader, Modal, Field, Input, Select, Textarea, useT } from '../ui';
import {
  saveCommitteeRemote, toggleHiringRemote, deleteCommitteeRemote, loadCommittees,
  inviteCollaboratorRemote, removeCollaboratorRemote, respondInviteRemote, lookupCollaboratorRemote,
} from '../../shared/committeeService';
const BRANCH_OPTIONS = ['All Branches', 'Hostel Residents Only', 'Computer Science', 'Electronics', 'Information Technology', 'Mechanical'];

const blank = (adminProfile) => ({
  id: '',
  name: '',
  tag: 'Governance',
  lead: adminProfile?.name || '',
  createdBy: adminProfile?.email || '',
  collaborators: [],
  role: '',
  deadline: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
  minCgpa: 7,
  requiredBranch: 'All Branches',
  vacancies: 5,
  hiringOpen: true,
  description: '',
});

export default function CommitteesAdminTab({ toast, adminProfile }) {
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
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteChecking, setInviteChecking] = useState(false);
  const [saving, setSaving] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const myEmail = (adminProfile?.email || '').trim().toLowerCase();
  const myName = (adminProfile?.name || '').trim().toLowerCase();

  const isPrimaryOwner = (c) => {
    if (!c || !adminProfile) return false;
    if (c.createdBy && myEmail) {
      return c.createdBy.toLowerCase() === myEmail;
    }
    const leadName = (c.lead || '').toLowerCase();
    return Boolean(myName && leadName.includes(myName));
  };

  const isAcceptedContributor = (c) => {
    const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
    return list.some(
      (col) =>
        col.status === 'Accepted' &&
        ((myEmail && col.email?.toLowerCase() === myEmail) ||
          (myName && col.name?.toLowerCase() === myName))
    );
  };

  const getMyPendingInvite = (c) => {
    const list = Array.isArray(c?.collaborators) ? c.collaborators : [];
    return list.find(
      (col) =>
        col.status === 'Pending' &&
        ((myEmail && col.email?.toLowerCase() === myEmail) ||
          (myName && col.name?.toLowerCase() === myName))
    );
  };

  const addCollaboratorInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    setInviteError('');
    if (!email) {
      setInviteError('Please enter an email address.');
      return;
    }

    if (email === myEmail) {
      setInviteError('You are already the committee lead.');
      return;
    }

    const existing = Array.isArray(form.collaborators) ? form.collaborators : [];
    if (existing.some((x) => x.email.toLowerCase() === email)) {
      setInviteError('An invitation has already been sent to this admin.');
      return;
    }

    // Verify against the database: only registered faculty/admin accounts are allowed
    setInviteChecking(true);
    try {
      const found = await lookupCollaboratorRemote(email);
      const name = found.name || inviteName.trim() || email.split('@')[0];
      setForm((prev) => ({
        ...prev,
        collaborators: [
          ...(Array.isArray(prev.collaborators) ? prev.collaborators : []),
          { email: found.email || email, name, status: 'Pending', invitedBy: adminProfile?.name || 'Committee Lead' },
        ],
      }));
      setInviteEmail('');
      setInviteName('');
      toast(`Request added for ${name}`);
    } catch (err) {
      setInviteError(err.message || 'Unable to verify this email.');
    } finally {
      setInviteChecking(false);
    }
  };

    const removeCollaborator = async (email) => {
    const alreadySaved = form.id && db.committees.find((x) => x.id === form.id)?.collaborators?.some((x) => x.email.toLowerCase() === email.toLowerCase());
    if (alreadySaved) {
      try {
        await removeCollaboratorRemote(form.id, email);
        await loadCommittees();
      } catch (err) {
        return toast(err.message);
      }
    }
    setForm((prev) => ({
      ...prev,
      collaborators: (prev.collaborators || []).filter((x) => x.email.toLowerCase() !== email.toLowerCase()),
    }));
  };

    const respondToInvite = async (c, accept) => {
    try {
      await respondInviteRemote(c.id, accept);
      await loadCommittees();
      toast(accept ? `Accepted! You are now a Co-Admin of ${c.name}.` : `Rejected invitation for ${c.name}.`);
    } catch (err) {
      toast(err.message);
    }
  };
    const AI_CATEGORIES = ['Core Committee', 'Technical', 'Non-Technical', 'Sports', 'Cultural', 'Other'];

  const aiFill = async () => {
    if (!form.name.trim()) {
      toast('Type the committee name first.');
      return;
    }
    setAiLoading(true);
    try {
      const record = await api('/ai/committees/generate', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          category: AI_CATEGORIES.includes(form.tag) ? form.tag : 'Other',
          purpose: form.description.trim() || form.name.trim(),
        },
      });
      const ai = record.content || {};
      const firstRole = ai.roles?.[0];
      setForm((f) => ({
        ...f,
        description: ai.description || f.description,
        role: f.role || firstRole?.name || '',
        vacancies: firstRole?.capacity ?? f.vacancies,
      }));
      toast('AI draft applied. Please review before saving.');
    } catch (e) {
      toast(e.message || 'AI request failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    const id =
      form.id ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `c-${Date.now()}`;

    const prevCommittee = db.committees.find((x) => x.id === id);
    const prevEmails = new Set((prevCommittee?.collaborators || []).map((x) => x.email.toLowerCase()));
    const newlyInvited = (form.collaborators || []).filter(
      (col) => col.status === 'Pending' && !prevEmails.has(col.email.toLowerCase())
    );

    setSaving(true);
    try {
      const saved = await saveCommitteeRemote({
        ...form,
        id,
        createdBy: form.createdBy || adminProfile?.email || '',
      });

      // Send the real invites to the server (it re-validates each email)
      const serverId = saved?.id || id;
      const failed = [];
      let sent = 0;
      for (const col of newlyInvited) {
        try {
          await inviteCollaboratorRemote(serverId, { email: col.email, name: col.name });
          sent += 1;
        } catch (err) {
          failed.push(`${col.email} — ${err.message}`);
        }
      }
      if (newlyInvited.length > 0) await loadCommittees();

      toast(`Committee ${form.id ? 'updated' : 'created'}${sent ? ` • ${sent} invite(s) sent` : ''}`);
      if (failed.length) toast(`Invite failed: ${failed.join('; ')}`);
      setForm(null);
      setInviteEmail('');
      setInviteName('');
      setInviteError('');
    } catch (err) {
      toast(err.message || 'Unable to save committee.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Committees & Hiring"
        subtitle="Create committees, invite faculty or co-admins to collaborate, and manage recruitment for committees you lead or contribute to."
      >
        <Btn
          variant="primary"
          onClick={() => {
            setInviteEmail('');
            setInviteName('');
            setInviteError('');
            setForm(blank(adminProfile));
          }}
        >
          <Plus className="w-4 h-4" /> New committee
        </Btn>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {db.committees.map((c) => {
          const apps = db.applications.filter((a) => a.committeeId === c.id);
          const owner = isPrimaryOwner(c);
          const contributor = isAcceptedContributor(c);
          const canManage = owner || contributor;
          const pendingInvite = getMyPendingInvite(c);
          const acceptedCollabs = (c.collaborators || []).filter((x) => x.status === 'Accepted');
          const pendingCollabs = (c.collaborators || []).filter((x) => x.status === 'Pending');

          return (
            <Card key={c.id} className={`p-5 flex flex-col justify-between ${!canManage && !pendingInvite ? 'opacity-80' : ''}`}>
              <div>
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <Badge tone="info">{c.tag}</Badge>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {owner && <Badge tone="good">LEAD</Badge>}
                    {!owner && contributor && <Badge tone="info">CO-ADMIN</Badge>}
                    {pendingInvite && <Badge tone="warn">INVITED</Badge>}
                    <Badge tone={c.hiringOpen ? 'good' : 'bad'}>{c.hiringOpen ? 'HIRING OPEN' : 'HIRING CLOSED'}</Badge>
                  </div>
                </div>

                {pendingInvite && (
                  <div className={`mb-3 p-3 rounded-xl border text-xs space-y-2 ${
                    t.d ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="font-semibold">
                      You are invited by <b>{c.lead}</b> to join this committee.
                    </div>
                    <div className="flex gap-2">
                      <Btn size="sm" variant="primary" onClick={() => respondToInvite(c, true)}>
                        <Check className="w-3 h-3" /> Accept
                      </Btn>
                      <Btn size="sm" onClick={() => respondToInvite(c, false)}>
                        <X className="w-3 h-3" /> Reject
                      </Btn>
                    </div>
                  </div>
                )}

                <h3 className={`font-bold text-base ${t.strong}`}>{c.name}</h3>
                <p className={`text-xs mt-1 mb-3 ${t.muted}`}>{c.description}</p>

                <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${t.inset}`}>
                  <Row k="Role" v={c.role} />
                  <Row k="Lead" v={c.lead} />
                  {acceptedCollabs.length > 0 && (
                    <Row k="Co-Admins" v={acceptedCollabs.map((x) => x.name).join(', ')} />
                  )}
                  {owner && pendingCollabs.length > 0 && (
                    <Row k="Pending Invites" v={pendingCollabs.map((x) => x.email).join(', ')} />
                  )}
                  <Row k="Min CGPA" v={c.minCgpa} />
                  <Row k="Eligibility" v={c.requiredBranch} />
                  <Row k="Vacancies" v={c.vacancies} />
                  <Row k="Deadline" v={fmtDate(Date.parse(`${c.deadline}T00:00:00`))} />
                  <Row k="Applicants" v={`${apps.length} (${apps.filter((a) => a.status === 'Selected').length} selected)`} />
                </div>
              </div>

              {canManage ? (
                <div className={`pt-3 mt-4 border-t flex gap-2 ${t.border}`}>
                  <Btn
                    size="sm"
                    onClick={() => {
                      setInviteEmail('');
                      setInviteName('');
                      setInviteError('');
                      setForm({ ...c, collaborators: c.collaborators || [] });
                    }}
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Btn>
                  <Btn size="sm" onClick={() => toggleHiringRemote(c).catch((e) => toast(e.message))}>
                    {c.hiringOpen ? <><Lock className="w-3 h-3" /> Close</> : <><Unlock className="w-3 h-3" /> Open</>}
                  </Btn>
                  {owner && (
                    <Btn
                      size="sm"
                      variant="danger"
                      className="ml-auto"
                      
                      onClick={() => window.confirm(`Delete ${c.name} and all its applications?`) && deleteCommitteeRemote(c.id).catch((e) => toast(e.message))}
                      
                    >
                      <Trash2 className="w-3 h-3" />
                    </Btn>
                  )}
                </div>
              ) : (
                <div className={`pt-3 mt-4 border-t flex items-center gap-2 text-[11px] ${t.border} ${t.faint}`}>
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Read-only • Managed by <b className={t.muted}>{c.lead}</b></span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {form && (
        <Modal title={form.id ? 'Edit committee' : 'New committee'} onClose={() => setForm(null)} wide>
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Committee name"><Input required value={form.name} onChange={set('name')} /></Field>
            <Field label="Tag"><Input required value={form.tag} onChange={set('tag')} /></Field>
            <Field label="Committee lead"><Input required value={form.lead} onChange={set('lead')} /></Field>
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
              <Field label="Description"><Textarea rows={2} required value={form.description} onChange={set('description')} /></Field>
            </div>
                        <div className="sm:col-span-2">
              <Btn type="button" onClick={aiFill} disabled={aiLoading}>
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </Btn>
            </div>

            <div className={`sm:col-span-2 p-3.5 rounded-xl border space-y-3 ${t.inset}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${t.strong}`}>
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> Invite Faculty / Admin to Contribute
                </span>
                <span className={`text-[10px] ${t.faint}`}>Recipient gets a notification with Accept / Reject</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Faculty / Admin Name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    type="email"
                    placeholder="faculty@college.edu"
                    value={inviteEmail}
                    onChange={(e) => { setInviteEmail(e.target.value); if (inviteError) setInviteError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCollaboratorInvite(); } }}
                  />
                </div>
                <Btn type="button" onClick={addCollaboratorInvite} disabled={inviteChecking} className="w-full">
                  <UserPlus className="w-3.5 h-3.5" /> {inviteChecking ? 'Checking…' : 'Request'}
                </Btn>
              </div>

              {inviteError && (
                <div role="alert" className="text-[11px] font-semibold text-rose-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {inviteError}
                </div>
              )}

              {(form.collaborators || []).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {form.collaborators.map((col) => (
                    <span
                      key={col.email}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border ${
                        t.d ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <b>{col.name}</b>
                      <span className={t.faint}>({col.email})</span>
                      <Badge tone={col.status === 'Accepted' ? 'good' : 'warn'}>{col.status}</Badge>
                      <button
                        type="button"
                        onClick={() => removeCollaborator(col.email)}
                        className="ml-1 text-rose-500 hover:opacity-75"
                        aria-label="Remove collaborator"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <Btn type="button" onClick={() => setForm(null)}>Cancel</Btn>
              <Btn type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save committee'}</Btn>
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
