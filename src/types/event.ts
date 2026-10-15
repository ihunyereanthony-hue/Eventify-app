export type StaffEvent = {
  id: string;
  name: string;
  startsAt: string; // ISO date string
  venue: string;
  gate: string | null; // gate this staff member is posted at, if the backend says
  imageUrl: string | null;
  isLive: boolean;
  guestCount: number | null; // null = backend didn't send it, so we don't show it
  description: string | null; // the "About Event" text
};

export type EventStats = {
  checkedIn: number;
  total: number;
};
