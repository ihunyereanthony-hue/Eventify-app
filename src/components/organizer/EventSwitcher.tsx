import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colour from '@/constants/colour';
import { FontSize, FontWeight } from '@/constants/typography';
import type { StaffEvent } from '@/types/event';
import { ChevronDown } from './organizerIcons';

type Props = { events: StaffEvent[]; selectedId: string | null; onSelect: (id: string) => void };
export default function EventSwitcher({ events, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const current = events.find((e) => e.id === selectedId);
  if (events.length === 0) return null;

  return (
    <>
      <Pressable onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Choose event" style={styles.pill}>
        <Text style={styles.pillText} numberOfLines={1}>{current?.name ?? 'Choose an event'}</Text>
        <ChevronDown />
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <ScrollView>
              {events.map((e) => (
                <Pressable
                  key={e.id}
                  accessibilityRole="button"
                  onPress={() => {
                    onSelect(e.id);
                    setOpen(false);
                  }}
                  style={styles.item}
                >
                  <Text style={[styles.itemText, e.id === selectedId && styles.itemOn]}>{e.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 40, borderRadius: 999, backgroundColor: Colour.lavender },
  pillText: { flexShrink: 1, fontSize: FontSize.small, fontWeight: FontWeight.medium, color: Colour.primary },
  scrim: { flex: 1, backgroundColor: Colour.scrim, justifyContent: 'center', padding: 28 },
  sheet: { maxHeight: '60%', alignSelf: 'center', width: '100%', maxWidth: 420, backgroundColor: Colour.white, borderRadius: 20, paddingVertical: 8 },
  item: { paddingVertical: 16, paddingHorizontal: 20 },
  itemText: { fontSize: FontSize.body, color: Colour.ink },
  itemOn: { color: Colour.primary, fontWeight: FontWeight.semibold },
});
