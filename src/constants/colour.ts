export const Brand = {
  ink: '#111111',
  deep: '#3F34B0',
  purple: '#5A4DDC',
  soft: '#CFCAF6',
  pale: '#F1EFFD',
} as const;

export const Status = {
  success: '#34C759',
  warning: '#FFCC00',
  danger: '#FF3B3F',
  errorText: '#FF6B6B',
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Colour = {
  primary: Brand.purple,
  primaryDark: Brand.deep,
  primaryLight: Brand.soft,
  background: '#FFFFFF',
  splashBackground: Brand.purple,
  card: Brand.soft, 
  cardFilled: Brand.purple,
  textHeading: Brand.ink,
  textBody: Brand.deep,
  textOnPrimary: '#FFFFFF',
  textLink: Brand.purple,
  wordmark: Brand.ink,
  border: Brand.soft, 
  borderFocused: Brand.purple,
  inputPlaceholder: withAlpha(Brand.deep, 0.5),
  iconDark: '#111111',
  iconBrand: Brand.ink,
  iconOnPrimary: '#FFFFFF',
  statusValid: Status.success,
  statusDuplicate: Status.warning,
  statusInvalid: Status.danger,
  statusPending: Brand.deep, 
  statusValidText: '#1B6B34',
  statusDuplicateText: '#6B5300',
  statusInvalidText: '#A01E22',
  success: Status.success,
  warning: Status.warning,
  danger: Status.danger,
  errorText: Status.errorText,
  ink: Brand.ink,
  inkPressed: Brand.deep,
  surface: '#FFFFFF', 
  hairline: withAlpha(Brand.ink, 0.14),
  textMuted: withAlpha(Brand.ink, 0.68), 
  textAccent: Brand.deep,
  scrim: withAlpha(Brand.ink, 0.45),
  cardBeige: Brand.pale, 
  textTan: withAlpha(Brand.ink, 0.55), 
  lavender: '#DEDAF7',
  field: '#F2F2F2', 
  logoutRed: '#E5322D',
  inactiveTab: withAlpha(Brand.deep, 0.7),
  placeholder: '#DADADA',
  white: '#FFFFFF',
  black: '#111111',
  transparent: 'transparent',
} as const;

export default Colour;
export type ColourKey = keyof typeof Colour;
