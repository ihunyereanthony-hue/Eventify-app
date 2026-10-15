import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mystyles } from '../../../styles/main';

export default function VerifyTicketIncorrectScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(59);
  
    useEffect(() => {
      let interval = null;
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [timer]);
  
    const handleContinue = () => {
      console.log('Verifying ticket code:', code);
    };
  
    const handleResend = () => {
      setTimer(59);
    };
  
  return (
    <View style={mystyles.container}>
      <View>
          <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
        <Text style={mystyles.backArrow}>‹</Text>
          </TouchableOpacity>
        <Text style={mystyles.heading}>Verify your ticket</Text>
        <Text style={mystyles.subheading}>Enter the ticket code that has been sent to your email address to get your QR code.</Text>
        
        <TextInput 
          style={[mystyles.input, mystyles.errorBorder, mystyles.inputError]}
          placeholder="Enter your ticket code here"
          placeholderTextColor="#E5362E"
          value={code} onChangeText={setCode} />
        <Text style={mystyles.errorText}>Incorrect code, Try again</Text>
        <Text style={mystyles.timerText}>
          Resend in 00:{timer < 10 ? `0${timer}` : timer}s
        </Text>
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={mystyles.button} onPress={() => router.push('/(attendees)/verify-ticket-correct')}><Text style={mystyles.btnText}>Continue</Text></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 12, marginBottom: 16 }}><Text style={{ fontSize: 12, color: '#5A4DDC' }}>Resend code</Text></TouchableOpacity>
      </View>
    </View>
  );
}