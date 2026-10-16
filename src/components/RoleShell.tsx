import { Redirect, Stack } from 'expo-router';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLayout } from '../hooks/useLayout';
import { useSession, type Role } from '../services/session';
import { LoadingView } from './StateViews';
import Sidebar, { type NavItem } from './Sidebar';

export const HOME: Record<Role, string> = {
  organizer: '/home',
  staff: '/dashboard',
  attendee: '/',
};

export default function RoleShell({ role, items, navigator }: { role: Role; items: NavItem[]; navigator?: ReactNode }) {
  const { session, ready } = useSession();
  const { isTablet } = useLayout();
  if (!ready) {
    return (
      <View style={styles.center}>
        <LoadingView />
      </View>
    );
  }
  if (!session) return <Redirect href={'/login' as any} />;
  if (session.user.role !== role) return <Redirect href={HOME[session.user.role] as any} />;
  const stack = navigator ?? <Stack screenOptions={{ headerShown: false }} />;
  if (!isTablet) return stack;
  return (
    <View style={styles.row}>
      <Sidebar items={items} name={session.user.fullName} roleLabel={role} />
      <View style={styles.main}>{stack}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  row: { flex: 1, flexDirection: 'row' },
  main: { flex: 1 },
});
