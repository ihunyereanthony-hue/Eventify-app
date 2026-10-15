// The two file pickers the organizer screens share, so the checks live in one place.

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import type { PickedFile } from '@/types/organizer';

export async function pickCsv(): Promise<PickedFile | null> {
  // '*/*' on purpose: Android reports CSVs with all sorts of mime types, so we check the extension ourselves
  const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (res.canceled) return null;
  const f = res.assets[0];
  if (!/\.csv$/i.test(f.name)) {
    Alert.alert('CSV only', 'Pick a .csv file of ticket codes.');
    return null;
  }
  return { uri: f.uri, name: f.name, type: f.mimeType ?? 'text/csv' };
}

export async function pickImage(): Promise<PickedFile | null> {
  // on SDK 51 and older this has to be ImagePicker.MediaTypeOptions.Images instead
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [16, 9] });
  if (res.canceled) return null;
  const a = res.assets[0];
  return { uri: a.uri, name: a.fileName ?? 'event.jpg', type: a.mimeType ?? 'image/jpeg' };
}
