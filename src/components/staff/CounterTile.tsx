import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colour from '../../constants/colour';
import { FontSize, FontWeight } from '../../constants/typography';

type Props = { label: string; value: number | null; tone?: 'filled' | 'soft' };
export default function CounterTile({ label, value, tone = 'filled' }: Props) {
  const filled = tone === 'filled';
  return (
    <View style={[styles.tile, { backgroundColor: filled ? Colour.primary : Colour.cardBeige }]} accessibilityLabel={`${label}: ${value ?? 'loading'}`}>
      <Text style={[styles.label, { color: filled ? Colour.textOnPrimary : Colour.textTan }]}>{label}</Text>
      <Text style={[styles.value, { color: filled ? Colour.textOnPrimary : Colour.textHeading }]}>{value ?? '\u2013'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: 16, padding: 14 },
  label: { fontSize: FontSize.caption, fontWeight: FontWeight.medium },
  value: { marginTop: 2, fontSize: 24, fontWeight: FontWeight.semibold },
});
