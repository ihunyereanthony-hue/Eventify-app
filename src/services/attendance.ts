import type { Attendance } from '@/types/checkIn';

import { request } from './api';
import { toCheckIn, unwrapList } from './mappers';

export async function fetchAttendance(eventId: string): Promise<Attendance> {
  const res = await request<any>(`/scans/events/${eventId}/attendance`);

  const records = unwrapList(res, 'attendance', 'records', 'checkIns', 'data').map(toCheckIn);
  const checkedIn = res?.checkedIn ?? res?.stats?.checkedIn ?? records.filter((r) => r.status === 'confirmed').length;
  const total = res?.total ?? res?.totalTickets ?? res?.stats?.total ?? 0;

  records.sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  return { checkedIn, total, records };
}
