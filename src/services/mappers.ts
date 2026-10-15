import type { CheckIn, CheckInStatus, ScanStatus } from '@/types/checkIn';
import type { StaffEvent } from '@/types/event';

import { API_ORIGIN } from './api';

export function unwrapList(res: any, ...keys: string[]): any[] {
  if (Array.isArray(res)) return res;
  for (const k of keys) if (Array.isArray(res?.[k])) return res[k];
  return [];
}

// Mongo-style _id is the usual suspect
export const asId = (o: any) => String(o?._id ?? o?.id ?? '');

export function absoluteUrl(p?: string | null): string | null {
  if (!p) return null;
  return /^https?:/i.test(p) ? p : `${API_ORIGIN}${p.startsWith('/') ? '' : '/'}${p}`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return d.toDateString() === new Date().toDateString();
}

export function toEvent(o: any): StaffEvent {
  const startsAt = String(o.startsAt ?? o.date ?? o.startDate ?? ''); // CONFIRM
  const status = String(o.status ?? '').toLowerCase();
  return {
    id: asId(o),
    name: o.name ?? o.title ?? 'Untitled event', // CONFIRM
    startsAt,
    venue: o.venue ?? o.location ?? '', // CONFIRM
    gate: o.gate ?? null,
    imageUrl: absoluteUrl(o.image ?? o.imageUrl ?? o.banner), // CONFIRM
    
    
    isLive: status === 'live' || status === 'ongoing' || (status === '' && isToday(startsAt)),
    description: o.description ?? o.about ?? null, // CONFIRM
    guestCount: [o.guestCount, o.registeredCount, o.attendeeCount].find((n) => typeof n === 'number') ?? null,
  };
}

// the three words the scan endpoint might use, anything else counts as invalid
export function toScanStatus(raw: any): ScanStatus {
  const s = String(raw ?? '').toLowerCase();
  if (['valid', 'success', 'confirmed', 'checked_in', 'checked-in'].includes(s)) return 'confirmed';
  if (['duplicate', 'already_scanned', 'used', 'already_used'].includes(s)) return 'duplicate';
  return 'invalid';
}

export function toRowStatus(raw: any): CheckInStatus {
  const s = toScanStatus(raw);
  return s === 'invalid' ? 'declined' : s;
}

export function toCheckIn(o: any): CheckIn {
  return {
    id: asId(o),
    attendeeName: o.attendeeName ?? o.name ?? o.attendee?.name ?? '', // CONFIRM
    ticketCode: o.ticketCode ?? o.code ?? '', // CONFIRM
    scannedAt: String(o.scannedAt ?? o.checkedInAt ?? o.createdAt ?? ''),
    status: toRowStatus(o.status ?? o.result),
    gate: o.gate ?? null,
  };
}
