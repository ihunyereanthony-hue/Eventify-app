// Everything the attendee screens ask the server for, in one place.
// Attendees don't log in, so every call here uses auth: false.

import { request } from './api';
import { absoluteUrl, asId, unwrapList } from './mappers';

export type AttendeeEvent = {
  id: string;
  name: string;
  date: string; // e.g. "2026-10-30T00:00:00.000Z"
  startAt: string; // e.g. "10:00"
  venue: string;
  description: string;
  imageUrl: string | null;
  status: string; // "upcoming" is the only one people can register for
};

function toAttendeeEvent(o: any): AttendeeEvent {
  return {
    id: asId(o),
    name: o.name ?? 'Untitled event',
    date: String(o.date ?? ''),
    startAt: String(o.startAt ?? ''),
    venue: o.venue ?? '',
    description: o.description ?? '',
    imageUrl: absoluteUrl(o.image),
    status: String(o.status ?? ''),
  };
}

// The server has no "get one event" route, so we take the whole list and pick from it.
export async function listEvents(): Promise<AttendeeEvent[]> {
  const res = await request('/events', { auth: false });
  return unwrapList(res, 'event', 'events', 'data').map(toAttendeeEvent);
}

export async function getEvent(eventId: string): Promise<AttendeeEvent | null> {
  return (await listEvents()).find((e) => e.id === eventId) ?? null;
}

// "Fri, Oct 30th, 2026 - 10:00 AM"
export function eventWhen(date: string, startAt: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const [h, m] = startAt.split(':').map(Number);
  if (Number.isNaN(h)) return day;
  const time = `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  return `${day} - ${time}`;
}

export type RegisterInput = {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketType: string; // "Regular", "VIP" or "VVIP"
};

// Saves the attendee and gives them one of the event's ticket codes.
// The server emails the code, so nothing secret comes back here.
export async function registerAttendee(input: RegisterInput): Promise<{ attendeeId: string }> {
  const res = await request<any>('/attendees/register', {
    method: 'POST',
    auth: false,
    json: {
      eventId: input.eventId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      ticket_type: input.ticketType, // the server wants this one with an underscore
    },
  });
  return { attendeeId: String(res?.data?.attendee?.id ?? '') };
}

export type VerifiedTicket = {
  attendeeId: string;
  ticketCode: string;
  ticketType: string;
  ticketStatus: string; // "unused" or "used"
  qrToken: string | null; // what the staff scanner reads
  qrCode: string | null; // the same QR as a ready-made picture
};

// Checks the code from the email. If it's right, the server also makes the QR and emails it.
export async function verifyTicketCode(code: string, eventId: string): Promise<VerifiedTicket> {
  const res = await request<any>('/tickets/verify-code', { method: 'POST', auth: false, json: { code, eventId } });
  const d = res?.data ?? {};
  return {
    attendeeId: String(d.attendee?.id ?? ''),
    ticketCode: String(d.ticket?.code ?? code),
    ticketType: String(d.ticket?.ticketType ?? ''),
    ticketStatus: String(d.ticket?.status ?? 'unused'),
    // Only there once the backend team adds them to the verify-code response
    qrToken: d.qrToken ?? null,
    qrCode: d.qrCode ?? null,
  };
}

// The latest state of the attendee's ticket, so "Valid" turns into "Used" after the gate scan.
export async function getMyTicket(attendeeId: string, eventId: string) {
  const res = await request<any>(`/attendees/${attendeeId}/events/${eventId}/ticket`, { auth: false });
  const t = res?.data?.ticket ?? {};
  return { code: String(t.code ?? ''), status: String(t.status ?? ''), ticketType: String(t.ticket_type ?? '') };
}

// What the attendee sees in the Status badge
export function statusLabel(serverStatus: string): string {
  if (serverStatus === 'unused') return 'Valid';
  if (serverStatus === 'used') return 'Used';
  return 'Pending';
}
