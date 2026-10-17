import { PinSmall } from '@/components/icons';
import { Images } from '@/constants/assets';
import Colour, { withAlpha } from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import type { StaffEvent } from '@/types/event';
import { dayOf, monthOf } from '@/utils/formatDate';
import { createElement } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { event: StaffEvent; onPress: () => void; height?: number };
export default function EventCoverCard({ event, onPress, height = 260 }: Props) {
  return createElement(
    Pressable,
    {
      onPress,
      accessibilityRole: 'button',
      accessibilityLabel: `${event.name}, ${event.venue}`,
      style: ({ pressed }: { pressed: boolean }) => [styles.card, { height }, pressed && styles.pressed],
    },
    createElement(
      ImageBackground,
      {
        source: event.imageUrl ? { uri: event.imageUrl } : Images.eventFallback,
        style: styles.fill,
        imageStyle: styles.img,
      },
      createElement(
        View,
        { style: styles.chip },
        createElement(Text, { style: styles.day }, dayOf(event.startsAt)),
        createElement(Text, { style: styles.month }, monthOf(event.startsAt)),
      ),
      createElement(
        View,
        { style: styles.bottom },
        createElement(Text, { style: styles.title, numberOfLines: 2 }, event.name),
        event.venue
          ? createElement(
              View,
              { style: styles.row },
              createElement(PinSmall, { size: 16, color: Colour.white }),
              createElement(Text, { style: styles.venue, numberOfLines: 1 }, event.venue),
            )
          : null,
      ),
    ),
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
