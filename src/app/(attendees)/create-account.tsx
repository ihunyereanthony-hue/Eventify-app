import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mystyles } from '../../../styles/main';
import { useUserStore } from '../../../useUserStore';
import { registerAttendee } from '@/services/attendee';
import { errorText } from '@/utils/errorText';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { firstName, lastName, email, phone, ticketType, eventId, setDetails } = useUserStore();
  const [localFirst, setLocalFirst] = useState(firstName || '');
  const [localLast, setLocalLast] = useState(lastName || '');
  const [localEmail, setLocalEmail] = useState(email || '');
  const [localPhone, setLocalPhone] = useState(phone || '');
  const [selectedTicket, setSelectedTicket] = useState(ticketType || 'Regular');
  const [showDropdown, setShowDropdown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSaveAndGetCode = async () => {
  const first = localFirst.trim();
  const last = localLast.trim();
  const mail = localEmail.trim();
  const tel = localPhone.trim();

    if (!first || !last || !mail || !tel) return setError('Please fill in every field.');
    if (!mail.includes('@')) return setError('Enter a valid email address.');
    if (!eventId) return setError('Open the event first, then tap Get Ticket.');

    setDetails({
      name: `${first} ${last}`,
      firstName: first,
      lastName: last,
      email: mail,
      phone: tel,
      ticketType: selectedTicket,
      status: 'Pending',
    });

    setBusy(true);
    setError(null);
    try {
      const { attendeeId } = await registerAttendee({
        eventId,
        firstName: first,
        lastName: last,
        email: mail,
        phone: tel,
        ticketType: selectedTicket,
      });
      setDetails({ attendeeId });
      router.push('/(attendees)/verify-ticket');
    } catch (e) {
      const message = errorText(e);
      if (/already has a ticket/i.test(message)) {
        router.push('/(attendees)/verify-ticket');
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={mystyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
          <Text style={mystyles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={mystyles.heading}>Personal information</Text>
        <Text style={mystyles.subheading}>Fill in your details to get your ticket code</Text>

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1,}}>
              <Text style={mystyles.label}>First name</Text>
              <TextInput placeholder="First name" placeholderTextColor="#F3F3F3" value={localFirst} onChangeText={setLocalFirst} style={mystyles.input1} />
            </View>
            <View style={{ flex: 1}}>
              <Text style={mystyles.label}>Last name</Text>
              <TextInput placeholder="Last name" placeholderTextColor="#F3F3F3" value={localLast} onChangeText={setLocalLast} style={mystyles.input1} />
            </View>
          </View>
          <View >
            <Text style={mystyles.label}>Email address</Text>
            <TextInput placeholder="Enter your email address" placeholderTextColor="#F3F3F3" value={localEmail} onChangeText={setLocalEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={mystyles.input1} />
          </View>
          <View>
            <Text style={mystyles.label}>Phone number</Text>
            <TextInput placeholder="e.g +234" placeholderTextColor="#F3F3F3" value={localPhone} onChangeText={setLocalPhone} keyboardType="phone-pad" style={mystyles.input1} />
          </View>

          <View>
            <Text style={mystyles.label}>Ticket type</Text>
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={[mystyles.input1, mystyles.dropdownToggle]}>
              <Text style={{ fontSize: 12, color: '#1E1E1E' }}>{selectedTicket}</Text>
              <Ionicons name="chevron-down" size={16} color="#F3F3F3" />
            </TouchableOpacity>

            {showDropdown && (
              <View style={mystyles.dropdown}>
                {['Regular', 'VIP', 'VVIP'].map((type) => (
                  <TouchableOpacity key={type} onPress={() => { setSelectedTicket(type); setShowDropdown(false); }} style={[mystyles.dropdownItem, selectedTicket === type && { backgroundColor: '#F3F4F6' }]}>
                    <Text style={{ fontSize: 12, color: selectedTicket === type ? '#4A4A4A' : '#1E1E1E', fontWeight: selectedTicket === type ? 'bold' : 'normal' }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {!!error && <Text style={mystyles.errorText}>{error}</Text>}
        </View>
      </ScrollView>

      <View style={{ width: '100%', paddingTop: 10 }}>
        <TouchableOpacity style={mystyles.button} onPress={handleSaveAndGetCode} disabled={busy}>
          <Text style={mystyles.btnText}>{busy ? 'Sending code...' : 'Get Code'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
