import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Splash' }} />
      <Stack.Screen name="(attendees)/event-landing" options={{ title: 'Event Landing' }} />
      <Stack.Screen name="(attendees)/create-account" options={{ title: 'Create Account' }} />
      <Stack.Screen name="(attendees)/verify-ticket" options={{ title: 'Verify Ticket' }} />
      <Stack.Screen name="(attendees)/verify-ticket-incorrect" options={{ title: 'Verify Ticket Incorrect' }} />
      <Stack.Screen name="(attendees)/verify-ticket-correct" options={{ title: 'Verify Ticket Correct' }} />
      <Stack.Screen name="(attendees)/verify-ticket-success" options={{ title: 'Verify Ticket Success' }} />
      <Stack.Screen name="(attendees)/qr-code" options={{ title: 'QR Code' }} />
      <Stack.Screen name="(attendees)/get-directions" options={{ title: 'Get Directions' }} />
      <Stack.Screen name="(attendees)/my-details" options={{ title: 'My Details' }} />
      <Stack.Screen name="(attendees)/event-details" options={{ title: 'Event Details' }} />
    </Stack>
  );
}