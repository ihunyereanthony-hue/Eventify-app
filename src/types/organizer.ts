export type TicketCode = {
  id: string;
  code: string;
  holderName: string | null;
  ticketType: string | null; // Regular / VIP / VVIP, if the backend sends it
  used: boolean;
};

export type NewEventInput = {
  name: string;
  startsAt: string; // ISO
  venue: string;
  description: string;
  image: { uri: string; name: string; type: string } | null;
};

export type PickedFile = { uri: string; name: string; type: string };

export type EventReport = {
  registered: number;
  checkedIn: number;
  byType: { label: string; count: number }[];
};

export type StaffMember = {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  active: boolean;
};
