import { AttendeeEvent, eventWhen, listEvents } from '@/services/attendee';
import { errorText } from '@/utils/errorText';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mystyles } from '../../../styles/main';
import { useUserStore } from '../../../useUserStore';

export default function EventLandingScreen() {
  const router = useRouter();
  const { eventId: linkEventId } = useLocalSearchParams<{ eventId?: string }>();
  const { eventId: savedEventId, setDetails } = useUserStore();

  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [chosenId, setChosenId] = useState<string>(linkEventId || savedEventId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await listEvents());
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (linkEventId) setChosenId(linkEventId);
  }, [linkEventId]);
  const event = events.find((e) => e.id === chosenId) ?? null;
  const getTicket = () => {
    if (!event) return;
    const isNewEvent = event.id !== savedEventId;
    setDetails({
      eventId: event.id,
      eventName: event.name,
      eventWhen: eventWhen(event.date, event.startAt),
      eventVenue: event.venue,
      eventDescription: event.description,
      eventImage: event.imageUrl ?? '',
      ...(isNewEvent ? { attendeeId: '', ticketCode: '', status: 'Pending', qrToken: '', qrCode: '' } : {}),
    });
    router.push('/(attendees)/create-account');
  };

  if (loading) {
    return (
      <View style={[mystyles.container2, styles.center]}>
        <ActivityIndicator size="large" color="#5A4DDC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[mystyles.container2, styles.center]}>
        <Text style={styles.message}>{error}</Text>
        <TouchableOpacity style={mystyles.button1} onPress={load}>
          <Text style={mystyles.btnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) {
    const open = events.filter((e) => e.status === 'upcoming');
    return (
      <View style={mystyles.container2}>
        <Text style={styles.listHeading}>Choose your event</Text>
        <Text style={styles.message}>
          {chosenId ? "We couldn't find the event in your link. Pick it below." : 'Tip: the organizer can send you a link that opens the event directly.'}
        </Text>
        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
          {open.length === 0 && <Text style={styles.message}>No events are open for tickets right now.</Text>}
          {open.map((e) => (
            <TouchableOpacity key={e.id} style={styles.listItem} onPress={() => setChosenId(e.id)}>
              <Text style={styles.listName}>{e.name}</Text>
              <Text style={styles.listSub}>{eventWhen(e.date, e.startAt)}</Text>
              <Text style={styles.listSub}>{e.venue}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  const isOpen = event.status === 'upcoming';
  return (
    <View style={mystyles.container2}>
      <View style={mystyles.logoContainer}>
        <View style={mystyles.logoPlaceholder}>
          <Image source={require('../../../assets/images/landing-icon.jpeg')} style={mystyles.logoPlaceholder}/>
        </View>
      </View>
      <View style={mystyles.card}>
        <Image source={event.imageUrl ? { uri: event.imageUrl } : require('../../../assets/images/landing-image.jpeg')} style={mystyles.banner} />
        <Text style={mystyles.title}>{event.name}</Text>
        <View style={{ flexDirection: 'row', marginTop:  -190,alignItems: 'center', gap: 6}}>
          <Ionicons name="calendar-clear" size={16} color="#5A4DDC"/>
          <Text> {eventWhen(event.date, event.startAt)}</Text>
        </View>

        <View style={{ flexDirection: 'row',marginTop:  10,alignItems: 'center', gap: 6}}>
          <Ionicons name="location-sharp" size={16} color="#5A4DDC"/>
           <Text> {event.venue}</Text>
        </View>

      </View>
      {isOpen ? (
        <TouchableOpacity style={mystyles.button1} onPress={getTicket}>
          <Text style={mystyles.btnText}>Get Ticket</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.message}>This event is no longer taking registrations.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', gap: 16 },
  message: { fontSize: 14, color: '#4A4A4A', textAlign: 'center', marginVertical: 12 },
  listHeading: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginTop: 24 },
  listItem: { borderWidth: 1.5, borderColor: '#5A4DDC', borderRadius: 16, padding: 16, gap: 4 },
  listName: { fontSize: 16, fontWeight: '600', color: '#1E1E1E' },
  listSub: { fontSize: 13, color: '#4A4A4A' },
});
