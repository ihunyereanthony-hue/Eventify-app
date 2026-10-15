// The purple hero + white sheet that every auth screen sits on.
// Phones stack them, tablets put them side by side like the Figma.

import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colour from '../constants/colour';
import { FontSize, FontWeight } from '../constants/typography';
import { useLayout } from '../hooks/useLayout';
import Logo from './Logo';
import { ScreenContainer } from './ui';

type Props = { title: string; subtitle?: string; children: ReactNode };

export default function AuthShell({ title, subtitle, children }: Props) {
  const { isTablet } = useLayout();
  return (
    <ScreenContainer scroll padded={false} backgroundColor={Colour.primary} edges={['top', 'left', 'right']}>
      <View style={[styles.wrap, isTablet && styles.wrapRow]}>
        <View style={[styles.hero, isTablet && styles.heroSide]}>
          <Logo light />
          <Text style={styles.headline}>Fast Scan, Smooth Entry.</Text>
          <Text style={styles.sub}>Verify, scan and check in attendees while keeping your event moving.</Text>
        </View>
        <View style={[styles.sheet, isTablet && styles.sheetSide]}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1 },
  wrapRow: { flexDirection: 'row' },
  hero: { paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40 },
  heroSide: { flex: 1, justifyContent: 'center', paddingBottom: 0 },
  headline: { marginTop: 40, fontSize: FontSize.hero - 4, fontWeight: FontWeight.semibold, lineHeight: 42, color: Colour.white },
  sub: { marginTop: 10, fontSize: FontSize.small, color: Colour.primaryLight },
  sheet: { flexGrow: 1, backgroundColor: Colour.white, borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 28, paddingBottom: 48 },
  sheetSide: { flex: 1, borderTopRightRadius: 0, borderBottomLeftRadius: 34, justifyContent: 'center' },
  title: { fontSize: FontSize.heading - 2, fontWeight: FontWeight.semibold, color: Colour.textHeading },
  subtitle: { marginTop: 6, fontSize: FontSize.small, color: Colour.textTan },
  body: { marginTop: 22, gap: 18 },
});
