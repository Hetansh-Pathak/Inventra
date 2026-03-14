const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('ci_token');
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}
