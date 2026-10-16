import { ApiError, NetworkError } from './errors';
import { clearSession, getToken } from './session';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'https://qr-attendance-backend-zn67.onrender.com/api').replace(/\/$/, '');

const TIMEOUT_MS = 60000;
export const API_ORIGIN = API_URL.replace(/\/api$/, '');
 
type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  json?: unknown;
  form?: FormData;
  auth?: boolean;
  token?: string;
};

export async function request<T = any>(path: string, opts: Options = {}): Promise<T> {
  const { method = 'GET', json, form, auth = true } = opts;
  const headers: Record<string, string> = { Accept: 'application/json' };

  // const token = auth ? await getToken() : null;
  const token = opts.token ?? (auth ? await getToken() : null);
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: any;
  if (form) {
    body = form; 
  } else if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }

  let res: Response;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body, signal: controller.signal });
  } catch {
    throw new NetworkError();
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
  
  }

  if (!res.ok) {
    if (res.status === 401 && auth) await clearSession();
    throw new ApiError(res.status, data?.message ?? data?.error ?? `Request failed (${res.status})`, data);
  }
  return data as T;
}
