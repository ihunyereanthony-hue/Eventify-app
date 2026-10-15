import React, { useEffect, useState } from 'react';
import {mystyles} from '../../../styles/main';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function VerifyTicketScreen() {
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
          placeholder="Enter your code here"
          placeholderTextColor="#F3F3F3"
          style={mystyles.input}
          value={code}
          onChangeText={setCode}
        />
        <Text style={mystyles.timerText}>
          Resend in 00:{timer < 10 ? `0${timer}` : timer}s
        </Text>
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={mystyles.button} onPress={() => router.push('/(attendees)/verify-ticket-incorrect')}><Text style={mystyles.btnText}>Continue</Text></TouchableOpacity>
        <TouchableOpacity onPress={handleResend} style={mystyles.resendContainer}>
          <Text style={mystyles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}