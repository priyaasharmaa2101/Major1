import { api } from './api';
import { actions } from './store';

export async function loadCandidates() {
  const { candidates } = await api('/candidates');
  actions.setCandidates(candidates);
}

export async function saveCandidateRemote(c) {
  await api(`/candidates/${encodeURIComponent(c.rollNo)}`, {
    method: 'PUT',
    body: {
      name: c.name,
      branch: c.branch || '',
      assessment: Number(c.assessment),
      interview: Number(c.interview),
    },
  });
  await loadCandidates();
}

export async function deleteCandidateRemote(rollNo) {
  await api(`/candidates/${encodeURIComponent(rollNo)}`, { method: 'DELETE' });
  await loadCandidates();
}