import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Colour from '../../constants/colour';

export default function ScanFrame({ children, size = 280 }: { children?: ReactNode; size?: number }) {
  const arm = Math.round(size * 0.26);
  const corner = { position: 'absolute' as const, width: arm, height: arm, borderColor: Colour.ink };
  return (
    <View style={{ width: size, height: size, alignSelf: 'center' }}>
      <View style={styles.inner}>{children}</View>
      <View style={[corner, { top: 0, left: 0, borderTopWidth: W, borderLeftWidth: W, borderTopLeftRadius: 14 }]} />
      <View style={[corner, { top: 0, right: 0, borderTopWidth: W, borderRightWidth: W, borderTopRightRadius: 14 }]} />
      <View style={[corner, { bottom: 0, left: 0, borderBottomWidth: W, borderLeftWidth: W, borderBottomLeftRadius: 14 }]} />
      <View style={[corner, { bottom: 0, right: 0, borderBottomWidth: W, borderRightWidth: W, borderBottomRightRadius: 14 }]} />
    </View>
  );
}

const W = 3;
const styles = StyleSheet.create({
  inner: { ...StyleSheet.absoluteFill, margin: 10, borderRadius: 12, overflow: 'hidden', backgroundColor: Colour.ink },
});
