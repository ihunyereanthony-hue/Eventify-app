import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import EventSwitcher from '@/components/organizer/EventSwitcher';
import PersonCard from '@/components/organizer/PersonCard';
import ProgressRing from '@/components/organizer/ProgressRing';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { fetchAttendance } from '@/services/attendance';
import { listAssignedEvents } from '@/services/events';
import { formatTime } from '@/utils/formatDate';

const SUB = { confirmed: 'Checked in', duplicate: 'Duplicate scan', declined: 'Declined' } as const;

export default function LiveAttendance() {
  const router = useRouter();
  const events = useAsync(listAssignedEvents, []);
  const [picked, setPicked] = useState<string | null>(null);
  const eventId = picked ?? events.data?.find((e) => e.isLive)?.id ?? events.data?.[0]?.id ?? null;
  const current = events.data?.find((e) => e.id === eventId);
  const att = useAsync(async () => (eventId ? fetchAttendance(eventId) : null), [eventId]);
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  useEffect(() => {
    if (!focused || !eventId) return;
    const t = setInterval(att.reload, 15000);
    return () => clearInterval(t);
  }, [focused, eventId, att.reload]);

  const checkedIn = att.data?.checkedIn ?? 0;
  const total = att.data?.total ?? 0;
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  let body: React.ReactElement;
  if (events.loading && !events.data) body = <LoadingView />;
  else if (events.error) body = <ErrorView error={events.error} onRetry={events.reload} />;
  else if (!eventId) body = <EmptyView message="Create an event to see attendance." />;
  else if (att.error && !att.data) body = <ErrorView error={att.error} onRetry={att.reload} />;
  else
    body = (
      <>
        <ProgressRing value={checkedIn} total={total} />
        <Text style={styles.pct}>{`${pct}% of total attendees`}</Text>

        <View style={styles.toggle}>
          <View style={[styles.pill, styles.pillOn]}>
            <Text style={[styles.pillText, styles.pillTextOn]}>Live</Text>
          </View>
          <View style={styles.pillWrap}>
            <Button
              label="History"
              variant="outline"
              onPress={() => router.push({ pathname: '/attendance-history' as any, params: { eventId: String(eventId), eventName: current?.name ?? '' } })}
            />
          </View>
        </View>

        <View style={styles.list}>
          {(att.data?.records ?? []).slice(0, 20).map((r) => (
            <PersonCard key={r.id} name={r.attendeeName || r.ticketCode} sub={SUB[r.status]} pill={formatTime(r.scannedAt)} />
          ))}
          {att.data && att.data.records.length === 0 && <EmptyView message="Nobody has checked in yet." />}
        </View>
      </>
    );

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={att.loading && !!att.data} onRefresh={att.reload} tintColor={Colour.primary} />}
      >
        <Text style={styles.title} accessibilityRole="header">Live Attendance</Text>
        <EventSwitcher events={events.data ?? []} selectedId={eventId} onSelect={setPicked} />
        {body}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 20, gap: 22 },
  title: { fontSize: 24, fontWeight: FontWeight.bold, color: Colour.ink },
  pct: { textAlign: 'center', fontSize: FontSize.large, color: Colour.textMuted },
  toggle: { flexDirection: 'row', gap: 16 },
  pill: { flex: 1, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pillOn: { backgroundColor: Colour.primary },
  pillText: { fontSize: FontSize.body, fontWeight: FontWeight.medium },
  pillTextOn: { color: Colour.white },
  pillWrap: { flex: 1 },
  list: { gap: 14 },
});
