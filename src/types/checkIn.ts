export type CheckInStatus = 'confirmed' | 'duplicate' | 'declined';
export type CheckIn = {
  id: string;
  attendeeName: string;
  ticketCode: string;
  scannedAt: string; // ISO
  status: CheckInStatus;
  gate: string | null;
};
export type ScanStatus = 'confirmed' | 'duplicate' | 'invalid';
export type ScanOutcome = {
  status: ScanStatus;
  attendeeName: string | null; // null when the code isn't recognised
  ticketCode: string | null;
  checkedInAt: string | null; // for a duplicate this is the FIRST check-in time
};
export type Attendance = {
  checkedIn: number;
  total: number;
  records: CheckIn[];
};
