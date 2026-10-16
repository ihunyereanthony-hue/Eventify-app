import { Tabs } from 'expo-router';
import React from 'react';
import {
  AttendanceTabIcon,
  EventsTabIcon,
  HomeTabIcon,
  ReportsTabIcon,
  StaffTabIcon,
} from '@/components/organizer/organizerIcons';
import RoleShell from '@/components/RoleShell';
import Colour from '@/constants/colour';
import { FontWeight } from '@/constants/typography';
import { useLayout } from '@/hooks/useLayout';

const NAV = [
  { label: 'Dashboard', href: '/home' },
  { label: 'Events', href: '/events' },
  { label: 'Staff', href: '/staffs' },
  { label: 'Live attendance', href: '/attendance' },
  { label: 'Reports', href: '/reports' },
  { label: 'Profile', href: '/profile' },
];

const noBar = { href: null, tabBarStyle: { display: 'none' as const } };

export default function OrganizerLayout() {
  const { isTablet } = useLayout();

  const tabs = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colour.primary,
        tabBarInactiveTintColor: Colour.inactiveTab,
        tabBarLabelStyle: { fontSize: 12, fontWeight: FontWeight.medium },
        tabBarStyle: { backgroundColor: Colour.white, borderTopWidth: 0, elevation: 8 },
      }}
      {...(isTablet ? { tabBar: () => null } : {})}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <HomeTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: ({ color }) => <EventsTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="staffs" options={{ title: 'Staffs', tabBarIcon: ({ color }) => <StaffTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="attendance" options={{ title: 'Attendance', tabBarIcon: ({ color }) => <AttendanceTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports', tabBarIcon: ({ color }) => <ReportsTabIcon color={String(color)} /> }} />
      <Tabs.Screen name="create-event" options={noBar} />
      <Tabs.Screen name="manage-event" options={noBar} />
      <Tabs.Screen name="attendance-history" options={noBar} />
      <Tabs.Screen name="profile" options={noBar} />
    </Tabs>
  );

  return <RoleShell role="organizer" items={NAV} navigator={tabs} />;
}
