// App mark (icon.png) + the bold "Eventify" wordmark from the final Figma.
// `light` is for purple backgrounds.

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Images } from '../constants/assets';
import Colour from '../constants/colour';
import { FontWeight } from '../constants/typography';

export default function Logo({ size = 34, light = false }: { size?: number; light?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Eventify">
      <Image source={Images.logo} style={{ width: size, height: size, borderRadius: size * 0.25 }} />
      <Text style={[styles.word, { fontSize: size * 0.85, color: light ? Colour.white : Colour.primary }]}>Eventify</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  word: { fontWeight: FontWeight.bold, letterSpacing: -0.5 },
});
