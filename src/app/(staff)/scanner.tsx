import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackChevron } from '@/components/icons';
import CounterTile from '@/components/staff/CounterTile';
import ScanFrame from '@/components/staff/ScanFrame';
import { Button, ScreenContainer } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { useAsync } from '@/hooks/useAsync';
import { useLayout } from '@/hooks/useLayout';
import { submitScan } from '@/services/checkIns';
import { getEventStats } from '@/services/events';
import { errorText } from '@/utils/errorText';

export default function StaffScanner() {
  const router = useRouter();
  const { width } = useLayout();
  const { eventId, eventName, isLive } = useLocalSearchParams<{ eventId: string; eventName?: string; isLive?: string }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanError, setScanError] = useState<string | null>(null);
  // The camera reports the same QR many times a second. Without this lock one scan
  // turned into ten check-ins.
  const locked = useRef(false);

  const stats = useAsync(() => getEventStats(String(eventId)), [eventId]);

  // back from the result screen: unlock the camera and refresh the counters
  useFocusEffect(
    useCallback(() => {
      locked.current = false;
      stats.reload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]),
  );

  const onScanned = async ({ data }: { data: string }) => {
    if (locked.current || !data) return;
    locked.current = true;
    setScanError(null);
    try {
      const outcome = await submitScan(String(eventId), data);
      router.push({
        pathname: '/scan-result' as any,
        params: {
          status: outcome.status,
          name: outcome.attendeeName ?? '',
          code: outcome.ticketCode ?? '',
          time: outcome.checkedInAt ?? '',
        },
      });
    } catch (e) {
      setScanError(errorText(e));
      // short pause so a failing code doesn't hammer the backend
      setTimeout(() => {
        locked.current = false;
      }, 1500);
    }
  };

  const granted = permission?.granted;
  const live = isLive === '1';
  const frameSize = Math.min(width - 56, 380);

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} style={styles.back}>
          <BackChevron />
        </Pressable>
        <Text style={styles.title} numberOfLines={2}>{eventName ?? ''}</Text>
        {live && (
          <View style={styles.live}>
            <Text style={styles.liveText}>Live</Text>
          </View>
        )}
      </View>

      <View style={styles.counters}>
        <CounterTile label="Checked in" value={stats.data?.checkedIn ?? null} />
        <CounterTile label="Total tickets" value={stats.data?.total ?? null} tone="soft" />
      </View>

      <View style={styles.frameWrap}>
        <ScanFrame size={frameSize}>
          {granted ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={onScanned}
            />
          ) : null}
        </ScanFrame>
      </View>

      {permission && !granted ? (
        <View style={styles.permission}>
          <Text style={styles.caption}>Camera access is needed to scan tickets.</Text>
          <View style={styles.permissionButton}>
            <Button
              label={permission.canAskAgain ? 'Allow camera' : 'Open settings'}
              size="sm"
              onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.caption}>Position the QR within the frame to scan</Text>
      )}
      {!!scanError && <Text style={styles.error}>{scanError}</Text>}

      <View style={styles.footer}>
        <Button
          label="View check-ins"
          variant="outline"
          onPress={() => router.push({ pathname: '/check-ins' as any, params: { eventId: String(eventId), eventName: eventName ?? '' } })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colour.border, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  live: { backgroundColor: Colour.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  liveText: { fontSize: 12, fontWeight: FontWeight.medium, color: Colour.textOnPrimary },
  counters: { flexDirection: 'row', gap: 12, marginTop: 20 },
  frameWrap: { marginTop: 28 },
  caption: { marginTop: 20, textAlign: 'center', fontSize: FontSize.small, color: Colour.textTan },
  permission: { alignItems: 'center' },
  permissionButton: { marginTop: 14, width: 180 },
  error: { marginTop: 12, textAlign: 'center', fontSize: FontSize.small, color: Colour.errorText },
  footer: { marginTop: 28, marginBottom: 24 },
});
