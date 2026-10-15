// Onboarding screens read their colours from here. The values come from colour.ts
// (the app's single palette), so don't type a hex in this file.
import Colour from './colour';

export const COLORS = {
  primary: Colour.primary,
  lightPurple: Colour.card,
  pale: Colour.cardBeige,
  textDark: Colour.textHeading,
  textGray: Colour.textTan,
  white: Colour.white,
  border: Colour.border,
  lightGray: Colour.cardBeige,
} as const;
