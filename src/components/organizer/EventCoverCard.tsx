// The big photo card from the organizer Figma: date chip top-left, title and venue over the photo.
// No cover from the backend means the repo's fallback image, same as the staff cards.

import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { PinSmall } from '@/components/icons';
import { Images } from '@/constants/assets';
import Colour, { withAlpha } from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import type { StaffEvent } from '@/types/event';
import { dayOf, monthOf } from '@/utils/formatDate';

type Props = { event: StaffEvent; onPress: () => void; height?: number };

export default function EventCoverCard({ event, onPress, height = 260 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.name}, ${event.venue}`}
      style={({ pressed }) => [styles.card, { height }, pressed && styles.pressed]}
    >
      <ImageBackground source={event.imageUrl ? { uri: event.imageUrl } : Images.eventFallback} style={styles.fill} imageStyle={styles.img}>
        <View style={styles.chip}>
          <Text style={styles.day}>{dayOf(event.startsAt)}</Text>
          <Text style={styles.month}>{monthOf(event.startsAt)}</Text>
        </View>
        {/* dark strip behind the text, otherwise white on a bright photo can't be read */}
        <View style={styles.bottom}>
          <Text style={styles.title} numberOfLines={2}>{event.name}</Text>
          {!!event.venue && (
            <View style={styles.row}>
              <PinSmall size={16} color={Colour.white} />
              <Text style={styles.venue} numberOfLines={1}>{event.venue}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, overflow: 'hidden', backgroundColor: Colour.lavender },
  pressed: { opacity: 0.85 },
  fill: { flex: 1, justifyContent: 'space-between' },
  img: { borderRadius: 28 },
  chip: { alignSelf: 'flex-start', margin: 16, minWidth: 48, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, backgroundColor: Colour.lavender, alignItems: 'center' },
  day: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: Colour.primary, lineHeight: 18 },
  month: { fontSize: 12, color: Colour.primary },
  bottom: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 18, backgroundColor: withAlpha(Colour.black, 0.38) },
  title: { fontSize: FontSize.large, fontWeight: FontWeight.bold, color: Colour.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  venue: { flex: 1, fontSize: FontSize.small, color: Colour.white },
});
