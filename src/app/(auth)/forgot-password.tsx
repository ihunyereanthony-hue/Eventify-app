import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import AuthShell from '@/components/AuthShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';
import { forgotPassword } from '@/services/auth';
import { ApiError } from '@/services/errors';
import { errorText } from '@/utils/errorText';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim()) return setError('Enter your email address.');
    setBusy(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      router.push({ pathname: '/verify-reset-code' as any, params: { email: email.trim() } });
    } catch (e) {
      // a 4xx (unknown email, say) still moves on so this screen can't be used to
      // probe who has an account. Dead connection or a 5xx stops here.
      if (e instanceof ApiError && e.status < 500) router.push({ pathname: '/verify-reset-code' as any, params: { email: email.trim() } });
      else setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Forgot password?" subtitle="Enter your email and we'll send you a code to reset it">
      <TextField label="Email address" value={email} onChangeText={setEmail} placeholder="Enter your email address" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Send code" onPress={submit} loading={busy} />
      <Text style={styles.back} onPress={() => router.back()} accessibilityRole="link">Back to log in</Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  error: { fontSize: FontSize.small, color: Colour.errorText },
  back: { textAlign: 'center', fontSize: FontSize.small, color: Colour.textLink },
});
