import { api } from './api';
import { actions } from './store';

export async function loadEventData() {
  const [{ events }, { payments, passes }] = await Promise.all([api('/events'), api('/payments')]);
  actions.setEventData(events, payments, passes);
}

export async function loadSettings() {
  const { settings } = await api('/settings');
  actions.setSettings(settings);
}

export async function saveEventRemote(f) {
  const payload = {
    title: f.title, tag: f.tag, date: f.date, venue: f.venue,
    price: Number(f.price), priceUnit: f.priceUnit || '',
    seatsTotal: Number(f.seatsTotal), description: f.description,
  };
  if (f.id) await api(`/events/${f.id}`, { method: 'PUT', body: { ...payload, seatsLeft: Number(f.seatsLeft) } });
  else await api('/events', { method: 'POST', body: payload });
  await loadEventData();
}

export async function deleteEventRemote(id) {
  await api(`/events/${id}`, { method: 'DELETE' });
  await loadEventData();
}

export async function payRemote(eventId) {
  const data = await api('/payments', { method: 'POST', body: { eventId } });
  await loadEventData();
  return data;
}

export async function verifyPaymentRemote(id) {
  await api(`/payments/${id}/verify`, { method: 'PATCH' });
  await loadEventData();
}

export async function rejectPaymentRemote(id) {
  await api(`/payments/${id}/reject`, { method: 'PATCH' });
  await loadEventData();
}