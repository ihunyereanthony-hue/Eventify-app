import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { UserIcon } from './organizerIcons';

type Props = { name: string; sub: string; pill: string; onPillPress?: () => void };
export default function PersonCard({ name, sub, pill, onPillPress }: Props) {
  const Pill = onPillPress ? Pressable : View;
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <UserIcon />
      </View>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{sub}</Text>
      </View>
      <Pill {...(onPillPress ? { onPress: onPillPress, accessibilityRole: 'button' as const } : {})} style={styles.pill}>
        <Text style={styles.pillText}>{pill}</Text>
      </Pill>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 26, backgroundColor: Colour.lavender },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colour.primary, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  name: { fontSize: FontSize.small, fontWeight: FontWeight.semibold, color: Colour.primary },
  sub: { marginTop: 2, fontSize: FontSize.small, color: Colour.primary },
  pill: { paddingHorizontal: 18, height: 42, borderRadius: 999, backgroundColor: Colour.primary, alignItems: 'center', justifyContent: 'center' },
  pillText: { fontSize: FontSize.small, fontWeight: FontWeight.medium, color: Colour.white },
});
