import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Images } from '../constants/assets';
import Colour from '../constants/colour';
import { FontSize, FontWeight } from '../constants/typography';
import type { StaffEvent } from '../types/event';
import { formatEventDate } from '../utils/formatDate';
import { Button } from './ui';
import { CalendarSmall, GuestsSmall, PinSmall } from './icons';

type Action = { label: string; onPress: () => void };
type Props = { event: StaffEvent; primary: Action; secondary: Action };

export default function EventCard({ event, primary, secondary }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={event.imageUrl ? { uri: event.imageUrl } : Images.eventFallback} style={styles.image} accessibilityLabel={`${event.name} cover`} />
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{event.name}</Text>
            {event.isLive ? (
              <View style={styles.live}>
                <Text style={styles.liveText}>Live</Text>
              </View>
            ) : (
              <Text style={styles.upcoming}>Upcoming</Text>
            )}
          </View>
          <View style={styles.meta}>
            <CalendarSmall />
            <Text style={styles.metaText}>{formatEventDate(event.startsAt)}</Text>
          </View>
          {!!event.venue && (
            <View style={styles.meta}>
              <PinSmall />
              <Text style={styles.metaText}>{event.venue}</Text>
            </View>
          )}
          {event.guestCount != null && (
            <View style={styles.meta}>
              <GuestsSmall />
              <Text style={styles.metaText}>{`${event.guestCount} registered guests`}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <Button label={primary.label} onPress={primary.onPress} size="sm" style={styles.flex} />
        <Button label={secondary.label} variant="outline" onPress={secondary.onPress} size="sm" style={styles.flex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colour.cardBeige, borderRadius: 20, padding: 16 },
  top: { flexDirection: 'row', gap: 12 },
  image: { width: 52, height: 52, borderRadius: 10 },
  text: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { flex: 1, fontSize: FontSize.body, fontWeight: FontWeight.semibold, lineHeight: 21, color: Colour.textHeading },
  live: { backgroundColor: Colour.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  liveText: { fontSize: 12, fontWeight: FontWeight.medium, color: Colour.textOnPrimary },
  upcoming: { fontSize: 12, color: Colour.textTan, marginTop: 3 },
  meta: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 5 },
  metaText: { flex: 1, fontSize: FontSize.caption, lineHeight: 17, color: Colour.textTan },
  actions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  flex: { flex: 1 },
});
