import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackChevron } from '@/components/icons';
import { Button, Card, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useSession } from '@/services/session';
import { getInitials } from '@/utils/initials';
import { confirmSignOut } from '@/utils/signOut';

export default function StaffSettings() {
  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;

  return (
    <ScreenContainer scroll>
      <View style={styles.titleRow}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} style={styles.back}>
          <BackChevron />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <Card style={styles.account}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.name}>{user?.fullName || 'Signed in'}</Text>
          {!!user?.email && <Text style={styles.sub}>{user.email}</Text>}
          <Text style={[styles.sub, styles.role]}>{user?.role}</Text>
        </View>
      </Card>

      <View style={styles.out}>
        <Button label="Sign out" variant="outline" onPress={confirmSignOut} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colour.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  account: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colour.cardBeige },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colour.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colour.white, fontWeight: FontWeight.semibold },
  name: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  sub: { marginTop: 2, fontSize: FontSize.small, color: Colour.textTan },
  role: { textTransform: 'capitalize' },
  out: { marginTop: 28 },
});
