import React from 'react';
import {mystyles} from '../../../styles/main';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function GetDirectionsScreen() {
  const router = useRouter();

  const openGoogleMaps = () => {
    const venueAddress = encodeURIComponent('Lagos, Nigeria');
    const url = Platform.select({
      ios: `maps:0,0?q=${venueAddress}`,
      android: `geo:0,0?q=${venueAddress}`
    });
    
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${venueAddress}`;
    Linking.openURL(url ?? fallbackUrl).catch(() => {
      Linking.openURL(fallbackUrl);
    });
  };

  return (
    <View style={mystyles.container}>
     <View style={mystyles.header}>
      <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
    <Text style={mystyles.backArrow}>‹</Text>
      </TouchableOpacity>
    </View>
      <View style={mystyles.mapBg}>
        <TouchableOpacity style={mystyles.mapPinContainer} onPress={openGoogleMaps}>
          <View style={mystyles.mapPin}><Text style={{ fontSize: 12 }}>📍</Text></View>
          <Text style={mystyles.mapLabel}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}