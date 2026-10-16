import React from 'react';
import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Colour from '@/constants/colour';

type P = { size?: number; color?: ColorValue };
function Line({ size, color, children }: { size: number; color: ColorValue; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export const HomeTabIcon = ({ size = 26, color = Colour.primary }: P) => (
  <Line size={size} color={color}><Path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></Line>
);
export const EventsTabIcon = ({ size = 26, color = Colour.primary }: P) => (
  <Line size={size} color={color}>
    <Rect x="3" y="6" width="14" height="14" rx="2.5" />
    <Path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2M7 12h6M7 16h4" />
  </Line>
);
export const StaffTabIcon = ({ size = 26, color = Colour.primary }: P) => (
  <Line size={size} color={color}>
    <Circle cx="10" cy="8" r="3.5" /><Path d="M3.5 20v-1a6 6 0 0 1 6-6h1" /><Rect x="13" y="14" width="8" height="6" rx="1.5" />
  </Line>
);
export const AttendanceTabIcon = ({ size = 26, color = Colour.primary }: P) => (
  <Line size={size} color={color}>
    <Rect x="3" y="5" width="18" height="16" rx="3" /><Path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4" />
  </Line>
);
export const ReportsTabIcon = ({ size = 26, color = Colour.primary }: P) => (
  <Line size={size} color={color}><Path d="M6 3h8l4 4v14H6zM14 3v4h4M10 17v-3M13 17v-5M16 17v-2" /></Line>
);
export const UserIcon = ({ size = 22, color = Colour.white }: P) => (
  <Line size={size} color={color}><Circle cx="12" cy="8" r="3.5" /><Path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /></Line>
);
export const UploadFileIcon = ({ size = 30, color = Colour.ink }: P) => (
  <Line size={size} color={color}><Path d="M6 3h8l4 4v14H6zM14 3v4h4M12 17v-6M9.5 13.5L12 11l2.5 2.5" /></Line>
);
export const TicketIcon = ({ size = 28, color = Colour.primary }: P) => (
  <Line size={size} color={color}><Path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM10 9v6" /></Line>
);
export const ChevronDown = ({ size = 18, color = Colour.primary }: P) => (
  <Line size={size} color={color}><Path d="M6 9l6 6 6-6" /></Line>
);
export const CalendarBox = ({ size = 20, color = Colour.ink }: P) => (
  <Line size={size} color={color}><Rect x="3" y="5" width="18" height="16" rx="3" /><Path d="M8 3v4M16 3v4M3 10h18" /></Line>
);
