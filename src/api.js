export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options, credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = await response.json().catch(() => ({ error: 'Unexpected server response' }));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}
const legacyKey = 'mep-recipes2';
export function readLegacy() {
  try { const data = JSON.parse(localStorage.getItem(legacyKey) || '[]'); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
