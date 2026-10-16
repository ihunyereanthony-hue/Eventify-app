import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';

type Props = { label: string; value: string; tone?: 'outline' | 'soft' };
export default function StatTile({ label, value, tone = 'outline' }: Props) {
  return (
    <View style={[styles.tile, tone === 'outline' ? styles.outline : styles.soft]} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, gap: 2 },
  outline: { borderWidth: 1.5, borderColor: Colour.primary, alignItems: 'center' },
  soft: { backgroundColor: Colour.lavender },
  label: { fontSize: FontSize.small, color: Colour.primary },
  value: { fontSize: FontSize.large, fontWeight: FontWeight.bold, color: Colour.primaryDark },
});
