import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colour from '../../constants/colour';
import { FontSize, FontWeight } from '../../constants/typography';
import { greetingForHour } from '../../utils/formatDate';
import { getInitials } from '../../utils/initials';
import { BellIcon } from '../icons';
import Logo from '../Logo';

type Props = { fullName: string | null; showLogo?: boolean; onProfilePress?: () => void };
export default function StaffHeader({ fullName, showLogo = true, onProfilePress }: Props) {
  const firstName = fullName?.trim().split(/\s+/)[0];
  const greeting = greetingForHour(new Date().getHours());

  return (
    <View>
      <View style={styles.top}>
        {showLogo ? <Logo /> : <View />}
        <View style={styles.right}>
          <View accessibilityLabel="Notifications">
            <BellIcon />
          </View>
          <Pressable onPress={onProfilePress} accessibilityRole="button" accessibilityLabel="Your profile and settings" style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.hello}>{firstName ? `${greeting}, ${firstName}` : greeting}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colour.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colour.white, fontSize: FontSize.caption, fontWeight: FontWeight.semibold },
  hello: { marginTop: 24, fontSize: 22, fontWeight: FontWeight.semibold, color: Colour.textHeading },
});
