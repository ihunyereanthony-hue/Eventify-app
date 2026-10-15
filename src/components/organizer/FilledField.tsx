// The grey filled input from the organizer forms: label on top, soft grey box.
// (The staff/auth TextField is the underline one, different look on purpose, it's the Figma.)

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';

type Props = TextInputProps & { label: string; error?: string; readOnly?: boolean };

export default function FilledField({ label, error, readOnly, multiline, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        editable={!readOnly && rest.editable !== false}
        placeholderTextColor={Colour.inputPlaceholder}
        accessibilityLabel={label}
        style={[styles.input, multiline && styles.multi, readOnly && styles.readOnly, style]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: FontSize.body, fontWeight: FontWeight.medium, color: Colour.textHeading },
  input: { minHeight: 52, borderRadius: 16, paddingHorizontal: 18, backgroundColor: Colour.field, fontSize: FontSize.body, color: Colour.textHeading },
  multi: { minHeight: 96, paddingTop: 14, textAlignVertical: 'top' },
  readOnly: { color: Colour.textMuted },
  error: { fontSize: FontSize.caption, color: Colour.errorText },
});
