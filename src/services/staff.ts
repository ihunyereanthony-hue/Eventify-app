import type { StaffMember } from '@/types/organizer';
import { NotConnectedError } from '@/services/errors';

export async function listStaff(): Promise<StaffMember[]> {
  throw new NotConnectedError('Staff management');
}
export async function listEventStaff(_eventId: string): Promise<StaffMember[]> {
  throw new NotConnectedError('Event staff');
}
export async function assignStaff(_eventId: string, _staffIds: string[]): Promise<void> {
  throw new NotConnectedError('Assigning staff');
}
