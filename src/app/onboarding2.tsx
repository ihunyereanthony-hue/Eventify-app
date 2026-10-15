import { Images } from '@/constants/assets';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding2() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topCurve}>
        <Image source={Images.onboarding[1]} style={styles.topImg} resizeMode="cover" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>Verify Every Ticket in{"\n"}Seconds</Text>
        <Text style={styles.desc}>Generate unique QR tickets and verify attendees quickly with a simple scan. Detect invalid, duplicate, and wrong-event tickets before they get through the door.</Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnLight} onPress={() => (router as any).back()}><Text style={styles.btnLightText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => (router as any).push('/onboarding3')}><Text style={styles.btnPrimaryText}>Continue</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnOutline} onPress={() => (router as any).push('/onboarding5')}><Text style={styles.btnOutlineText}>Skip</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topCurve: { height: '52%', width: '100%', borderBottomLeftRadius: 150, borderBottomRightRadius: 150, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  topImg: { width: '100%', height: '100%', backgroundColor: '#FFFFFF' },
  textWrap: { flex: 1, paddingHorizontal: 24, paddingTop: 24, alignItems: 'center', width: '100%', maxWidth: 640, alignSelf: 'center' },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 32, textAlign: 'center', color: COLORS.textDark },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: COLORS.textGray, textAlign: 'center', marginTop: 12 },
  bottom: { padding: 20, width: '100%', maxWidth: 520, alignSelf: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  btnLight: { flex: 1, height: 52, backgroundColor: COLORS.lightPurple, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  btnLightText: { fontFamily: 'Inter_500Medium', color: COLORS.primary, fontSize: 15 },
  btnPrimary: { flex: 1, height: 52, backgroundColor: COLORS.primary, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_700Bold', color: 'white', fontSize: 15 },
  btnOutline: { height: 52, borderWidth: 1, borderColor: COLORS.border, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  btnOutlineText: { fontFamily: 'Inter_500Medium', color: COLORS.textGray, fontSize: 15 },
});