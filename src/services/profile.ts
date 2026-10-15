import type { StaffProfile } from '@/types/staff';

import { request } from './api';
import { getSession, saveSession } from './session';

export async function getStaffProfile(): Promise<StaffProfile> {
  return { fullName: getSession()?.user.fullName ?? '' };
}

// Same for staff and organizers. CONFIRM the body, the doc only names the route.
export async function updateProfile(fullName: string) {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  await request('/auth/update-profile', { method: 'PUT', json: { firstName, lastName: rest.join(' ') } });
  
  const s = getSession();
  if (s) await saveSession({ ...s, user: { ...s.user, fullName: fullName.trim() } });
}
