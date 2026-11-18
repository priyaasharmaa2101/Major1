import { api } from './api';
import { actions } from './store';

export async function loadNotifications() {
  const { notifications } = await api('/notifications');
  actions.setNotifications(notifications);
}