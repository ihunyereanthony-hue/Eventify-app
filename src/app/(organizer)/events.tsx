import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EventCoverCard from '@/components/organizer/EventCoverCard';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { useLayout } from '@/hooks/useLayout';
import { listAssignedEvents } from '@/services/events';

export default function OrganizerEvents() {
  const router = useRouter();
  const { columns } = useLayout();
  const events = useAsync(listAssignedEvents, []);

  const sorted = useMemo(
    () => [...(events.data ?? [])].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    [events.data],
  );

  let empty: React.ReactElement | null = null;
  if (events.loading && !events.data) empty = <LoadingView />;
  else if (events.error) empty = <ErrorView error={events.error} onRetry={events.reload} />;
  else if (events.data) empty = <EmptyView message="No events yet. Create your first one." />;

  const header = (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">Events</Text>
      <View style={styles.cta}>
        <Button label="Create Event" size="sm" onPress={() => router.push('/create-event' as any)} />
      </View>
    </View>
  );

  return (
    <ScreenContainer padded={false} edges={['top', 'left', 'right']}>
      <FlatList
        key={columns}
        numColumns={columns}
        data={sorted}
        keyExtractor={(e) => e.id}
        contentContainerStyle={[styles.content, columns > 1 && { paddingHorizontal: 13 }]}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={events.loading && !!events.data} onRefresh={events.reload} tintColor={Colour.primary} />}
        renderItem={({ item }) => (
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: FontWeight.bold, color: Colour.ink },
  cta: { width: 150 },
});
