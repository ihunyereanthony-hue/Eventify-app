import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthShell from '@/components/AuthShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { register } from '@/services/auth';
import { errorText } from '@/utils/errorText';

export default function Register() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    if (!f.firstName.trim() || !f.lastName.trim() || !f.email.trim()) return setError('Fill in every field.');
    if (f.password.length < 8) return setError('Password needs at least 8 characters.');
    if (f.password !== f.confirm) return setError("Passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      const email = f.email.trim();
      const res: any = await register({
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email,
        password: f.password,
        role: role === 'organizer' ? 'organizer' : 'staff',
      });
      router.replace({ pathname: '/verify-code' as any, params: { email, tempToken: res?.tempToken ?? '' } });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Get started with Eventify and make your events organised">
      <TextField label="First name" value={f.firstName} onChangeText={set('firstName')} placeholder="Enter your first name" />
      <TextField label="Last name" value={f.lastName} onChangeText={set('lastName')} placeholder="Enter your last name" />
      <TextField label="Email address" value={f.email} onChangeText={set('email')} placeholder="Enter a valid email address" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <TextField label="Password" value={f.password} onChangeText={set('password')} placeholder="At least 8 characters" secureTextEntry />
      <TextField label="Confirm password" value={f.confirm} onChangeText={set('confirm')} placeholder="Enter your password again" secureTextEntry />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Create account" onPress={submit} loading={busy} />
      <Text style={styles.login} onPress={() => router.replace('/login' as any)} accessibilityRole="link">
        Already have an account? Log in
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  error: { fontSize: FontSize.small, color: Colour.errorText },
  login: { textAlign: 'center', fontSize: FontSize.small, color: Colour.textLink },
});
