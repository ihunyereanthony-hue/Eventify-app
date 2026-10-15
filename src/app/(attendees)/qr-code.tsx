import React, { useState, useEffect, useRef } from 'react';
import { mystyles } from '../../../styles/main';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface QRCodeScreenProps {
  attendeeEmail?: string;
  onBack?: () => void;
}

export default function QRCodeScreen({
  attendeeEmail = 'user@example.com',
  onBack,
}: QRCodeScreenProps) {
  // Initial fallback demo code so it renders immediately and works out-of-the-box
  const [ticketCode, setTicketCode] = useState<string>('DEMO-TICKET-12345');
  const [loading, setLoading] = useState<boolean>(true);

  // Event details matching the screen layout
  const eventDetails = {
    title: 'Tech & Creators Summit 2026',
    date: 'Sat, Oct 17th, 2026 - 8:00 AM',
    location: 'Lagos, Nigeria',
  };

  useEffect(() => {
    const fetchTicketFromBackend = async () => {
      try {
        // Replace with your actual backend endpoint API call when ready
        // const response = await fetch(`https://api.yourdomain.com/get-ticket?email=${attendeeEmail}`);
        // const data = await response.json();
        // if (data?.ticketCode) { setTicketCode(data.ticketCode); }

        setTimeout(() => {
          setLoading(false);
        }, 400);
      } catch (error) {
        console.error('Error fetching ticket code from backend:', error);
        setLoading(false);
      }
    };

    if (attendeeEmail) {
      fetchTicketFromBackend();
    }
  }, [attendeeEmail]);

  const handleDownloadShare = async () => {
    try {
      await Share.share({
        message: `Here is my ticket code for ${eventDetails.title}: ${ticketCode}. Date: ${eventDetails.date}, Location: ${eventDetails.location}`,
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

        {/* Center Content Section */}
        <View style={mystyles.centerContent}>
          {/* QR Code Container */}
          <View style={mystyles.qrWrapper}>
            {loading && ticketCode === 'DEMO-TICKET-12345' ? (
              <View style={mystyles.loadingContainer}>
                <ActivityIndicator size="small" color="#5A4DDC" />
                <Text style={mystyles.loadingText}>Generating QR...</Text>
              </View>
            ) : (
              <QRCode
                value={ticketCode}
                size={200}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            )}
            <Text style={mystyles.warningText}>Don't share with anyone</Text>
          </View>

          {/* Event Metadata */}
          <View style={mystyles.eventInfoContainer}>
            <Text style={mystyles.eventTitle}>{eventDetails.title}</Text>
            <Text style={mystyles.eventSubText}>{eventDetails.date}</Text>
            <Text style={mystyles.eventSubText}>{eventDetails.location}</Text>
          </View>
        </View>

        {/* Bottom Action Button */}
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