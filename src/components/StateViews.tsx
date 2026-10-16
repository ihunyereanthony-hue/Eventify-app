import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Colour from '../constants/colour';
import { FontSize, FontWeight } from '../constants/typography';
import { Button } from './ui';
import { WifiOffIcon } from './icons';

export function LoadingView() {
  return (
    <View style={styles.box} accessibilityLabel="Loading">
      <ActivityIndicator color={Colour.primary} />
    </View>
  );
}

export function EmptyView({ message }: { message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function OfflineView({ onRefresh, onBack }: { onRefresh: () => void; onBack?: () => void }) {
  return (
    <View style={styles.box}>
      <View style={styles.circle}>
        <WifiOffIcon />
      </View>
      <Text style={styles.title}>You're offline</Text>
      <Text style={[styles.text, { marginTop: 6 }]}>Refresh or connect to a network to continue.</Text>
      <View style={styles.actions}>
        <Button label="Refresh" onPress={onRefresh} />
        {onBack && <Button label="Back" variant="outline" onPress={onBack} />}
      </View>
    </View>
  );
}

export function ErrorView({ error, onRetry, onBack }: { error: Error; onRetry: () => void; onBack?: () => void }) {
  if (error.name === 'NetworkError') return <OfflineView onRefresh={onRetry} onBack={onBack} />;

  if (error.name === 'NotConnectedError') {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>Not connected yet</Text>
        <Text style={[styles.text, { marginTop: 8 }]}>{error.message}</Text>
      </View>
    );
  }
  const shown = error.name === 'ApiError' ? error.message : "Couldn't load this right now";
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{shown}</Text>
      {__DEV__ && error.name !== 'ApiError' && <Text style={[styles.text, { marginTop: 8 }]}>{error.message}</Text>}
      <View style={styles.actions}>
        <Button label="Try again" variant="outline" size="sm" onPress={onRetry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 12 },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colour.cardBeige, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  text: { fontSize: FontSize.small, color: Colour.textTan, textAlign: 'center' },
  title: { fontSize: FontSize.large, fontWeight: FontWeight.semibold, color: Colour.textHeading, textAlign: 'center' },
  actions: { marginTop: 24, width: '100%', maxWidth: 260, gap: 12 },
});
