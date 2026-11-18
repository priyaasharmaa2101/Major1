export const isIsoDate = (v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v || '');
export const toInputValue = (v) => (isIsoDate(v) ? v.slice(0, 16) : '');

export function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function formatEventDate(v) {
  if (!isIsoDate(v)) return v || '';
  return new Date(v)
    .toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/,\s(?=\d{1,2}:)/, ' • ');
}