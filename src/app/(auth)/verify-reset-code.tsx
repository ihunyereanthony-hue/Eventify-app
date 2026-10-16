import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import AuthShell from '@/components/AuthShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { verifyResetCode } from '@/services/auth';
import { errorText } from '@/utils/errorText';

export default function VerifyResetCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!code.trim()) return setError('Enter the code we emailed you.');
    setBusy(true);
    setError(null);
    try {
      await verifyResetCode(String(email ?? ''), code.trim());
      router.replace({ pathname: '/reset-password' as any, params: { email: String(email ?? ''), code: code.trim() } });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Check your email" subtitle={email ? `Enter the code we sent to ${email}` : 'Enter the code we sent you'}>
      <TextField label="Reset code" value={code} onChangeText={setCode} placeholder="Enter the code" keyboardType="number-pad" autoCorrect={false} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Continue" onPress={submit} loading={busy} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({ error: { fontSize: FontSize.small, color: Colour.errorText } });
