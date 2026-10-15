import { Alert } from 'react-native';

import { logout } from '@/services/auth';

// Asks first, then signs out. The route guards notice the session is gone and
// send the user to /login by themselves, so there's no navigation here.
export function confirmSignOut() {
  Alert.alert('Sign out?', 'You will need to log in again to scan or manage events.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
  ]);
}
