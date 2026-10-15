// "Are you sure you want to log out ?" card, also reused for Delete all codes.
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';

type Props = { visible: boolean; message: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void };

export default function ConfirmModal({ visible, message, confirmLabel, onCancel, onConfirm }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.btn, styles.cancel]}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} accessibilityRole="button" style={[styles.btn, styles.confirm]}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: Colour.scrim, alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: { width: '100%', maxWidth: 360, backgroundColor: Colour.white, borderRadius: 20, padding: 20, gap: 20 },
  message: { fontSize: FontSize.body, lineHeight: 24, color: Colour.ink, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: Colour.field },
  confirm: { backgroundColor: Colour.logoutRed },
  cancelText: { fontSize: FontSize.small, color: Colour.ink },
  confirmText: { fontSize: FontSize.small, fontWeight: FontWeight.medium, color: Colour.white },
});
