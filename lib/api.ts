export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

export async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    let msg: any;
    try { msg = await res.json(); } catch {}
    throw new Error(msg?.error || res.statusText);
  }
  return res.json();
}
