import { PUBLIC_API_URL } from 'astro:env/client';

export interface ApiFetchOptions extends Omit<RequestInit, 'method' | 'body'> {
  token?: string;
  params?: Record<string, any>;
  body?: any; // Will be JSON stringified automatically unless it's FormData
  isFormData?: boolean; // Explicitly indicate when sending FormData
}

async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, params, body, isFormData, ...fetchOptions } = options;

  const url = new URL(endpoint, PUBLIC_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = new Headers(fetchOptions.headers || {});

  // Don't set Content-Type for FormData - let browser set it with boundary
  const isFormDataBody = body instanceof FormData || isFormData;

  if (!isFormDataBody) {
    headers.set('Content-Type', 'application/json');
  }

  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Prepare body based on type
  let requestBody: any;
  if (body) {
    if (isFormDataBody) {
      requestBody = body; // Use FormData as-is
    }
    else {
      requestBody = JSON.stringify(body); // JSON stringify for regular requests
    }
  }

  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
    body: requestBody,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || res.statusText);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T = any>(
    endpoint: string,
    options: Omit<ApiFetchOptions, 'method'> = {},
  ) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiFetchOptions, 'method' | 'body'> = {},
  ) => apiFetch<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiFetchOptions, 'method' | 'body'> = {},
  ) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiFetchOptions, 'method' | 'body'> = {},
  ) => apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(
    endpoint: string,
    options: Omit<ApiFetchOptions, 'method'> = {},
  ) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),

  uploadFile: <T = any>(
    endpoint: string,
    formData: FormData,
    options: Omit<ApiFetchOptions, 'method' | 'body' | 'isFormData'> = {},
  ) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      isFormData: true,
    }),
};
