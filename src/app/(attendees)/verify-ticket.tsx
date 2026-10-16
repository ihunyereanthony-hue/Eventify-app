import React, { useState } from 'react';
import {mystyles} from '../../../styles/main';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../../useUserStore';
import { statusLabel, verifyTicketCode } from '@/services/attendee';
import { errorText } from '@/utils/errorText';

// NEW: this one screen now does the job of verify-ticket, verify-ticket-incorrect and verify-ticket-correct.
// It asks the server; a wrong code shows the red error right here.
export default function VerifyTicketScreen() {
  const router = useRouter();
  const { eventId, email, attendeeId, ticketType, setDetails } = useUserStore();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    const entered = code.trim();
    if (!entered) return setError('Enter the ticket code from your email.');
    setBusy(true);
    setError(null);
    try {
      const ticket = await verifyTicketCode(entered, eventId);
      setDetails({
        attendeeId: ticket.attendeeId || attendeeId,
        ticketCode: ticket.ticketCode,
        ticketType: ticket.ticketType || ticketType,
        status: statusLabel(ticket.ticketStatus),
        isVerified: true,
        qrToken: ticket.qrToken ?? '',
        qrCode: ticket.qrCode ?? '',
      });
      router.replace('/(attendees)/verify-ticket-success');
    } catch (e) {
      // e.g. "Invalid ticket code for this event" or "This ticket has already been used"
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={mystyles.container}>
      <View>
        <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
          <Text style={mystyles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={mystyles.heading}>Verify your ticket</Text>

        <Text style={mystyles.subheading}>
          Enter the ticket code that has been sent to {email || 'your email address'} to get your QR code.
        </Text>
        <TextInput
          placeholder="Enter your code here"
          placeholderTextColor={error ? '#E5362E' : '#F3F3F3'}
          style={error ? [mystyles.input, mystyles.errorBorder, mystyles.inputError] : mystyles.input}
          value={code}
          onChangeText={(t) => { setCode(t); setError(null); }}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {!!error && <Text style={mystyles.errorText}>{error}</Text>}
        {/* NEW: the server has no "resend" yet, so point them at Spam instead of a fake timer */}
        <Text style={mystyles.timerText}>Can't find it? Check your Spam or Promotions folder.</Text>
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity style={mystyles.button} onPress={handleContinue} disabled={busy}>
          <Text style={mystyles.btnText}>{busy ? 'Verifying...' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
