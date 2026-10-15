import { router } from 'expo-router';
import { Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mystyles } from '../../../styles/main';
import { useUserStore } from '../../../useUserStore';
// import { useRouter } from 'expo-router'; // Uncomment if using Expo Router

export default function MyDetailsScreen() {
  const { name, email, ticketType, ticketCode, status } = useUserStore();
  // const router = useRouter(); // Uncomment if using Expo Router

  // Dynamically compute initials from the first and last name
  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const avatarInitials = getInitials(name);
  const isValidStatus = status?.toLowerCase() === 'valid';

  // Function to handle pressing the avatar/profile
  const handleProfilePress = () => {
    // Example navigation if you have a profile details/edit screen:
    // router.push('/profile-settings'); 
    console.log('Profile avatar pressed');
  };

  return (
    <SafeAreaView style={mystyles.container3}>
      {/* Header section with back button and title */}
      <View style={mystyles.header2}>
        <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
          <Text style={mystyles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={mystyles.headerTitle}>My Details</Text>
      </View>

      {/* Pressable Profile Section */}
      <TouchableOpacity 
        style={mystyles.profileContainer} 
        activeOpacity={0.7} 
        onPress={handleProfilePress}
      >
        <View style={mystyles.avatar1}>
          <Text style={mystyles.avatarText}>{avatarInitials}</Text>
        </View>
        <View style={mystyles.profileTextContainer}>
          <Text style={mystyles.profileName}>{name || 'No Name Provided'}</Text>
          <Text style={mystyles.profileEmail}>{email || 'No Email Provided'}</Text>
        </View>
      </TouchableOpacity>

      <Text style={mystyles.sectionTitle}>Ticket Information</Text>
      <View style={mystyles.card1}>
        <View style={mystyles.row1}>
          <Text style={mystyles.label}>Ticket Type</Text>
          <Text style={mystyles.value}>{ticketType || 'Regular'}</Text>
        </View>
        
        <View style={mystyles.divider} />

        <View style={mystyles.row1}>
          <Text style={mystyles.label}>Ticket Code</Text>
          <Text style={mystyles.value}>{ticketCode || 'N/A'}</Text>
        </View>

        <View style={mystyles.divider} />

        <View style={mystyles.row1}>
          <Text style={mystyles.label}>Status</Text>
          <View style={[mystyles.statusBadge, isValidStatus ? mystyles.validBadge : mystyles.invalidBadge]}>
            <Text style={[mystyles.statusText, isValidStatus ? mystyles.validText : mystyles.invalidText]}>
              {status || 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}