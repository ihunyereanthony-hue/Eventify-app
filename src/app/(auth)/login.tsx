import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AuthShell from '@/components/AuthShell';
import { HOME } from '@/components/RoleShell';
import { Button, TextField } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { login } from '@/services/auth';
import { errorText } from '@/utils/errorText';

export default function Login() {
  const router = useRouter();
  const { verified, reset } = useLocalSearchParams<{ verified?: string; reset?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notice = reset === '1' ? 'Password changed. Log in with the new one.' : verified === '1' ? 'Account verified. You can log in now.' : null;

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const session = await login(email.trim(), password);
      router.replace(HOME[session.user.role] as any);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to your event">
      {!!notice && <Text style={styles.notice}>{notice}</Text>}
      <TextField label="Email address" value={email} onChangeText={setEmail} placeholder="Enter your email address" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <Pressable onPress={() => router.push('/forgot-password' as any)} accessibilityRole="link" hitSlop={8} style={styles.forgot}>
        <Text style={styles.link}>Forgot password?</Text>
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button label="Log in" onPress={submit} loading={busy} />
      <View style={styles.footer}>
        <Text style={styles.muted}>Don't have an account? </Text>
        <Pressable onPress={() => router.push('/onboarding5' as any)} accessibilityRole="link" hitSlop={8}>
          <Text style={styles.link}>Sign up</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  notice: { fontSize: FontSize.small, color: Colour.statusValidText },
  forgot: { alignSelf: 'flex-end', marginTop: -6 },
  link: { fontSize: FontSize.small, fontWeight: FontWeight.semibold, color: Colour.textLink },
  muted: { fontSize: FontSize.small, color: Colour.textTan },
  error: { fontSize: FontSize.small, color: Colour.errorText },
  footer: { flexDirection: 'row', justifyContent: 'center' },
});
