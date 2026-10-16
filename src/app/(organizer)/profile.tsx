import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackHeader from '@/components/organizer/BackHeader';
import ConfirmModal from '@/components/organizer/ConfirmModal';
import FilledField from '@/components/organizer/FilledField';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { logout } from '@/services/auth';
import { updateProfile } from '@/services/profile';
import { useSession } from '@/services/session';
import { errorText } from '@/utils/errorText';
import { getInitials } from '@/utils/initials';

export default function Profile() {
  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOut, setConfirmOut] = useState(false);

  const startEdit = () => {
    setName(user?.fullName ?? '');
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!name.trim()) return setError('Name can\'t be empty.');
    setBusy(true);
    setError(null);
    try {
      await updateProfile(name);
      setEditing(false);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer>
      <BackHeader
        title="Profile page"
        right={
          !editing ? (
            <Pressable onPress={startEdit} accessibilityRole="button" style={styles.chip}>
              <Text style={styles.chipText}>Edit profile</Text>
            </Pressable>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{getInitials(user?.fullName)}</Text>
        </View>

        <FilledField label="Full name" value={editing ? name : user?.fullName ?? ''} onChangeText={setName} readOnly={!editing} autoCapitalize="words" />
        <FilledField label="Email address" value={user?.email ?? ''} readOnly />
        {!!error && <Text style={styles.error}>{error}</Text>}

        {editing ? (
          <View style={styles.actions}>
            <Button label="Save" onPress={save} loading={busy} />
            <Button label="Cancel" variant="outline" onPress={() => setEditing(false)} />
          </View>
        ) : (
          <Pressable onPress={() => router.push('/forgot-password' as any)} accessibilityRole="button" style={styles.changePw}>
            <Text style={styles.changePwText}>Change password</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Logout" onPress={() => setConfirmOut(true)} />
      </View>

      <ConfirmModal
        visible={confirmOut}
        message="Are you sure you want to log out ?"
        confirmLabel="Log out"
        onCancel={() => setConfirmOut(false)}
        onConfirm={() => {
        setConfirmOut(false);
        void logout();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 28, paddingBottom: 12, gap: 20 },
  chip: { paddingHorizontal: 14, height: 32, borderRadius: 999, backgroundColor: Colour.lavender, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: FontSize.caption, color: Colour.primary },
  avatar: { alignSelf: 'center', width: 150, height: 150, borderRadius: 75, backgroundColor: Colour.lavender, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  initials: { fontSize: 52, fontWeight: FontWeight.bold, color: Colour.primary },
  error: { fontSize: FontSize.small, color: Colour.errorText },
  actions: { gap: 12 },
  changePw: { height: 56, borderRadius: 999, backgroundColor: Colour.lavender, justifyContent: 'center', paddingHorizontal: 24 },
  changePwText: { fontSize: FontSize.body, color: Colour.primary },
  footer: { paddingVertical: 14 },
});
