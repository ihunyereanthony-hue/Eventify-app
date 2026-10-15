import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mystyles } from '../../../styles/main';

export default function AttendeeConfirmedScreen(){
  const router = useRouter();
  return (
    <SafeAreaView style={mystyles.container}>
      <View style={mystyles.header1}>
        <TouchableOpacity onPress={() => router.replace('/(attendees)/event-landing')}>
        <Text style={{ justifyContent: 'center', alignItems: 'center', fontSize: 12, color: '#5A4DCC' }}>Back Home</Text></TouchableOpacity>
      </View>
          <View style={mystyles.logoContainer}>
           <Image source={require('../../../assets/images/Attendee-confirm.png')} style={{width: 120, height: 120}} />
        </View>

        <Text style={mystyles.title1}>Attendee Confirmed!</Text>
        <Text style={mystyles.subtitle}>
          Your ticket is valid and has been successfully registered for event.
        </Text>

        <View style={{ width: '100%', gap: 14, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ 
              backgroundColor: '#5A4DDC', 
              width: '100%', 
              height: 50, 
              borderRadius: 25,
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            onPress={() => router.push('/(attendees)/qr-code')}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>View Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ 
              backgroundColor: '#5A4DDC', 
              width: '100%', 
              height: 50, 
              borderRadius: 25,
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            onPress={() => router.push('/(attendees)/event-details')}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>View Event Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center', paddingTop: 8 }}
            onPress={() => router.push('/(attendees)/get-direction')}
          >
            <Text style={{ fontSize: 14, color: '#5A4DDC', fontWeight: '500' }}>Get Direction</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}