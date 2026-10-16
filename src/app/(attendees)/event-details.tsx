import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mystyles } from '../../../styles/main';
import { useUserStore } from '../../../useUserStore';

export default function EventDetailsScreen() {
  const router = useRouter();
  const { eventName, eventWhen, eventVenue, eventDescription, eventImage } = useUserStore();

  return (
    <SafeAreaView style={mystyles.safeArea}>
      <View style={mystyles.container4}>
        <View style={mystyles.header3}>
         <TouchableOpacity onPress={() => router.back()} style={mystyles.backButton}>
        <Text style={mystyles.backArrow}>‹</Text>
        </TouchableOpacity>
          <Text style={mystyles.headerTitle}>Event Details</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={mystyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={mystyles.imageContainer}>
            <Image
              source={eventImage ? { uri: eventImage } : require('../../../assets/images/landing-image.jpeg')}
              style={mystyles.bannerImage}
            />
          </View>

          <View style={mystyles.infoSection1}>
            <Text style={mystyles.eventTitle1}>{eventName || 'Event'}</Text>
            <View style={mystyles.metaRow1}>
              <Feather name="calendar" size={16} color="#111111" style={mystyles.metaIcon1} />
              <Text style={mystyles.metaText1}>{eventWhen}</Text>
            </View>
            <View style={mystyles.metaRow1}>
              <Ionicons name="location-outline" size={17} color="#111111" style={mystyles.metaIcon1} />
              <Text style={mystyles.metaText1}>{eventVenue}</Text>
            </View>
          </View>
          <View style={mystyles.aboutSection}>
            <Text style={mystyles.aboutHeading}>About Event</Text>
            <Text style={mystyles.aboutDescription}>{eventDescription || 'No description added yet.'}</Text>
          </View>
        </ScrollView>

        <View style={mystyles.footer1}>
          <TouchableOpacity
            style={mystyles.actionButton}
            onPress={() => router.push('/(attendees)/my-details')}
            activeOpacity={0.8}
          >
            <Text style={mystyles.actionButtonText}>My Details</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
