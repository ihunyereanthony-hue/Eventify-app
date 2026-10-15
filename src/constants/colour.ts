export const Brand = {
  ink: '#111111', // near-black for headings and dark buttons
  deep: '#3F34B0', // pressed state, a darker step of the purple
  purple: '#5A4DDC', // PRIMARY
  soft: '#CFCAF6', // soft borders and light cards
  pale: '#F1EFFD', // faint purple wash for backgrounds
} as const;

export const Status = {
  success: '#34C759', // confirmed
  warning: '#FFCC00', // duplicate
  danger: '#FF3B3F', // invalid / declined
  errorText: '#FF6B6B', // "Incorrect code. Try again."
} as const;

// Makes a see-through version of any hex, so we can do soft tints
// (badge backgrounds, pressed states) WITHOUT inventing new colours.
export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Colour = {
  // --- brand ---
  primary: Brand.purple,
  primaryDark: Brand.deep,
  primaryLight: Brand.soft,

  // --- backgrounds ---
  background: '#FFFFFF',
  splashBackground: Brand.purple,
  card: Brand.soft, 
  cardFilled: Brand.purple,

  // --- text ---
  textHeading: Brand.ink,
  textBody: Brand.deep,
  textOnPrimary: '#FFFFFF',
  textLink: Brand.purple,
  wordmark: Brand.ink,

  // --- inputs ---
  border: Brand.soft, 
  borderFocused: Brand.purple,
  inputPlaceholder: withAlpha(Brand.deep, 0.5),

  // --- icons ---
  iconDark: '#111111',
  iconBrand: Brand.ink,
  iconOnPrimary: '#FFFFFF',

  // --- check-in status ---
  statusValid: Status.success,
  statusDuplicate: Status.warning,
  statusInvalid: Status.danger,
  statusPending: Brand.deep, 
  
  // pill text, the bright status colours are only fine as fills
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
