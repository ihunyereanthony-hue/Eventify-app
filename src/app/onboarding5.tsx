import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding5() {
  const router = useRouter();
  const [sel, setSel] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => (router as any).back()}>
        <Ionicons name="chevron-back" size={24} color="#111" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>How are you using the{"\n"}platform?</Text>
        <Text style={styles.headerSub}>Choose an option below to continue</Text>
      </View>

      <View style={styles.list}>
        <TouchableOpacity style={[styles.card, sel === 'org' && styles.cardActive]} onPress={() => setSel('org')}>
          <View style={styles.iconBox}>
            <Ionicons name="person" size={18} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Organizing an event</Text>
            <Text style={styles.cardDesc}>Create and manage my event.</Text>
          </View>
          <View style={[styles.radio, sel === 'org' && styles.radioOn]}>
            {sel === 'org' && <Ionicons name="checkmark-done" size={14} color="white" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, sel === 'staff' && styles.cardActive]} onPress={() => setSel('staff')}>
          <View style={styles.iconBox}>
            <Ionicons name="qr-code" size={18} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I'm an Event staff</Text>
            <Text style={styles.cardDesc}>Scan tickets and manage entry</Text>
          </View>
          <View style={[styles.radio, sel === 'staff' && styles.radioOn]}>
            {sel === 'staff' && <Ionicons name="checkmark-done" size={14} color="white" />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.btn, !sel && styles.btnDisabled]}
          disabled={!sel}
          onPress={() => (router as any).push({ pathname: '/register', params: { role: sel === 'org' ? 'organizer' : 'staff' } })}
        >
          <Text style={[styles.btnText, !sel && { color: '#9CA3AF' }]}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => (router as any).replace('/login')}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginLink} onPress={() => (router as any).push('/(attendees)/event-landing')}>
          <Text style={styles.loginText}>I'm an attendee with an event code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backBtn: { marginLeft: 16, marginTop: 8, width: 32, height: 32, justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 12, width: '100%', maxWidth: 520, alignSelf: 'center' },
  headerTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 32, color: '#111827' },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  list: { padding: 20, gap: 12, marginTop: 8, width: '100%', maxWidth: 520, alignSelf: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, gap: 12, backgroundColor: 'white' },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.pale },
  iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#111827' },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  radioOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  bottom: { padding: 20, marginTop: 'auto', width: '100%', maxWidth: 520, alignSelf: 'center' },
  btn: { backgroundColor: COLORS.primary, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { backgroundColor: '#E5E7EB' },
  loginLink: { marginTop: 16, alignItems: 'center' },
  loginText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.primary },
  btnText: { fontFamily: 'Inter_600SemiBold', color: 'white', fontSize: 15 },
});