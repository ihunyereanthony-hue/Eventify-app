import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EventCoverCard from '@/components/organizer/EventCoverCard';
import OrganizerHeader from '@/components/organizer/OrganizerHeader';
import StatTile from '@/components/organizer/StatTile';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { useLayout } from '@/hooks/useLayout';
import { listAssignedEvents } from '@/services/events';
import { getTotalCheckedIn } from '@/services/organizer';
import { useSession } from '@/services/session';
import { greetingForHour } from '@/utils/formatDate';

export default function OrganizerHome() {
  const router = useRouter();
  const { columns } = useLayout();
  const { session } = useSession();
  const events = useAsync(listAssignedEvents, []);
  // runs again whenever the event list changes, null until there's a list to add up
  const attended = useAsync(async () => (events.data ? getTotalCheckedIn(events.data) : null), [events.data]);

  const upcoming = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return (events.data ?? [])
      .filter((e) => new Date(e.startsAt) >= startOfToday)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [events.data]);

  const first = session?.user.fullName?.trim().split(/\s+/)[0];

  let empty: React.ReactElement | null = null;
  if (events.loading && !events.data) empty = <LoadingView />;
  else if (events.error) empty = <ErrorView error={events.error} onRetry={events.reload} />;
  else if (events.data) empty = <EmptyView message="No upcoming events." />;

  const header = (
    <View style={styles.header}>
      <OrganizerHeader />
      <View>
        <Text style={styles.hello}>{first ? `${greetingForHour(new Date().getHours())}, ${first}` : greetingForHour(new Date().getHours())}</Text>
        <Text style={styles.sub}>Here's what's happening with your events.</Text>
      </View>
      <View style={styles.tiles}>
        <StatTile label="Total events" value={events.data ? String(events.data.length) : '\u2013'} />
        <StatTile label="Total attendance" value={attended.data != null ? String(attended.data) : '\u2013'} />
      </View>
      <Text style={styles.section}>Upcoming Events</Text>
    </View>
  );

  return (
    <ScreenContainer padded={false} edges={['top', 'left', 'right']}>
      <FlatList
        key={columns}
        numColumns={columns}
        data={upcoming}
        keyExtractor={(e) => e.id}
        contentContainerStyle={[styles.content, columns > 1 && { paddingHorizontal: 13 }]}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={events.loading && !!events.data} onRefresh={events.reload} tintColor={Colour.primary} />}
        renderItem={({ item }) => (
          // padding instead of gap so an odd last card doesn't stretch across the row
          <View style={{ width: `${100 / columns}%`, paddingHorizontal: columns > 1 ? 7 : 0 }}>
            <EventCoverCard event={item} onPress={() => router.push({ pathname: '/manage-event' as any, params: { eventId: item.id } })} />
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 28 },
  header: { gap: 22, marginBottom: 16 },
  hello: { fontSize: 24, fontWeight: FontWeight.bold, color: Colour.ink },
  sub: { marginTop: 4, fontSize: FontSize.small, color: Colour.textMuted },
  tiles: { flexDirection: 'row', gap: 16 },
  section: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.ink },
});
