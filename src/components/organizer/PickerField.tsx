// Date / time field. iOS draws its own compact picker right in the box, Android needs a
// tap to open the system dialog, hence the two branches.
// Needs: npx expo install @react-native-community/datetimepicker

import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import { formatInputDate, formatInputTime } from '@/utils/formatDate';

type Props = { label: string; mode: 'date' | 'time'; value: Date; onChange: (d: Date) => void };

export default function PickerField({ label, mode, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const shown = mode === 'date' ? formatInputDate(value) : formatInputTime(value);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'ios' ? (
        <View style={styles.box}>
          <DateTimePicker mode={mode} value={value} display="compact" accentColor={Colour.primary} onChange={(_, d) => d && onChange(d)} />
        </View>
      ) : (
        <>
          <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`${label}, ${shown}`} style={styles.box}>
            <Text style={styles.value}>{shown}</Text>
          </Pressable>
          {open && (
            <DateTimePicker
              mode={mode}
              value={value}
              onChange={(e, d) => {
                setOpen(false); // the Android dialog closes itself, state has to follow
                if (e.type === 'set' && d) onChange(d);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 8 },
  label: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colour.textHeading },
  box: { minHeight: 52, borderRadius: 16, paddingHorizontal: 14, backgroundColor: Colour.field, justifyContent: 'center', alignItems: 'flex-start' },
  value: { fontSize: FontSize.body, color: Colour.textHeading },
});
