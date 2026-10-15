// The little coloured pill for ticket status. Colours come from colour.ts so the
// scan result screens and the lists never disagree about what "duplicate" looks like.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colour, { withAlpha } from '../../constants/colour';
import { Radius, Spacing } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

export type CheckInStatus = 'confirmed' | 'duplicate' | 'invalid' | 'pending';

// fill is the bright status colour (tinted), text is a darker step so it can be read
const LOOK: Record<CheckInStatus, { fill: string; text: string; label: string }> = {
  confirmed: { fill: Colour.statusValid, text: Colour.statusValidText, label: 'Valid' },
  duplicate: { fill: Colour.statusDuplicate, text: Colour.statusDuplicateText, label: 'Duplicate' },
  invalid: { fill: Colour.statusInvalid, text: Colour.statusInvalidText, label: 'Invalid' },
  pending: { fill: Colour.statusPending, text: Colour.statusPending, label: 'Pending sync' },
};

type Props = { status: CheckInStatus; label?: string };

export default function StatusBadge({ status, label }: Props) {
  const look = LOOK[status];
  return (
    <View style={[styles.pill, { backgroundColor: withAlpha(look.fill, 0.18) }]}>
      <Text style={[styles.text, { color: look.text }]}>{label ?? look.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  text: { fontSize: FontSize.caption, fontWeight: FontWeight.semibold },
});
