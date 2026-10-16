import { HOME } from '@/components/RoleShell';
import { useSession } from '@/services/session';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mystyles } from '../../styles/main';

export default function SplashScreen() {
  const router = useRouter();
  const { session, ready } = useSession();
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const went = useRef(false);
  const go = () => {
    if (went.current) return;
    went.current = true;
    const s = sessionRef.current;
    if (s && s.user.role !== 'attendee') router.replace(HOME[s.user.role] as any);
    else router.replace('/onboarding1' as any);
  };
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(go, 1200);
    return () => clearTimeout(t);
  }, [ready]);
  useEffect(() => {
    const t = setTimeout(go, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <SafeAreaView style={mystyles.container1}>
      <View style={styles.center}>
        <Image
          source={require('../../assets/images/splash-icon - Copy.png')}
          style={{ width: 55, height: 55 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' },
});
