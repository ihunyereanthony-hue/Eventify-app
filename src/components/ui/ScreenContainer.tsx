// Wrap every screen in this. Safe-area padding, background and side padding
// live here so no screen has to remember them (content hid behind the notch before).
// On tablets the content stops at 900px and centres, otherwise lists stretch edge to edge.

import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import Colour from '../../constants/colour';
import { Size } from '../../constants/layout';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  // default is all four edges
  edges?: Edge[];
};

export default function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  backgroundColor = Colour.background,
  style,
  edges,
}: Props) {
  const padding = padded ? { paddingHorizontal: Size.screenPadding } : null;

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, padding, style]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.fill, padding, style]}>
          <View style={styles.inner}>{children}</View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  // flexGrow, not flex, coz ScrollView content has to be allowed to grow past the screen
  scrollContent: { flexGrow: 1 },
  inner: { width: '100%', maxWidth: 900, alignSelf: 'center', flexGrow: 1, flexShrink: 1 },
});
