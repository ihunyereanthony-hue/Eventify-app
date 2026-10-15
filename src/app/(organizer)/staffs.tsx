import React, { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons';
import PersonCard from '@/components/organizer/PersonCard';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { listStaff } from '@/services/staff';

export default function Staffs() {
  const staff = useAsync(listStaff, []);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (staff.data ?? []).filter((s) => !q || s.name.toLowerCase().includes(q));
  }, [staff.data, query]);

  let empty: React.ReactElement | null = null;
  if (staff.loading && !staff.data) empty = <LoadingView />;
  else if (staff.error) empty = <ErrorView error={staff.error} onRetry={staff.reload} />;
  else if (staff.data) empty = <EmptyView message="No staff yet." />;

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title} accessibilityRole="header">Events Staff Management</Text>
      </View>
      {adding ? (
        <View style={styles.search}>
          <SearchIcon />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search by name" placeholderTextColor={Colour.inputPlaceholder} accessibilityLabel="Search staff" style={styles.searchInput} />
        </View>
      ) : (
        <View style={styles.add}>
          <Button label="+ Add Staff" size="sm" onPress={() => setAdding(true)} />
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer padded={false} edges={['top', 'left', 'right']}>
      <FlatList
        data={rows}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={staff.loading && !!staff.data} onRefresh={staff.reload} tintColor={Colour.primary} />}
        renderItem={({ item, index }) => (
          <PersonCard
            name={item.name}
            sub={`${item.role ?? 'Event Staff'} . ${index + 1}`}
            pill={adding ? '+ Add Staff' : item.active ? 'Active' : 'Inactive'}
            // TODO(backend): inviting someone needs a route, until then say so instead of pretending
            onPillPress={adding ? () => Alert.alert('Not connected yet', "Adding staff isn't connected to the backend yet.") : undefined}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 28 },
  header: { gap: 16, marginBottom: 18 },
  titleRow: { paddingTop: 8 },
  title: { fontSize: 22, fontWeight: FontWeight.bold, color: Colour.ink },
  add: { alignSelf: 'flex-end', width: 150 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 16, borderRadius: 16, backgroundColor: Colour.field },
  searchInput: { flex: 1, fontSize: FontSize.body, color: Colour.ink },
});
