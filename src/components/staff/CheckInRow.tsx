import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colour from '../../constants/colour';
import { FontSize, FontWeight } from '../../constants/typography';
import type { CheckIn, CheckInStatus } from '../../types/checkIn';
import { formatTime } from '../../utils/formatDate';
import { StatusBadge } from '../ui';
import type { CheckInStatus as BadgeStatus } from '../ui';

const BADGE: Record<CheckInStatus, { status: BadgeStatus; label: string }> = {
  confirmed: { status: 'confirmed', label: 'Valid' },
  duplicate: { status: 'duplicate', label: 'Duplicate' },
  declined: { status: 'invalid', label: 'Declined' },
};
export function CheckInTableHead() {
  return (
    <View style={[styles.wide, styles.head]}>
      <Text style={[styles.headText, styles.cTime]}>Time</Text>
      <Text style={[styles.headText, styles.cName]}>Name</Text>
      <Text style={[styles.headText, styles.cCode]}>Ticket code</Text>
      <Text style={[styles.headText, styles.cStatus]}>Status</Text>
      <Text style={[styles.headText, styles.cGate]}>Gate</Text>
    </View>
  );
}

export default function CheckInRow({ item, wide = false }: { item: CheckIn; wide?: boolean }) {
  const badge = BADGE[item.status];
  if (wide) {
    return (
      <View style={styles.wide}>
        <Text style={[styles.cell, styles.cTime]}>{formatTime(item.scannedAt)}</Text>
        <Text style={[styles.cell, styles.cName]}>{item.attendeeName}</Text>
        <Text style={[styles.cell, styles.cCode]}>{item.ticketCode}</Text>
        <View style={styles.cStatus}>
          <StatusBadge status={badge.status} label={badge.label} />
        </View>
        <Text style={[styles.cell, styles.cGate]}>{item.gate ?? '\u2013'}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.name}>{item.attendeeName}</Text>
        <Text style={styles.sub}>{[item.ticketCode, item.gate].filter(Boolean).join(' · ')}</Text>
      </View>
      <View style={styles.right}>
        <StatusBadge status={badge.status} label={badge.label} />
        <Text style={styles.sub}>{formatTime(item.scannedAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colour.hairline },
  text: { flex: 1 },
  name: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colour.textHeading },
  sub: { marginTop: 2, fontSize: FontSize.caption, color: Colour.textTan },
  right: { alignItems: 'flex-end', gap: 4 },
  wide: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colour.hairline },
  head: { backgroundColor: Colour.cardBeige, borderRadius: 10, borderBottomWidth: 0, marginBottom: 4 },
  headText: { fontSize: FontSize.small, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  cell: { fontSize: FontSize.small, color: Colour.textHeading },
  cTime: { flex: 1 },
  cName: { flex: 2 },
  cCode: { flex: 1.5 },
  cStatus: { flex: 1.2 },
  cGate: { flex: 0.8 },
});
