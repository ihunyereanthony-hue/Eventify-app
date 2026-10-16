import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ResultBadge } from '@/components/icons';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import type { ScanStatus } from '@/types/checkIn';
import { formatTime } from '@/utils/formatDate';

const COPY: Record<ScanStatus, { title: string; message: string }> = {
  confirmed: { title: 'Check-in successful!', message: 'Attendee verified and checked in.' },
  duplicate: { title: 'Duplicate ticket', message: 'This ticket has already been scanned.' },
  invalid: { title: 'Invalid ticket', message: 'This code is not valid for this event.' },
};
const asStatus = (v?: string): ScanStatus => (v === 'confirmed' || v === 'duplicate' ? v : 'invalid');

export default function ScanResult() {
  const router = useRouter();
  const p = useLocalSearchParams<{ status?: string; name?: string; code?: string; time?: string }>();
  const status = asStatus(p.status);
  const copy = COPY[status];
  const time = p.time ? formatTime(p.time) : '';
  const hasDetails = !!(p.name || p.code || time);

  return (
    <ScreenContainer scroll>
      <View style={styles.center}>
        <ResultBadge status={status} />
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.message}>{copy.message}</Text>

        {status !== 'invalid' && hasDetails && (
          <View style={styles.card}>
            {!!p.name && <Text style={styles.name}>{p.name}</Text>}
            {!!p.code && <Text style={styles.line}>{`Ticket: ${p.code}`}</Text>}
            {/* for a duplicate this is when they FIRST got in */}
            {!!time && <Text style={styles.line}>{`Checked in: ${time}`}</Text>}
          </View>
        )}

        <View style={styles.actions}>
          <Button label="Scan next" onPress={() => router.back()} />
          <Button label="Back" variant="outline" onPress={() => router.replace('/dashboard' as any)} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, width: '100%', maxWidth: 420, alignSelf: 'center' },
  title: { marginTop: 22, fontSize: 24, fontWeight: FontWeight.semibold, color: Colour.textHeading, textAlign: 'center' },
  message: { marginTop: 6, fontSize: FontSize.small, color: Colour.textTan, textAlign: 'center' },
  card: { marginTop: 28, alignSelf: 'stretch', padding: 18, borderRadius: 20, backgroundColor: Colour.cardFilled },
  name: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.textOnPrimary },
  line: { marginTop: 4, fontSize: FontSize.small, color: Colour.textOnPrimary },
  actions: { marginTop: 32, alignSelf: 'stretch', gap: 12 },
});
