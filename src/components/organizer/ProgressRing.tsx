import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';

type Props = { value: number; total: number; size?: number };
export default function ProgressRing({ value, total, size = 240 }: Props) {
  const stroke = 20;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View style={{ width: size, height: size, alignSelf: 'center' }} accessibilityLabel={`${value} checked in of ${total}`}>
      <Svg width={size} height={size}>
        <Circle cx={c} cy={c} r={r} stroke={Colour.hairline} strokeWidth={stroke} fill="none" />
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={Colour.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circ}`}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          rotation={-90}
          origin={`${c}, ${c}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.number}>{value}</Text>
        <Text style={styles.label}>Checked in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 56, fontWeight: FontWeight.bold, color: Colour.ink, lineHeight: 62 },
  label: { fontSize: FontSize.large, fontWeight: FontWeight.medium, color: Colour.textMuted },
});
