import { Images } from '@/constants/assets';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding1() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topCurve}>
        <Image source={Images.onboarding[0]} style={styles.topImg} resizeMode="cover" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>Smarter Events.{"\n"}Easier Check - ins.{"\n"}Better Experiences.</Text>
        <Text style={styles.desc}>We make event check-in simple, secure, and stress-free. From generating unique QR tickets to verifying attendees and tracking attendance in real time.</Text>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => (router as any).push('/onboarding2')}>
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topCurve: { height: '52%', width: '100%', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  topImg: { width: '100%', height: '100%', backgroundColor: '#FFFFFF' },
  textWrap: { flex: 1, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center', width: '100%', maxWidth: 640, alignSelf: 'center' },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 34, textAlign: 'center', color: COLORS.textDark },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 22, color: COLORS.textGray, textAlign: 'center', marginTop: 14 },
  bottom: { padding: 20, width: '100%', maxWidth: 520, alignSelf: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_700Bold', color: 'white', fontSize: 16 }, //
});