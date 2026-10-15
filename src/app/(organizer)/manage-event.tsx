import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarSmall, PinSmall } from '@/components/icons';
import BackHeader from '@/components/organizer/BackHeader';
import ConfirmModal from '@/components/organizer/ConfirmModal';
import { TicketIcon } from '@/components/organizer/organizerIcons';
import PersonCard from '@/components/organizer/PersonCard';
import { pickCsv } from '@/components/organizer/pickFiles';
import SegmentTabs from '@/components/organizer/SegmentTabs';
import UploadBox from '@/components/organizer/UploadBox';
import { EmptyView, ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer } from '@/components/ui';
import { Images } from '@/constants/assets';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { listAssignedEvents } from '@/services/events';
import { deleteAllCodes, listCodes, uploadCodes } from '@/services/organizer';
import { listEventStaff } from '@/services/staff';
import { errorText } from '@/utils/errorText';
import { formatLongDate } from '@/utils/formatDate';

type Tab = 'overview' | 'staff' | 'tickets';
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'staff', label: 'Staff' },
  { key: 'tickets', label: 'Tickets' },
];

function StaffTab({ eventId }: { eventId: string }) {
  const staff = useAsync(() => listEventStaff(eventId), [eventId]);
  if (staff.loading && !staff.data) return <LoadingView />;
  if (staff.error) return <ErrorView error={staff.error} onRetry={staff.reload} />;
  if (!staff.data?.length) return <EmptyView message="No staff on this event yet." />;
  return (
    <View style={styles.stack}>
      {staff.data.map((s, i) => (
        <PersonCard key={s.id} name={s.name} sub={`${s.role ?? 'Event Staff'} . ${i + 1}`} pill={s.active ? 'Active' : 'Inactive'} />
      ))}
    </View>
  );
}

function TicketsTab({ eventId }: { eventId: string }) {
  const codes = useAsync(() => listCodes(eventId), [eventId]);
  const [busy, setBusy] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);

  const upload = async () => {
    const file = await pickCsv();
    if (!file) return;
    setBusy(true);
    try {
      await uploadCodes(eventId, file);
      codes.reload();
    } catch (e) {
      Alert.alert('Upload failed', errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const wipe = async () => {
    setConfirmWipe(false);
    setBusy(true);
    try {
      await deleteAllCodes(eventId);
      codes.reload();
    } catch (e) {
      Alert.alert('Could not delete', errorText(e));
    } finally {
      setBusy(false);
    }
  };

  // one row per ticket type when the codes carry one, otherwise a single "All codes" row
  const list = codes.data ?? [];
  const groups = new Map<string, { count: number; used: number }>();
  list.forEach((c) => {
    const g = groups.get(c.ticketType ?? 'All codes') ?? { count: 0, used: 0 };
    g.count += 1;
    if (c.used) g.used += 1;
    groups.set(c.ticketType ?? 'All codes', g);
  });

  return (
    <View style={styles.stack}>
      <UploadBox onPick={upload} busy={busy} />
      <Text style={styles.sectionLight}>Uploaded Ticket</Text>
      {codes.loading && !codes.data ? (
        <LoadingView />
      ) : codes.error ? (
        <ErrorView error={codes.error} onRetry={codes.reload} />
      ) : groups.size === 0 ? (
        <EmptyView message="No ticket codes yet." />
      ) : (
        <View style={styles.box}>
          {[...groups].map(([label, g]) => (
            <View key={label} style={styles.codeRow}>
              <TicketIcon />
              <View style={styles.flex}>
                <Text style={styles.codeTitle}>{label}</Text>
                <Text style={styles.codeSub}>{`${g.count} tickets . ${g.used} used`}</Text>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      {list.length > 0 && (
        <Pressable onPress={() => setConfirmWipe(true)} accessibilityRole="button" hitSlop={8} style={styles.wipe}>
          <Text style={styles.wipeText}>Delete all codes</Text>
        </Pressable>
      )}
      <ConfirmModal visible={confirmWipe} message="Delete every ticket code for this event? This can't be undone." confirmLabel="Delete all" onCancel={() => setConfirmWipe(false)} onConfirm={wipe} />
    </View>
  );
}

export default function EventDetails() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const id = String(eventId);
  const [tab, setTab] = useState<Tab>('overview');
  // the doc has no "get one event" route, so we take it from the list
  const event = useAsync(async () => (await listAssignedEvents()).find((e) => e.id === id) ?? null, [id]);
  const e = event.data;

  // TODO(backend): needs PUT /events/:id, then this opens the create form pre-filled
  const onEdit = () => Alert.alert('Not connected yet', "Editing an event isn't connected to the backend yet.");

  return (
    <ScreenContainer>
      <BackHeader title="Event Details" />
      {event.loading && !e ? (
        <LoadingView />
      ) : event.error ? (
        <ErrorView error={event.error} onRetry={event.reload} />
      ) : !e ? (
        <EmptyView message="This event isn't in the list any more." />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <Image source={e.imageUrl ? { uri: e.imageUrl } : Images.eventFallback} style={styles.cover} accessibilityLabel={`${e.name} cover`} />
            <View style={styles.stack}>
              <Text style={styles.title}>{e.name}</Text>
              <View style={styles.meta}>
                <CalendarSmall size={18} color={Colour.ink} />
                <Text style={styles.metaText}>{formatLongDate(e.startsAt)}</Text>
              </View>
              {!!e.venue && (
                <View style={styles.meta}>
                  <PinSmall size={18} color={Colour.ink} />
                  <Text style={styles.metaText}>{e.venue}</Text>
                </View>
              )}
            </View>

            <SegmentTabs tabs={TABS} value={tab} onChange={setTab} />

            {tab === 'overview' && (
              <View style={styles.stack}>
                <Text style={styles.section}>About Event</Text>
                <Text style={styles.about}>{e.description || 'No description added yet.'}</Text>
              </View>
            )}
            {tab === 'staff' && <StaffTab eventId={id} />}
            {tab === 'tickets' && <TicketsTab eventId={id} />}
          </ScrollView>
          {tab === 'overview' && (
            <View style={styles.footer}>
              <Button label="Edit Details" onPress={onEdit} />
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 18, paddingBottom: 16, gap: 18 },
  stack: { gap: 12 },
  cover: { width: '100%', height: 190, borderRadius: 18, backgroundColor: Colour.lavender },
  title: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaText: { flex: 1, fontSize: FontSize.body, color: Colour.ink },
  section: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.ink },
  about: { fontSize: FontSize.small, lineHeight: 22, color: Colour.ink },
  sectionLight: { marginTop: 6, fontSize: FontSize.large, color: Colour.ink },
  box: { borderRadius: 26, borderWidth: 1.5, borderColor: Colour.primary, paddingHorizontal: 16 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderStyle: 'dotted', borderColor: Colour.ink },
  codeTitle: { fontSize: FontSize.small, fontWeight: FontWeight.semibold, color: Colour.primary },
  codeSub: { marginTop: 2, fontSize: FontSize.small, color: Colour.primary },
  activePill: { paddingHorizontal: 18, height: 42, borderRadius: 999, borderWidth: 1.5, borderColor: Colour.primary, alignItems: 'center', justifyContent: 'center' },
  activeText: { fontSize: FontSize.small, color: Colour.primary },
  wipe: { alignSelf: 'center', paddingVertical: 8 },
  wipeText: { fontSize: FontSize.small, color: Colour.statusInvalidText },
  footer: { paddingVertical: 14 },
});
