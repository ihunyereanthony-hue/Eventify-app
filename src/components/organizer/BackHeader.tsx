// "< Title" row used on the screens that sit on top of the tabs. `right` is for a chip or button.
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackChevron } from '@/components/icons';
import Colour from '@/constants/colour';
import { FontWeight } from '@/constants/typography';

export default function BackHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" hitSlop={12} style={styles.back}>
        <BackChevron />
      </Pressable>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 8 },
  back: { width: 36, height: 44, justifyContent: 'center' },
  title: { flex: 1, fontSize: 22, fontWeight: FontWeight.bold, color: Colour.ink },
});
