import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash Screen */}
      <Stack.Screen name="index" />
      
      {/* Loads the entire attendees stack from app/attendees/_layout.tsx */}
      <Stack.Screen name="(attendees)" />
      {/* Loads the staff stack from app/(staff)/_layout.tsx: dashboard, scanner, scan result, check-ins */}
      <Stack.Screen name="(staff)" />
    </Stack>

  );
}