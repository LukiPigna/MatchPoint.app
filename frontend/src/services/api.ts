// ============================================================
// Cliente HTTP centralizado
// Autor: Lucas Pignataro
// ============================================================

const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('authToken');
}

function buildHeaders(withAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (withAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  withAuth = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(withAuth),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? `Error ${res.status}`);
  }

  return data as T;
}

export const api = {
  get:    <T>(path: string)              => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body),
  delete: <T>(path: string)              => request<T>('DELETE', path),

  // Auth (sin token en el header)
  auth: {
    login:    <T>(body: unknown) => request<T>('POST', '/auth/login',    body, false),
    register: <T>(body: unknown) => request<T>('POST', '/auth/register', body, false),
  },
};
