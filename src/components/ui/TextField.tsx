import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Colour from '../../constants/colour';
import { Size, Spacing } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

type Props = TextInputProps & {
  label: string;
  error?: string;
};
function EyeIcon({ open }: { open: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke={Colour.textBody}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={Colour.textBody} strokeWidth={2} />
      {/* the slash across the eye when the password is hidden */}
      {!open && (
        <Path d="M3 3l18 18" stroke={Colour.textBody} strokeWidth={2} strokeLinecap="round" />
      )}
    </Svg>
  );
}

export default function TextField({ label, error, secureTextEntry, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isPassword = !!secureTextEntry;
  const lineColour = error
    ? Colour.danger
    : focused
      ? Colour.borderFocused
      : Colour.border;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, { borderBottomColor: lineColour }]}>
        <TextInput
          {...rest}
          secureTextEntry={isPassword && hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={Colour.inputPlaceholder}
          accessibilityLabel={label}
          style={[styles.input, rest.style]}
        />
        {isPassword && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <EyeIcon open={!hidden} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  label: {
    fontSize: FontSize.large,
    fontWeight: FontWeight.semibold,
    color: Colour.textBody,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Size.inputHeight,
    borderBottomWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colour.textHeading,
    paddingVertical: Spacing.sm,
  },
  error: {
    marginTop: Spacing.xs,
    fontSize: FontSize.small,
    color: Colour.errorText,
  },
});
