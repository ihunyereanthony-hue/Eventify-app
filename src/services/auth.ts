import { request } from './api';
import { ApiError } from './errors';
import { clearSession, saveSession, type Role, type Session } from './session';

function toRole(raw: any): Role {
  const r = String(raw ?? '').toLowerCase();
  if (r.startsWith('organi')) return 'organizer'; // organizer / organiser
  if (r === 'staff') return 'staff';
  return 'attendee';
}

export async function login(email: string, password: string): Promise<Session> {
  const res = await request<any>('/auth/login', { method: 'POST', json: { email, password }, auth: false });

  // CONFIRM the shape: assumed { token, user: { _id, firstName, lastName, email, role } }
  const u = res?.user ?? res?.data?.user ?? res;
  const token = res?.token ?? res?.accessToken ?? res?.data?.token;
  if (!token) throw new ApiError(500, 'Login worked but the server sent no token.');

  const session: Session = {
    token,
    user: {
      id: String(u._id ?? u.id ?? ''),
      fullName: u.fullName ?? ([u.firstName, u.lastName].filter(Boolean).join(' ') || u.name || ''),
      email: u.email ?? email,
      role: toRole(u.role),
    },
  };
  await saveSession(session);
  return session;
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {
    // server unreachable or token already dead, we still sign out on the phone
  }
  await clearSession();
}

export type SignUpInput = { firstName: string; lastName: string; email: string; password: string; role: 'staff' | 'organizer' };

export const register = (input: SignUpInput) =>
  request('/auth/register', {
    method: 'POST',
    auth: false,
    json: {
      ...input,
      confirmPassword: input.password,
      fullName: `${input.firstName} ${input.lastName}`,
    },
  });

// export const verifyCode = (email: string, code: string) =>
//   request('/auth/verify-code', { method: 'POST', json: { email, code }, auth: false });

export const verifyCode = (email: string, code: string, tempToken: string) =>
  request('/auth/verify-code', { method: 'POST', json: { email, code }, auth: false, token: tempToken });


export const forgotPassword = (email: string) =>
  request('/auth/forgot-password', { method: 'POST', json: { email }, auth: false });

export const verifyResetCode = (email: string, code: string) =>
  request('/auth/verify-reset-code', { method: 'POST', json: { email, code }, auth: false });

export const confirmResetPassword = (email: string, code: string, password: string) =>
  request('/auth/confirm-reset-password', { method: 'POST', json: { email, code, password }, auth: false });
