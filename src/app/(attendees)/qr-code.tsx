import React from 'react';
import { mystyles } from '../../../styles/main';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUserStore } from '../../../useUserStore';

export default function QRCodeScreen() {
  const { email, ticketCode, qrToken, qrCode, eventName, eventWhen, eventVenue } = useUserStore();
  const handleDownloadShare = async () => {
    try {
      await Share.share({
        message: `Here is my ticket code for ${eventName}: ${ticketCode}. Date: ${eventWhen}, Location: ${eventVenue}`,
        title: 'My Event Ticket QR',
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
      Alert.alert('Error', 'Could not share the ticket.');
    }
  };

  return (
    <SafeAreaView style={mystyles.safeArea}>
      <View style={mystyles.container2}>
        <View style={mystyles.header}>
          <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
        <Text style={mystyles.backArrow}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={mystyles.centerContent}>
          <View style={mystyles.qrWrapper}>
            {qrCode ? (
              <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
            ) : qrToken ? (
              <QRCode value={qrToken} size={200} backgroundColor="#FFFFFF" color="#000000" />
            ) : (
              <Text style={{ textAlign: 'center', fontSize: 14, color: '#4A4A4A', padding: 16 }}>
                Your QR code has been sent to {email || 'your email'}. Open that email at the gate.
              </Text>
            )}
            <Text style={mystyles.warningText}>Don't share with anyone</Text>
          </View>
          <View style={mystyles.eventInfoContainer}>
            <Text style={mystyles.eventTitle}>{eventName}</Text>
            <Text style={mystyles.eventSubText}>{eventWhen}</Text>
            <Text style={mystyles.eventSubText}>{eventVenue}</Text>
          </View>
        </View>
        <View style={mystyles.footer}>
          <TouchableOpacity
            style={mystyles.actionButton}
            onPress={handleDownloadShare}
            activeOpacity={0.8}
          >
            <Text style={mystyles.actionButtonText}>Download/Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
