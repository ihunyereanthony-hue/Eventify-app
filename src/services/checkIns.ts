import type { CheckIn, ScanOutcome } from '@/types/checkIn';

import { request } from './api';
import { fetchAttendance } from './attendance';
import { ApiError } from './errors';
import { toScanStatus } from './mappers';

export async function listCheckIns(eventId: string): Promise<CheckIn[]> {
  return (await fetchAttendance(eventId)).records;
}

function outcomeFrom(body: any, fallback: ScanOutcome['status']): ScanOutcome {
  const b = body?.data ?? body ?? {};
  return {
    status: b.status || b.result ? toScanStatus(b.status ?? b.result) : fallback,
    attendeeName: b.attendee?.name ?? b.attendeeName ?? b.name ?? null,
    ticketCode: b.ticketCode ?? b.code ?? null,
    checkedInAt: b.checkedInAt ?? b.scannedAt ?? null,
  };
}

export async function submitScan(eventId: string, qrData: string): Promise<ScanOutcome> {
  try {
    const res = await request('/scans/scan', { method: 'POST', json: { qr_token: qrData, event_id: eventId } });
    return outcomeFrom(res, 'confirmed');
  } catch (e) {
    
    if (e instanceof ApiError && [400, 404, 409, 422].includes(e.status)) {
      const dup = e.status === 409 || /already|duplicate|used/i.test(e.message);
      return outcomeFrom(e.data, dup ? 'duplicate' : 'invalid');
    }
    throw e;
  }
}
