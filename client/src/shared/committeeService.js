// import { api } from './api';
// import { actions, getDB } from './store';

// const fromServer = (c) => ({
//   ...c,
//   createdBy: c.createdBy?.email || '',
//   collaborators: c.collaborators || [],
// });

// export async function loadCommittees() {
//   const { committees } = await api('/committees');
//   actions.setCommittees(committees.map(fromServer));
// }

// export async function saveCommitteeRemote(c) {
//   const payload = {
//     name: c.name, tag: c.tag, lead: c.lead, role: c.role,
//     deadline: c.deadline, minCgpa: Number(c.minCgpa),
//     requiredBranch: c.requiredBranch, vacancies: Number(c.vacancies),
//     hiringOpen: c.hiringOpen !== false, description: c.description,
//   };
//   const existsOnServer = getDB().committees.some((x) => x.id === c.id);
//   const res = existsOnServer
//     ? await api(`/committees/${c.id}`, { method: 'PUT', body: payload })
//     : await api('/committees', { method: 'POST', body: payload });
//   await loadCommittees();
//   return res.committee;
// }

// export async function toggleHiringRemote(c) {
//   await api(`/committees/${c.id}`, { method: 'PUT', body: { hiringOpen: !c.hiringOpen } });
//   await loadCommittees();
// }

// export async function deleteCommitteeRemote(id) {
//   await api(`/committees/${id}`, { method: 'DELETE' });
//   await loadCommittees();
// }
// export const inviteCollaboratorRemote = (id, { email, name }) =>
//   api(`/committees/${id}/invite`, { method: 'POST', body: { email, name } });

// export const removeCollaboratorRemote = (id, email) =>
//   api(`/committees/${id}/collaborators/${encodeURIComponent(email)}`, { method: 'DELETE' });

// export const respondInviteRemote = (id, accept) =>
//   api(`/committees/${id}/respond`, { method: 'POST', body: { accept } });

import { api } from './api';
import { actions, getDB } from './store';

const fromServer = (c) => ({
  ...c,
  createdBy: c.createdBy?.email || '',
  collaborators: c.collaborators || [],
});

export async function loadCommittees() {
  const { committees } = await api('/committees');
  actions.setCommittees(committees.map(fromServer));
}

export async function saveCommitteeRemote(c) {
  const payload = {
    name: c.name, tag: c.tag, lead: c.lead, role: c.role,
    deadline: c.deadline, minCgpa: Number(c.minCgpa),
    requiredBranch: c.requiredBranch, vacancies: Number(c.vacancies),
    hiringOpen: c.hiringOpen !== false, description: c.description,
  };
  const existsOnServer = getDB().committees.some((x) => x.id === c.id);
  const res = existsOnServer
    ? await api(`/committees/${c.id}`, { method: 'PUT', body: payload })
    : await api('/committees', { method: 'POST', body: payload });
  await loadCommittees();
  return res.committee;
}

export async function toggleHiringRemote(c) {
  await api(`/committees/${c.id}`, { method: 'PUT', body: { hiringOpen: !c.hiringOpen } });
  await loadCommittees();
}

export async function deleteCommitteeRemote(id) {
  await api(`/committees/${id}`, { method: 'DELETE' });
  await loadCommittees();
}
export const inviteCollaboratorRemote = (id, { email, name }) =>
  api(`/committees/${id}/invite`, { method: 'POST', body: { email, name } });

export const removeCollaboratorRemote = (id, email) =>
  api(`/committees/${id}/collaborators/${encodeURIComponent(email)}`, { method: 'DELETE' });

export const respondInviteRemote = (id, accept) =>
  api(`/committees/${id}/respond`, { method: 'POST', body: { accept } });
export const lookupCollaboratorRemote = (email) =>
  api(`/committees/collaborator-lookup?email=${encodeURIComponent(email)}`);