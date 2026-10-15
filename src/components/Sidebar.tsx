// Tablet-only left nav (the Figma sidebar). Phones never render this, they get stack screens.
// Only lists screens that can open without picking an event first. Scan and check-ins
// need an event, so they stay on the cards.

import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colour, { withAlpha } from '../constants/colour';
import { FontSize, FontWeight } from '../constants/typography';
import { confirmSignOut } from '../utils/signOut';
import Logo from './Logo';

export type NavItem = { label: string; href: string };

type Props = { items: NavItem[]; name: string; roleLabel: string };

export default function Sidebar({ items, name, roleLabel }: Props) {
  const router = useRouter();
  const path = usePathname();

  return (
    <View style={styles.bar}>
      <View style={styles.logo}>
        <Logo light />
      </View>
      <View style={styles.items}>
        {items.map((it) => {
          const active = path === it.href;
          return (
            <Pressable
              key={it.href}
              onPress={() => router.push(it.href as any)}
              accessibilityRole="button"
              style={[styles.item, active && styles.itemActive]}
            >
              <Text style={styles.itemText}>{it.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={confirmSignOut} accessibilityRole="button" style={styles.user}>
        <Text style={styles.userName}>{name || 'Signed in'}</Text>
        <Text style={styles.userRole}>{`${roleLabel} · Sign out`}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { width: 230, backgroundColor: Colour.primary, paddingVertical: 36, paddingHorizontal: 16 },
  logo: { marginBottom: 32, paddingHorizontal: 12 },
  items: { flex: 1, gap: 6 },
  item: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12 },
  itemActive: { backgroundColor: withAlpha(Colour.white, 0.18) },
  itemText: { fontSize: FontSize.small, fontWeight: FontWeight.medium, color: Colour.white },
  user: { paddingHorizontal: 12 },
  userName: { fontSize: FontSize.small, fontWeight: FontWeight.semibold, color: Colour.white },
  userRole: { fontSize: FontSize.caption, color: withAlpha(Colour.white, 0.75), marginTop: 2, textTransform: 'capitalize' },
});
