import { API_URL } from '@/lib/env';

interface ApiFetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  token?: string;
  params?: Record<string, string>;
  body?: any; // Will be JSON stringified automatically
}

async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, params, body, ...fetchOptions } = options;

  const url = new URL(endpoint, API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = new Headers(fetchOptions.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || res.statusText);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T = any>(endpoint: string, options: Omit<ApiFetchOptions, 'method'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options: Omit<ApiFetchOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options: Omit<ApiFetchOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body?: any, options: Omit<ApiFetchOptions, 'method' | 'body'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options: Omit<ApiFetchOptions, 'method'> = {}) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
