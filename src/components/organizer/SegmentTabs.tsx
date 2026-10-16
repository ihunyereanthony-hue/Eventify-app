import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';

type Props<K extends string> = { tabs: { key: K; label: string }[]; value: K; onChange: (k: K) => void };
export default function SegmentTabs<K extends string>({ tabs, value, onChange }: Props<K>) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={[styles.pill, on && styles.on]}
          >
            <Text style={[styles.text, on && styles.textOn]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  pill: { flex: 1, height: 48, borderRadius: 999, backgroundColor: Colour.lavender, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: Colour.primary },
  text: { fontSize: FontSize.small, fontWeight: FontWeight.medium, color: Colour.primary },
  textOn: { color: Colour.white },
});
