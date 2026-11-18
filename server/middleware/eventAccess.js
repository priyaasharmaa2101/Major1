export const EVENT_OWNER_MESSAGE =
  'Only the admin who created this event can modify it.';

// true only if the logged-in admin created this event
export function isEventOwner(event, user) {
  if (!event || !user) return false;
  if (user.role !== 'admin') return false;
  if (!event.createdBy) return false;
  return String(event.createdBy) === String(user._id);
}