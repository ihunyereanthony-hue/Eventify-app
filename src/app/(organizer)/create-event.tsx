import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons';
import BackHeader from '@/components/organizer/BackHeader';
import FilledField from '@/components/organizer/FilledField';
import PersonCard from '@/components/organizer/PersonCard';
import { pickCsv, pickImage } from '@/components/organizer/pickFiles';
import PickerField from '@/components/organizer/PickerField';
import SegmentTabs from '@/components/organizer/SegmentTabs';
import UploadBox from '@/components/organizer/UploadBox';
import { ErrorView, LoadingView } from '@/components/StateViews';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { assignStaff, listStaff } from '@/services/staff';
import { createEvent, uploadCodes } from '@/services/organizer';
import type { PickedFile } from '@/types/organizer';
import { errorText } from '@/utils/errorText';

type Tab = 'details' | 'staff' | 'ticket';
const TABS: { key: Tab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'staff', label: 'Staff' },
  { key: 'ticket', label: 'Ticket' },
];
const ORDER: Tab[] = ['details', 'staff', 'ticket'];

// tomorrow at 10:00, a sane starting point so the pickers never open on "right now"
function defaultStart() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d;
}

export default function CreateEvent() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('details');
  const [name, setName] = useState('');
  const [date, setDate] = useState(defaultStart);
  const [time, setTime] = useState(defaultStart);
  const [venue, setVenue] = useState('');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState<PickedFile | null>(null);
  const [csv, setCsv] = useState<PickedFile | null>(null);
  const [staffIds, setStaffIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const staff = useAsync(listStaff, []);
  const shownStaff = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (staff.data ?? []).filter((s) => !q || s.name.toLowerCase().includes(q));
  }, [staff.data, query]);

  const last = tab === 'ticket';

  const next = () => {
    if (tab === 'details' && (!name.trim() || !venue.trim())) {
      setError('Event name and location are required.');
      return;
    }
    setError(null);
    if (!last) setTab(ORDER[ORDER.indexOf(tab) + 1]);
    else void submit();
  };

  const submit = async () => {
    // the date box and the time box are separate pickers, glue them into one moment
    const start = new Date(date);
    start.setHours(time.getHours(), time.getMinutes(), 0, 0);

    setBusy(true);
    setError(null);
    try {
      const created = await createEvent({ name: name.trim(), startsAt: start.toISOString(), venue: venue.trim(), description: about.trim(), image });
      const problems: string[] = [];

      if (csv) {
        if (!created.id) problems.push("the ticket codes (the server didn't say which event was created)");
        else await uploadCodes(created.id, csv).catch(() => problems.push('the ticket codes'));
      }
      if (staffIds.length) {
        if (!created.id) problems.push('the staff');
        else await assignStaff(created.id, staffIds).catch(() => problems.push('the staff'));
      }
      if (problems.length) Alert.alert('Event created', `The event is saved, but ${problems.join(' and ')} couldn't be added. You can add them from the event page.`);
      router.replace('/events' as any);
    } catch (e) {
      setError(errorText(e));
      setTab('details');
    } finally {
      setBusy(false);
    }
  };

  const toggleStaff = (id: string) => setStaffIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <ScreenContainer>
      <BackHeader title="Create New Event" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SegmentTabs tabs={TABS} value={tab} onChange={setTab} />

        {tab === 'details' && (
          <View style={styles.form}>
            <Text style={styles.section}>Event Information</Text>
            <FilledField label="Event Name" value={name} onChangeText={setName} placeholder="Tech & Creators Summit 2026" />
            <View style={styles.pair}>
              <PickerField label="Date" mode="date" value={date} onChange={setDate} />
              <PickerField label="Time" mode="time" value={time} onChange={setTime} />
            </View>
            <FilledField label="Event Location" value={venue} onChangeText={setVenue} placeholder="Eko Conventional Center, V.I, Lagos" />
            <FilledField label="About Event" value={about} onChangeText={setAbout} placeholder="Tell us about your event" multiline />
            <View style={styles.imageRow}>
              <View style={styles.flex}>
                <Button label={image ? 'Change image' : 'Upload image'} variant="outline" size="sm" onPress={async () => setImage((await pickImage()) ?? image)} />
              </View>
              {image && <Image source={{ uri: image.uri }} style={styles.thumb} accessibilityLabel="Selected cover image" />}
            </View>
          </View>
        )}

        {tab === 'staff' && (
          <View style={styles.form}>
            <View style={styles.search}>
              <SearchIcon />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search by name" placeholderTextColor={Colour.inputPlaceholder} accessibilityLabel="Search staff" style={styles.searchInput} />
            </View>
            {staff.loading && !staff.data ? (
              <LoadingView />
            ) : staff.error ? (
              <>
                <ErrorView error={staff.error} onRetry={staff.reload} />
                <Text style={styles.hint}>You can skip this step and add staff to the event later.</Text>
              </>
            ) : (
              shownStaff.map((s) => (
                <PersonCard key={s.id} name={s.name} sub={s.active ? 'Active' : 'Inactive'} pill={staffIds.includes(s.id) ? 'Added' : '+ Add Staff'} onPillPress={() => toggleStaff(s.id)} />
              ))
            )}
          </View>
        )}

        {tab === 'ticket' && (
          <View style={styles.form}>
            <Text style={styles.sectionLight}>Upload/Manage Ticket Codes</Text>
            <UploadBox fileName={csv?.name} onPick={async () => setCsv((await pickCsv()) ?? csv)} />
            <Text style={styles.hint}>The codes go up when you tap Done. You can also add them later from the event page.</Text>
          </View>
        )}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Button label={last ? 'Done' : 'Next'} onPress={next} loading={busy} />
        <Text style={styles.cancel} onPress={() => router.back()} accessibilityRole="button">Cancel</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 20, paddingBottom: 12, gap: 22 },
  form: { gap: 18 },
  section: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.ink },
  sectionLight: { fontSize: FontSize.large, color: Colour.ink },
  pair: { flexDirection: 'row', gap: 14 },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  thumb: { width: 56, height: 56, borderRadius: 12 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, paddingHorizontal: 16, borderRadius: 16, backgroundColor: Colour.field },
  searchInput: { flex: 1, fontSize: FontSize.body, color: Colour.ink },
  hint: { fontSize: FontSize.small, color: Colour.textMuted, textAlign: 'center' },
  error: { fontSize: FontSize.small, color: Colour.errorText },
  footer: { paddingTop: 10, paddingBottom: 14, gap: 14 },
  cancel: { alignSelf: 'center', fontSize: FontSize.body, color: Colour.primary, paddingVertical: 4 },
});
