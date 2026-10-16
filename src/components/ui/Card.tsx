import React, { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colour from '../../constants/colour';
import { Radius, Spacing } from '../../constants/layout';

export type CardVariant = 'soft' | 'filled' | 'outline';
type Props = {
  children: ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ children, variant = 'soft', onPress, style }: Props) {
  const cardStyle = [styles.base, styles[variant], style];
  if (!onPress) return <View style={cardStyle}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  soft: { backgroundColor: Colour.card },
  filled: { backgroundColor: Colour.cardFilled },
  outline: {
    backgroundColor: Colour.transparent,
    borderWidth: 1.5,
    borderColor: Colour.border,
  },
  pressed: { opacity: 0.75 },
});
