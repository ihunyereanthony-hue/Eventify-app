import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthShell from '@/components/AuthShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { confirmResetPassword } from '@/services/auth';
import { errorText } from '@/utils/errorText';

export default function ResetPassword() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email?: string; code?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (password.length < 8) return setError('Password needs at least 8 characters.');
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      await confirmResetPassword(String(email ?? ''), String(code ?? ''), password);
      router.replace({ pathname: '/login' as any, params: { reset: '1' } });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Pick something you haven't used before">
      <TextField label="New password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
      <TextField label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Enter it again" secureTextEntry />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Change password" onPress={submit} loading={busy} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({ error: { fontSize: FontSize.small, color: Colour.errorText } });
