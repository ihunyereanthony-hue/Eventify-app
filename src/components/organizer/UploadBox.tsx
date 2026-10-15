// Dashed "Upload Ticket Code here" box + the Choose file button. Used when creating an event
// (file is held until Done) and on the event's Tickets tab (file goes up straight away).
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import Colour from '@/constants/colour';
import { FontSize } from '@/constants/typography';

import { UploadFileIcon } from './organizerIcons';

type Props = { fileName?: string | null; onPick: () => void; busy?: boolean };

export default function UploadBox({ fileName, onPick, busy }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <UploadFileIcon />
        <Text style={styles.title}>{fileName ?? 'Upload Ticket Code here'}</Text>
        {/* the backend reads a CSV, so that's all we offer (the Figma also says TXT / XLS) */}
        <Text style={styles.sub}>Supported: CSV</Text>
      </View>
      <Button label={fileName ? 'Choose another file' : 'Choose file'} variant="outline" onPress={onPick} loading={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  box: { alignItems: 'center', gap: 6, paddingVertical: 26, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colour.border, backgroundColor: Colour.field },
  title: { marginTop: 6, fontSize: FontSize.body, color: Colour.textHeading, textAlign: 'center' },
  sub: { fontSize: FontSize.small, color: Colour.textTan },
});
