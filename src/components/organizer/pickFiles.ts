import type { PickedFile } from '@/types/organizer';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
const CSV_TYPES = [
  'text/csv',
  'text/comma-separated-values',
  'application/csv',
  'application/vnd.ms-excel',
  'text/plain',
  'application/octet-stream',
];
const MAX_IMAGE_BYTES = 5242880;
export async function pickCsv(): Promise<PickedFile | null> {
  try {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
    if (res.canceled) return null;
    const f = res.assets[0];
    if (!/\.csv$/i.test(f.name)) {
      Alert.alert('CSV only', 'Pick a .csv file of ticket codes.');
      return null;
    }
    return { uri: f.uri, name: f.name, type: f.mimeType ?? 'text/csv' };
  } catch {
    Alert.alert('Could not open files', 'Your phone could not open the file picker. Try again, or move the CSV into Downloads first.');
    return null;
  }
}

export async function pickImage(): Promise<PickedFile | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5, allowsEditing: true, aspect: [16, 9] });
  if (res.canceled) return null;
  const a = res.assets[0];
  if (a.fileSize && a.fileSize > MAX_IMAGE_BYTES) {
    Alert.alert('Picture too big', 'Pick a picture under 5 MB, for example a screenshot or an image saved from WhatsApp.');
    return null;
  }
  return { uri: a.uri, name: a.fileName ?? 'event.jpg', type: a.mimeType ?? 'image/jpeg' };
}
