import { Platform } from 'react-native';

export const FontSize = {
  caption: 12,
  small: 14,
  body: 16,
  large: 18,
  heading: 26,
  title: 30,
  hero: 38,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const FontFamily = {
  script: 'EventifyScript',
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) as string,
} as const;
