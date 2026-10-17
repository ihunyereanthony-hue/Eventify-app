import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding4() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>Keep Check-in{"\n"}Moving</Text>
        <Text style={styles.desc}>Give your staff a simple scanning experience designed for fast entry, even when connectivity is unreliable.</Text>
      </View>
      <View style={styles.illustWrap}><Image source={require('../../assets/images/onboarding 4.jpeg')} style={styles.illust} resizeMode="contain" /></View>
      <View style={styles.bottom}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnLight} onPress={() => (router as any).back()}><Text style={styles.btnLightText}>Back</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => (router as any).push('/onboarding5')}><Text style={styles.btnPrimaryText}>Continue</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnOutline} onPress={() => (router as any).push('/onboarding5')}><Text style={styles.btnOutlineText}>Skip</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
 // ...
  topContent: { paddingHorizontal: 20, paddingTop: 30, width: '100%', maxWidth: 520, alignSelf: 'center' },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 32, color: COLORS.textDark },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14.5, lineHeight: 21, color: COLORS.textGray, marginTop: 10, width: '90%' },
  illustWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  illust: { width: 320, height: 320, backgroundColor: '#FFFFFF' },
  bottom: { padding: 20, width: '100%', maxWidth: 520, alignSelf: 'center' }, row: { flexDirection: 'row', gap: 12 },
  btnLight: { flex: 1, height: 46, backgroundColor: COLORS.lightPurple, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnLightText: { fontFamily: 'Inter_500Medium', color: COLORS.primary, fontSize: 13 },
  btnPrimary: { flex: 1, height: 46, backgroundColor: COLORS.primary, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_700Bold', color: 'white', fontSize: 13 },
  btnOutline: { height: 46, borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  btnOutlineText: { fontFamily: 'Inter_500Medium', color: COLORS.textGray, fontSize: 13 },
});