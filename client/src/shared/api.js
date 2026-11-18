export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch('/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('campusToken'),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (res.status === 401) {
    localStorage.removeItem('campusToken');
    localStorage.removeItem('campusUser');
    window.location.href = '/login';
  }
  if (!res.ok) {
    const d = data.message || data.detail;
    throw new Error(typeof d === 'string' ? d : `HTTP ${res.status}`);
  }
  return data;
}