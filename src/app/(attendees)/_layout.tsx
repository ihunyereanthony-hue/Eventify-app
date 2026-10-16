import { Stack } from 'expo-router';
import React from 'react';
export default function AttendeesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
      <Stack.Screen name="event-landing" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="verify-ticket" />
      <Stack.Screen name="verify-ticket-incorrect" />
      <Stack.Screen name="verify-ticket-correct" />
      <Stack.Screen name="verify-ticket-success" />
      <Stack.Screen name="qr-code" />
      <Stack.Screen name="get-direction" />
      <Stack.Screen name="my-details" />
      <Stack.Screen name="event-details" />
    </Stack>
  );
}
