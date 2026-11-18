import { api } from './api';
import { actions } from './store';

export async function loadGrievances() {
  const { grievances } = await api('/grievances');
  actions.setGrievances(grievances);
}

export async function raiseGrievanceRemote(body) {
  const data = await api('/grievances', { method: 'POST', body });
  await loadGrievances();
  return data.grievance;
}

export async function updateGrievanceRemote(id, body) {
  await api(`/grievances/${id}`, { method: 'PATCH', body });
  await loadGrievances();
}

// AI suggestions only. No student name or roll number is sent.
export async function assessGrievanceAI(g) {
  const record = await api('/ai/grievances/assess', {
    method: 'POST',
    body: {
      grievance_description: g.description,
      title: g.title,
      committee: g.committee,
      current_status: g.status,
    },
  });
  return record.content || {};
}