const valid = (iso: string) => !Number.isNaN(new Date(iso).getTime());

export function formatEventDate(iso: string): string {
  if (!valid(iso)) return '';
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}
export function formatTime(iso: string): string {
  if (!valid(iso)) return '';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
export const dayOf = (iso: string) => (valid(iso) ? String(new Date(iso).getDate()).padStart(2, '0') : '');
export const monthOf = (iso: string) => (valid(iso) ? new Date(iso).toLocaleDateString('en-GB', { month: 'short' }) : '');

const ordinal = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  return ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
};
export function formatDayLong(d: Date): string {
  const wk = d.toLocaleDateString('en-US', { weekday: 'short' });
  const mo = d.toLocaleDateString('en-US', { month: 'short' });
  return `${wk}, ${mo} ${d.getDate()}${ordinal(d.getDate())}, ${d.getFullYear()}`;
}
export function formatLongDate(iso: string): string {
  if (!valid(iso)) return '';
  return `${formatDayLong(new Date(iso))} - ${formatTime(iso)}`;
}
export const formatInputDate = (d: Date) =>
  `${d.getDate()}${ordinal(d.getDate())} ${d.toLocaleDateString('en-GB', { month: 'short' })}, ${d.getFullYear()}`;
export const formatInputTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '');

export const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
