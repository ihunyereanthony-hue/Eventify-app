import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Colour from '../constants/colour';

type P = { size?: number; color?: string };
function Line({ size, color, width = 2, children }: { size: number; color: string; width?: number; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}
export const BackChevron = ({ size = 26, color = Colour.ink }: P) => (
  <Line size={size} color={color} width={2.4}><Path d="M15 5l-7 7 7 7" /></Line>
);
export const BellIcon = ({ size = 24, color = Colour.ink }: P) => (
  <Line size={size} color={color} width={1.8}><Path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0" /></Line>
);
export const SearchIcon = ({ size = 20, color = Colour.textTan }: P) => (
  <Line size={size} color={color} width={2}><Circle cx="11" cy="11" r="7" /><Path d="M16 16l5 5" /></Line>
);
export const CalendarSmall = ({ size = 14, color = Colour.textTan }: P) => (
  <Line size={size} color={color} width={1.8}>
    <Rect x="3" y="5" width="18" height="16" rx="2.5" />
    <Path d="M8 3v4M16 3v4M3 10h18" />
  </Line>
);
export const PinSmall = ({ size = 14, color = Colour.textTan }: P) => (
  <Line size={size} color={color} width={1.8}>
    <Path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <Circle cx="12" cy="10" r="2.5" />
  </Line>
);
export const GuestsSmall = ({ size = 14, color = Colour.textTan }: P) => (
  <Line size={size} color={color} width={1.8}>
    <Circle cx="9" cy="8" r="3" /><Path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    <Circle cx="17" cy="9" r="2.5" /><Path d="M17 14a4 4 0 0 1 4 4v2" />
  </Line>
);
export const ImagePlaceholderIcon = ({ size = 22, color = Colour.textTan }: P) => (
  <Line size={size} color={color} width={1.8}>
    <Rect x="3" y="4" width="18" height="16" rx="3" /><Circle cx="9" cy="10" r="1.8" /><Path d="M21 16l-5-5-8 9" />
  </Line>
);
export const WifiOffIcon = ({ size = 44, color = Colour.primary }: P) => (
  <Line size={size} color={color} width={2}>
    <Path d="M2 9a15 15 0 0 1 4-2.6M22 9a15 15 0 0 0-10-3M5 13a10 10 0 0 1 5-2.6M19 13a10 10 0 0 0-2.5-1.9M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 2l20 20" />
  </Line>
);
export const PlusIcon = ({ size = 20, color = Colour.white }: P) => (
  <Line size={size} color={color} width={2.4}><Path d="M12 5v14M5 12h14" /></Line>
);
export function ResultBadge({ status, size = 96 }: { status: 'confirmed' | 'duplicate' | 'invalid'; size?: number }) {
  const bg = status === 'confirmed' ? Colour.statusValid : status === 'duplicate' ? Colour.statusDuplicate : Colour.statusInvalid;
  const fg = status === 'duplicate' ? Colour.ink : Colour.white;
  const label = status === 'confirmed' ? 'Confirmed' : status === 'duplicate' ? 'Duplicate' : 'Invalid';
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        {status === 'confirmed' && <Path d="M5 12l5 5L20 7" />}
        {status === 'invalid' && <Path d="M6 6l12 12M18 6L6 18" />}
        {status === 'duplicate' && (
          <>
            <Circle cx="9" cy="8" r="3" /><Path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
            <Circle cx="17" cy="9" r="2.5" /><Path d="M17 14a4 4 0 0 1 4 4v2" />
          </>
        )}
      </Svg>
    </View>
  );
}
