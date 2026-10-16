import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthShell from '@/components/AuthShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { verifyCode } from '@/services/auth';
import { errorText } from '@/utils/errorText';

export default function VerifyCode() {
  const router = useRouter();
  const { email, tempToken } = useLocalSearchParams<{ email?: string; tempToken?: string }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!code.trim()) return setError('Enter the code we emailed you.');
    setBusy(true);
    setError(null);
    try {
      await verifyCode(String(email ?? ''), code.trim(), String(tempToken ?? ''));
      router.replace({ pathname: '/login' as any, params: { verified: '1' } });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Verify your email" subtitle={email ? `We sent a code to ${email}` : 'Enter the code we sent you'}>
      <TextField label="Verification code" value={code} onChangeText={setCode} placeholder="Enter the code" keyboardType="number-pad" autoCorrect={false} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Verify" onPress={submit} loading={busy} />
    </AuthShell>
  );
}

const styles = StyleSheet.create({ error: { fontSize: FontSize.small, color: Colour.errorText } });
