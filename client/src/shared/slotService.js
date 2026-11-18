import { api } from './api';
import { actions } from './store';
import { loadApplications } from './applicationService';

export async function loadSlots() {
  const { slots } = await api('/slots');
  actions.setSlots(slots);
}

export async function bookSlotRemote(appId, slotId) {
  await api(`/applications/${appId}/slot`, { method: 'POST', body: { slotId } });
  await Promise.all([loadApplications(), loadSlots()]);
}

export async function addSlotRemote(label, capacity = 1) {
  await api('/slots', { method: 'POST', body: { label, capacity } });
  await loadSlots();
}

export async function deleteSlotRemote(id) {
  await api(`/slots/${id}`, { method: 'DELETE' });
  await Promise.all([loadApplications(), loadSlots()]);
}

export async function generateSlotsRemote(days = 3) {
  await api('/slots/generate', { method: 'POST', body: { days } });
  await loadSlots();
}