import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Logo from '@/components/Logo';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useLayout } from '@/hooks/useLayout';
import { useSession } from '@/services/session';
import { getInitials } from '@/utils/initials';

export default function OrganizerHeader() {
  const router = useRouter();
  const { isTablet } = useLayout();
  const { session } = useSession();
  return (
    <View style={styles.row}>
      {isTablet ? <View /> : <Logo size={40} />}
      <Pressable onPress={() => router.push('/profile' as any)} accessibilityRole="button" accessibilityLabel="Your profile" style={styles.avatar}>
        <Text style={styles.initials}>{getInitials(session?.user.fullName)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colour.lavender, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: FontSize.caption, fontWeight: FontWeight.semibold, color: Colour.primary },
});
