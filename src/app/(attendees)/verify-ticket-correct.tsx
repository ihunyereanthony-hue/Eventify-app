import React, { useEffect, useState } from 'react';
import {mystyles} from '../../../styles/main';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../../useUserStore';

export default function VerifyTicketCorrectScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { setDetails, email, ticketType } = useUserStore();
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
    
  const handleVerifyWithBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://your-backend-api.com/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verificationCode: code,
          email: email,
          ticketType: ticketType 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDetails({
          ticketCode: data.ticketCode,
          status: data.status || 'Valid',
        });
        router.push('/(attendees)/verify-ticket-success');
      } else {
        Alert.alert('Verification Failed', data.message || 'Invalid ticket code.');
      }
    } catch (error) {
      setDetails({
        ticketCode: '', 
        status: '',
      });
      router.push('/(attendees)/verify-ticket-success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={mystyles.container}>
      <View>
         <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
        <Text style={mystyles.backArrow}>‹</Text>
          </TouchableOpacity>
        <Text style={mystyles.heading}>Verify your ticket</Text>
        <Text style={mystyles.subheading}>Enter the ticket code that has been sent to your email address to get your QR code.</Text>
        <TextInput value={code} onChangeText={setCode} style={mystyles.input} />
        <Text style={mystyles.timerText}>
          Resend in 00:{timer < 10 ? `0${timer}` : timer}s
        </Text>
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={mystyles.button} onPress={handleVerifyWithBackend} disabled={loading}>
          <Text style={mystyles.btnText}>{loading ? 'Verifying...' : 'Continue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: '#5A4DDC' }}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}