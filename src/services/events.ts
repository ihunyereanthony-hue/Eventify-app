import type { EventStats, StaffEvent } from '@/types/event';

import { request } from './api';
import { fetchAttendance } from './attendance';
import { toEvent, unwrapList } from './mappers';

export async function listAssignedEvents(): Promise<StaffEvent[]> {
  const res = await request('/events');
  return unwrapList(res, 'events', 'data').map(toEvent);
}

// Scanner counters. Same endpoint the organizer dashboard uses.
export async function getEventStats(eventId: string): Promise<EventStats> {
  const { checkedIn, total } = await fetchAttendance(eventId);
  return { checkedIn, total };
}
