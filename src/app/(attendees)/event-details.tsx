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

export default function EventDetailsScreen() {
  const router = useRouter();

  const event = {
    title: 'Tech & Creators Summit 2026',
    date: 'Sat, Oct 17th, 2026 - 10:00 AM',
    location: 'Lagos, Nigeria.',
    description:
      'The Tech & Creators Summit 2026 is the ultimate convergence point for developers, digital creators, designers, and tech entrepreneurs. Dive deep into the future of the creator economy, explore cutting-edge AI tools, and connect with global innovators. Join us to transform your craft, build sustainable digital businesses, and scale your impact.',
    bannerImage: require('../../../assets/images/landing-image.jpeg'),
  };

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
              source={event.bannerImage} 
              style={mystyles.bannerImage}
            />
          </View>

          <View style={mystyles.infoSection1}>
            <Text style={mystyles.eventTitle1}>{event.title}</Text>

            <View style={mystyles.metaRow1}>
              <Feather name="calendar" size={16} color="#111111" style={mystyles.metaIcon1} />
              <Text style={mystyles.metaText1}>{event.date}</Text>
            </View>

            <View style={mystyles.metaRow1}>
              <Ionicons name="location-outline" size={17} color="#111111" style={mystyles.metaIcon1} />
              <Text style={mystyles.metaText1}>{event.location}</Text>
            </View>
          </View>

          <View style={mystyles.aboutSection}>
            <Text style={mystyles.aboutHeading}>About Event</Text>
            <Text style={mystyles.aboutDescription}>{event.description}</Text>
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