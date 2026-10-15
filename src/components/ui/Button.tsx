// ============ BUTTON ============
// The ONLY button in the app. Three looks:
//   primary - filled purple (Scan, Log in, Try again)
//   outline - purple outline (Check-ins)
//   dark    - solid dark, optional arrow tile (onboarding Next / Continue)
// Need a new look? Add a variant here, don't build a second button somewhere else.

import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import Colour, { withAlpha } from '../../constants/colour';
import { Radius, Size, Spacing } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

export type ButtonVariant = 'primary' | 'outline' | 'dark';
export type ButtonSize = 'md' | 'sm';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  // Optional SVG icon on the left, e.g. the Google "G"
  icon?: ReactNode;
  // Arrow tile on the right
  arrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function ArrowTile() {
  return (
    <View style={styles.tile}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 12h14M13 6l6 6-6 6"
          stroke={Colour.ink}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  arrow = false,
  loading = false,
  disabled = false,
  style,
  testID,
}: Props) {
  const isDark = variant === 'dark';
  const inactive = disabled || loading;

  // dark buttons go see-through brown when disabled instead of just dimming,
  // coz a dimmed near-black button still looked tappable
  const textColour = isDark
    ? inactive
      ? withAlpha(Colour.ink, 0.45)
      : Colour.background
    : variant === 'primary'
      ? Colour.textOnPrimary
      : Colour.primary;

  const pressedBg = isDark
    ? Colour.inkPressed
    : variant === 'primary'
      ? Colour.primaryDark
      : withAlpha(Colour.primary, 0.12);

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.small : isDark ? styles.dark : styles.medium,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        isDark && styles.darkFill,
        pressed && { backgroundColor: pressedBg },
        isDark && inactive && { backgroundColor: withAlpha(Colour.ink, 0.14) },
        !isDark && inactive && styles.inactive,
        arrow && styles.withArrow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColour} />
      ) : (
        <>
          <View style={styles.content}>
            {icon}
            <Text
              style={[
                styles.label,
                size === 'sm' && styles.labelSmall,
                isDark && styles.labelDark,
                { color: textColour },
              ]}
            >
              {label}
            </Text>
          </View>
          {arrow && <ArrowTile />}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
  },
  medium: { height: Size.buttonHeight },
  small: { height: Size.buttonHeightSmall },
  dark: { height: 62, borderRadius: Radius.cta },
  primary: { backgroundColor: Colour.primary },
  // 1.5 border coz 1 looked too thin on the outline buttons
  outline: {
    backgroundColor: Colour.transparent,
    borderWidth: 1.5,
    borderColor: Colour.primary,
  },
  darkFill: { backgroundColor: Colour.ink },
  inactive: { opacity: 0.5 },
  // label left, arrow tile right
  withArrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.large,
    fontWeight: FontWeight.bold,
  },
  labelSmall: { fontSize: FontSize.small },
  labelDark: { fontSize: 17, fontWeight: FontWeight.semibold, letterSpacing: 0.2 },
  tile: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: Colour.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
