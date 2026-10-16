import type { StaffEvent } from '@/types/event';
import type { EventReport, NewEventInput, PickedFile, TicketCode } from '@/types/organizer';

import { request } from '@/services/api';
import { fetchAttendance } from '@/services/attendance';
import { unwrapList } from '@/services/mappers';
import { getSession } from '@/services/session'; 

const asId = (o: any) => String(o?._id ?? o?.id ?? '');

function toTicketCode(o: any): TicketCode {
  return {
    id: asId(o) || String(o.code),
    code: String(o.code ?? o.ticketCode ?? ''),
    holderName: o.attendeeName ?? o.name ?? o.attendee?.name ?? null,
    ticketType: o.ticketType ?? o.type ?? o.category ?? null,
    used: !!(o.used ?? o.isUsed ?? o.checkedIn),
  };
}

export async function createEvent(input: NewEventInput): Promise<{ id: string | null }> {
   const start = new Date(input.startsAt);
  const startAt = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  const form = new FormData();
  form.append('name', input.name);
  form.append('date', input.startsAt);
  form.append('startAt', startAt);
  form.append('venue', input.venue);
  form.append('description', input.description);
  form.append('organizer_id', getSession()?.user.id ?? '');

  if (input.image) form.append('image', input.image as any);

  const res = await request<any>('/events', { method: 'POST', form });
  const id = res?.event?._id ?? res?.event?.id ?? res?.data?._id ?? res?._id ?? res?.id ?? null;
  return { id: id ? String(id) : null };
}

export async function listCodes(eventId: string): Promise<TicketCode[]> {
  const res = await request(`/events/${eventId}/codes`);
  return unwrapList(res, 'codes', 'tickets', 'data').map(toTicketCode);
}

export async function uploadCodes(eventId: string, file: PickedFile) {
  const form = new FormData();
  form.append('ticket', file as any);
  return request(`/events/${eventId}/codes`, { method: 'POST', form });
}

export async function deleteAllCodes(eventId: string) {
  return request(`/events/${eventId}/codes`, { method: 'DELETE' });
}

export async function getEventReport(eventId: string): Promise<EventReport> {
  const [att, codes] = await Promise.all([fetchAttendance(eventId), listCodes(eventId).catch(() => [] as TicketCode[])]);
  const counts = new Map<string, number>();
  codes.forEach((c) => c.ticketType && counts.set(c.ticketType, (counts.get(c.ticketType) ?? 0) + 1));
  return {
    registered: att.total || codes.length,
    checkedIn: att.checkedIn,
    byType: [...counts].map(([label, count]) => ({ label, count })),
  };
}

export async function getTotalCheckedIn(events: StaffEvent[]): Promise<number> {
  const all = await Promise.allSettled(events.map((e) => fetchAttendance(e.id)));
  return all.reduce((sum, r) => sum + (r.status === 'fulfilled' ? r.value.checkedIn : 0), 0);
}
