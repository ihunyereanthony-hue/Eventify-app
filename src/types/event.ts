export type StaffEvent = {
  id: string;
  name: string;
  startsAt: string;
  venue: string;
  gate: string | null;
  imageUrl: string | null;
  isLive: boolean;
  guestCount: number | null;
  description: string | null;
};
export type EventStats = {
  checkedIn: number;
  total: number;
};
