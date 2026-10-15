import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import EventSwitcher from '@/components/organizer/EventSwitcher';
import { CalendarBox } from '@/components/organizer/organizerIcons';
import StatTile from '@/components/organizer/StatTile';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { listAssignedEvents } from '@/services/events';
import { getEventReport } from '@/services/organizer';
import { formatDayLong } from '@/utils/formatDate';

export default function Reports() {
  const events = useAsync(listAssignedEvents, []);
  const [picked, setPicked] = useState<string | null>(null);
  const eventId = picked ?? events.data?.find((e) => e.isLive)?.id ?? events.data?.[0]?.id ?? null;
  const current = events.data?.find((e) => e.id === eventId);
  const report = useAsync(async () => (eventId ? getEventReport(eventId) : null), [eventId]);

  const r = report.data;
  const pct = r && r.registered > 0 ? Math.round((r.checkedIn / r.registered) * 100) : 0;
  const biggest = r ? Math.max(1, ...r.byType.map((t) => t.count)) : 1;

  let body: React.ReactElement;
  if (events.loading && !events.data) body = <LoadingView />;
  else if (events.error) body = <ErrorView error={events.error} onRetry={events.reload} />;
  else if (!eventId) body = <EmptyView message="Create an event to see reports." />;
  else if (report.error) body = <ErrorView error={report.error} onRetry={report.reload} />;
  else if (!r) body = <LoadingView />;
  else
    body = (
      <>
        {!!current && (
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{formatDayLong(new Date(current.startsAt))}</Text>
            <CalendarBox />
          </View>
        )}
        <View style={styles.tiles}>
          <StatTile tone="soft" label="Total Registered" value={String(r.registered)} />
          <StatTile tone="soft" label="Checked-in" value={`${r.checkedIn} (${pct}%)`} />
        </View>

        <Text style={styles.section}>Registrations by Ticket type</Text>
        <View style={styles.card}>
          {r.byType.length === 0 ? (
            <Text style={styles.note}>Ticket types aren't in the codes data yet, so there's nothing to split.</Text>
          ) : (
            r.byType.map((t) => (
              <View key={t.label} style={styles.barRow}>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${(t.count / biggest) * 100}%` }]}>
                    <Text style={styles.barLabel} numberOfLines={1}>{t.label}</Text>
                  </View>
                </View>
                <Text style={styles.count}>{t.count}</Text>
              </View>
            ))
          )}
        </View>
      </>
    );

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} accessibilityRole="header">Reports</Text>
        <EventSwitcher events={events.data ?? []} selectedId={eventId} onSelect={setPicked} />
        {body}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 20, gap: 22 },
  title: { fontSize: 24, fontWeight: FontWeight.bold, color: Colour.ink },
  dateBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 18, borderRadius: 16, backgroundColor: Colour.field },
  dateText: { fontSize: FontSize.body, color: Colour.ink },
  tiles: { flexDirection: 'row', gap: 16 },
  section: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.ink },
  card: { padding: 20, gap: 14, borderRadius: 28, backgroundColor: Colour.lavender },
  note: { fontSize: FontSize.small, color: Colour.primaryDark },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  track: { flex: 1, height: 30, borderRadius: 4, backgroundColor: Colour.hairline, overflow: 'hidden' },
  fill: { height: '100%', minWidth: 64, backgroundColor: Colour.ink, justifyContent: 'center', paddingHorizontal: 8 },
  barLabel: { fontSize: FontSize.caption, color: Colour.white },
  count: { minWidth: 36, textAlign: 'right', fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.primary },
});
