import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#FFFFFF' } }}>
      {/* Splash, then onboarding 1 to 5 */}
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding1" />
      <Stack.Screen name="onboarding2" />
      <Stack.Screen name="onboarding3" />
      <Stack.Screen name="onboarding4" />
      <Stack.Screen name="onboarding5" />

      {/* Route groups: each has its own _layout.tsx */}
      <Stack.Screen name="(attendees)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(staff)" />
      <Stack.Screen name="(organizer)" />
    </Stack>
  );
}
