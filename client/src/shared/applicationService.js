import { api } from './api';
import { actions } from './store';
import { loadCommittees } from './committeeService';

export async function loadApplications() {
  const { applications, students } = await api('/applications');
  actions.setApplicationsFromServer(applications, students);
}

export async function applyRemote(committeeId) {
  const { application } = await api('/applications', { method: 'POST', body: { committeeId } });
  await loadApplications();
  return application;
}

export async function updateApplicationRemote(id, body) {
  await api(`/applications/${id}`, { method: 'PATCH', body });
  await Promise.all([loadApplications(), loadCommittees()]); // vacancies can change
}