import React from 'react';
import RoleShell from '@/components/RoleShell';

const NAV = [
  { label: 'My events', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
];

export default function StaffLayout() {
  return <RoleShell role="staff" items={NAV} />;
}
