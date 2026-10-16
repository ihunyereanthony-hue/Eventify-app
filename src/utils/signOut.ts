import { Alert } from 'react-native';
import { logout } from '@/services/auth';

export function confirmSignOut() {
  Alert.alert('Sign out?', 'You will need to log in again to scan or manage events.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
  ]);
}
