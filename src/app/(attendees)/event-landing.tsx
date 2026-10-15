import { useRouter } from 'expo-router';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { mystyles } from '../../../styles/main';
import { Ionicons } from '@expo/vector-icons';

export default function EventLandingScreen() {
  const router = useRouter();

  return (
    <View style={mystyles.container2}>
      <View style={mystyles.logoContainer}>
        <View style={mystyles.logoPlaceholder}>
          <Image source={require('../../../assets/images/landing-icon.jpeg')} style={mystyles.logoPlaceholder}/>
        </View>
      </View>
      <View style={mystyles.card}>
        <Image source={require('../../../assets/images/landing-image.jpeg')} style={mystyles.banner} />
        <Text style={mystyles.title}>Tech & Creators Summit 2026</Text>
        <View style={{ flexDirection: 'row', marginTop:  -190,alignItems: 'center', gap: 6}}>
          <Ionicons name="calendar-clear" size={16} color="#5A4DDC"/>
          <Text> Sat, Oct 17th, 2026 - 8:00 AM</Text>
        </View>

        <View style={{ flexDirection: 'row',marginTop:  10,alignItems: 'center', gap: 6}}>
          <Ionicons name="location-sharp" size={16} color="#5A4DDC"/>
           <Text> Lagos, Nigeria</Text>
        </View>
    
      </View>
      <TouchableOpacity style={mystyles.button1} onPress={() => router.push('/(attendees)/create-account')}>
        <Text style={mystyles.btnText}>Get Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}