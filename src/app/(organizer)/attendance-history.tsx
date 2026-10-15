import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import BackHeader from '@/components/organizer/BackHeader';
import PickerField from '@/components/organizer/PickerField';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer, StatusBadge } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { fetchAttendance } from '@/services/attendance';
import type { CheckIn } from '@/types/checkIn';
import { formatTime, sameDay } from '@/utils/formatDate';

const LABEL = { confirmed: 'Active', duplicate: 'Duplicate', declined: 'Invalid' } as const;
const BADGE = { confirmed: 'confirmed', duplicate: 'duplicate', declined: 'invalid' } as const;

// a name like  Ada, "Jr"  would break the CSV, so quote anything with a comma or quote in it
const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export default function AttendanceHistory() {
  const { eventId, eventName } = useLocalSearchParams<{ eventId: string; eventName?: string }>();
  const att = useAsync(() => fetchAttendance(String(eventId)), [eventId]);
  const [picked, setPicked] = useState<Date | null>(null);

  // until someone picks a day, show the day of the latest scan (that's where the data is)
  const day = picked ?? (att.data?.records[0] ? new Date(att.data.records[0].scannedAt) : new Date());
  const rows: CheckIn[] = useMemo(
    () => (att.data?.records ?? []).filter((r) => sameDay(new Date(r.scannedAt), day)),
    [att.data, day],
  );

  const exportCsv = async () => {
    const lines = ['Name,Ticket,Time,Status', ...rows.map((r) => [r.attendeeName, r.ticketCode, r.scannedAt, LABEL[r.status]].map(esc).join(','))];
    try {
      await Share.share({ title: `${eventName ?? 'Event'} attendance`, message: lines.join('\n') });
    } catch {
      Alert.alert('Could not export', 'Try again in a moment.');
    }
  };

  let body: React.ReactElement;
  if (att.loading && !att.data) body = <LoadingView />;
  else if (att.error) body = <ErrorView error={att.error} onRetry={att.reload} />;
  else
    body = (
      <>
        <PickerField label="Date" mode="date" value={day} onChange={setPicked} />
        <View>
          <View style={[styles.row, styles.headRow]}>
            <Text style={[styles.head, styles.cName]}>Name</Text>
            <Text style={[styles.head, styles.cTime]}>Time</Text>
            <Text style={[styles.head, styles.cStatus]}>Status</Text>
          </View>
          {rows.map((r) => (
            <View key={r.id} style={styles.row}>
              <Text style={[styles.cell, styles.cName]} numberOfLines={1}>{r.attendeeName || r.ticketCode}</Text>
              <Text style={[styles.cell, styles.cTime]}>{formatTime(r.scannedAt)}</Text>
              <View style={styles.cStatus}>
                <StatusBadge status={BADGE[r.status]} label={LABEL[r.status]} />
              </View>
            </View>
          ))}
          {rows.length === 0 && <EmptyView message="No check-ins on this day." />}
        </View>
      </>
    );

  return (
    <ScreenContainer>
      <BackHeader title="Attendance History" />
      <ScrollView contentContainerStyle={styles.content}>{body}</ScrollView>
      <View style={styles.footer}>
        <Button label="Export Results" onPress={exportCsv} disabled={rows.length === 0} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 22, paddingBottom: 12, gap: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderStyle: 'dotted', borderColor: Colour.ink },
  headRow: { paddingTop: 0 },
  head: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colour.ink },
  cell: { fontSize: FontSize.body, color: Colour.ink },
  cName: { flex: 1.3 },
  cTime: { flex: 1 },
  cStatus: { flex: 1, alignItems: 'flex-end' },
  footer: { paddingVertical: 14 },
});
