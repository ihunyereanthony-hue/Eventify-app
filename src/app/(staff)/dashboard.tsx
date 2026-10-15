import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import EventCard from '@/components/EventCard';
import StaffHeader from '@/components/staff/StaffHeader';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { useLayout } from '@/hooks/useLayout';
import { listAssignedEvents } from '@/services/events';
import { getStaffProfile } from '@/services/profile';
import type { StaffEvent } from '@/types/event';

export default function StaffDashboard() {
  const router = useRouter();
  const { isTablet, columns } = useLayout();
  const events = useAsync(listAssignedEvents, []);
  const profile = useAsync(getStaffProfile, []);

  const openScanner = (e: StaffEvent) =>
    router.push({ pathname: '/scanner' as any, params: { eventId: e.id, eventName: e.name, isLive: e.isLive ? '1' : '0' } });
  const openCheckIns = (e: StaffEvent) =>
    router.push({ pathname: '/check-ins' as any, params: { eventId: e.id, eventName: e.name } });

  // greeting still shows if only the profile call fails, just without the name
  const header = (
    <View>
      <StaffHeader fullName={profile.data?.fullName ?? null} showLogo={!isTablet} onProfilePress={() => router.push('/settings' as any)} />
      <Text style={styles.section}>Select events</Text>
    </View>
  );

  let empty: React.ReactElement | null = null;
  if (events.loading && !events.data) empty = <LoadingView />;
  else if (events.error) empty = <ErrorView error={events.error} onRetry={events.reload} />;
  else if (events.data && events.data.length === 0) empty = <EmptyView message="No events yet." />;

  return (
    <ScreenContainer padded={false}>
      <FlatList
        // numColumns can't change on a live list, so the key forces a remount on rotate
        key={columns}
        numColumns={columns}
        data={events.data ?? []}
        keyExtractor={(e) => e.id}
        contentContainerStyle={[styles.content, columns > 1 && styles.contentWide]}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={events.loading && !!events.data} onRefresh={events.reload} tintColor={Colour.primary} />}
        renderItem={({ item }) => (
          // margin instead of gap so an odd last card doesn't stretch across the row
          <View style={{ width: `${100 / columns}%`, paddingHorizontal: columns > 1 ? 7 : 0 }}>
            <EventCard
              event={item}
              primary={{ label: 'Scan QR', onPress: () => openScanner(item) }}
              secondary={{ label: 'Check-ins', onPress: () => openCheckIns(item) }}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  contentWide: { paddingHorizontal: 13 },
  section: { marginTop: 18, marginBottom: 12, fontSize: FontSize.small, color: Colour.textTan },
  gap: { height: 14 },
});
