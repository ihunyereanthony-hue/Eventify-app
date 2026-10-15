import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mystyles } from '../../../styles/main';
import { useUserStore } from '../../../useUserStore';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { firstName, lastName, email, phone, ticketType, setDetails } = useUserStore();
  
  const [localFirst, setLocalFirst] = useState(firstName || '');
  const [localLast, setLocalLast] = useState(lastName || '');
  const [localEmail, setLocalEmail] = useState(email || '');
  const [localPhone, setLocalPhone] = useState(phone || '');
  const [selectedTicket, setSelectedTicket] = useState(ticketType || 'Regular');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSaveAndGetCode = () => {
    // Save details to store and update name for initials calculation
    const combinedName = `${localFirst.trim()} ${localLast.trim()}`.trim();
    
    setDetails({ 
      name: combinedName,
      firstName: localFirst.trim(), 
      lastName: localLast.trim(), 
      email: localEmail.trim(), 
      phone: localPhone.trim(), 
      ticketType: selectedTicket,
      status: 'Pending' // Keeps status pending until verification is completed
    });
    
    router.push('/(attendees)/verify-ticket');
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
            <TextInput placeholder="Enter your email address" placeholderTextColor="#F3F3F3" value={localEmail} onChangeText={setLocalEmail} keyboardType="email-address" style={mystyles.input1} />
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
        </View>
      </ScrollView>

      <View style={{ width: '100%', paddingTop: 10 }}>
        <TouchableOpacity style={mystyles.button} onPress={handleSaveAndGetCode}><Text style={mystyles.btnText}>Get Code</Text></TouchableOpacity>
      </View>
    </View>
  );
}