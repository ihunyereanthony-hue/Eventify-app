import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackChevron, SearchIcon } from '@/components/icons';
import CheckInRow, { CheckInTableHead } from '@/components/staff/CheckInRow';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { useLayout } from '@/hooks/useLayout';
import { listCheckIns } from '@/services/checkIns';
import type { CheckInStatus } from '@/types/checkIn';

type Filter = 'all' | CheckInStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Valid' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'declined', label: 'Declined' },
];

export default function CheckIns() {
  const router = useRouter();
  const { isTablet } = useLayout();
  const { eventId, eventName } = useLocalSearchParams<{ eventId: string; eventName?: string }>();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const list = useAsync(() => listCheckIns(String(eventId)), [eventId]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (list.data ?? []).filter(
      (c) =>
        (filter === 'all' || c.status === filter) &&
        (!q || c.attendeeName.toLowerCase().includes(q) || c.ticketCode.toLowerCase().includes(q)),
    );
  }, [list.data, filter, query]);

  let empty: React.ReactElement | null = null;
  if (list.loading && !list.data) empty = <LoadingView />;
  else if (list.error) empty = <ErrorView error={list.error} onRetry={list.reload} onBack={() => router.back()} />;
  else if (list.data) empty = <EmptyView message={list.data.length === 0 ? 'No check-ins yet.' : 'Nothing matches that.'} />;

  const header = (
    <View>
      <View style={styles.titleRow}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} style={styles.back}>
          <BackChevron />
        </Pressable>
        <View style={styles.flex}>
          <Text style={styles.title}>Check-in history</Text>
          {!!eventName && <Text style={styles.sub} numberOfLines={1}>{eventName}</Text>}
        </View>
      </View>

      <View style={styles.search}>
        <SearchIcon />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or ticket"
          placeholderTextColor={Colour.inputPlaceholder}
          accessibilityLabel="Search check-ins"
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.pills}>
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.pill, on && styles.pillOn]}>
              <Text style={[styles.pillText, on && styles.pillTextOn]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {isTablet && rows.length > 0 && <CheckInTableHead />}
    </View>
  );

  return (
    <ScreenContainer padded={false}>
      <FlatList
        data={rows}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={list.loading && !!list.data} onRefresh={list.reload} tintColor={Colour.primary} />}
        renderItem={({ item }) => <CheckInRow item={item} wide={isTablet} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colour.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  sub: { fontSize: FontSize.caption, color: Colour.textTan },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, paddingHorizontal: 14, height: 48, borderWidth: 1.5, borderColor: Colour.border, borderRadius: 14 },
  searchInput: { flex: 1, fontSize: FontSize.body, color: Colour.textHeading },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, marginBottom: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: Colour.border },
  pillOn: { backgroundColor: Colour.ink, borderColor: Colour.ink },
  pillText: { fontSize: 13, color: Colour.textHeading },
  pillTextOn: { color: Colour.white },
});
