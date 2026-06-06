import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyItem = {
  id: string;
  title: string;
  imageEmoji: string;
  meta: string;
  highlight: string;
  likes: number;
  backgroundColor: string;
};

const items: KiertlyItem[] = [
  {
    id: 'drill',
    title: 'Akkuporakone Bosch',
    imageEmoji: '🔧',
    meta: 'Lainaa naapurilta • 2,4 km',
    highlight: 'Hyödynnä, älä osta uutta 🌱',
    likes: 12,
    backgroundColor: '#E7DDC9',
  },
  {
    id: 'suitcase',
    title: 'Matkalaukku',
    imageEmoji: '🧳',
    meta: 'Vuokraa helposti • 3,1 km',
    highlight: '4 € / päivä',
    likes: 7,
    backgroundColor: '#EFE5D6',
  },
  {
    id: 'chairs',
    title: 'Retkituolit 2 kpl',
    imageEmoji: '🏕️',
    meta: 'Vaihda tai lainaa • 1,7 km',
    highlight: 'Anna hyvän kiertää ♻️',
    likes: 5,
    backgroundColor: '#DDE4D0',
  },
  {
    id: 'speaker',
    title: 'Bluetooth-kaiutin',
    imageEmoji: '🔊',
    meta: 'Vuokraa lähialueelta • 0,8 km',
    highlight: '2 € / päivä',
    likes: 9,
    backgroundColor: '#E4DED3',
  },
];

export function KiertlyItemGrid() {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={[styles.image, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.imageEmoji}>{item.imageEmoji}</Text>
            <View style={styles.likesPill}>
              <Feather name="heart" size={14} color={theme.colors.text} />
              <Text style={styles.likesText}>{item.likes}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.textWrap}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.meta}>
                {item.meta}
              </Text>
              <Text numberOfLines={1} style={styles.highlight}>
                {item.highlight}
              </Text>
            </View>
            <Feather name="more-vertical" size={18} color={theme.colors.text} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  card: {
    width: '48.5%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  imageEmoji: {
    fontSize: 62,
  },
  likesPill: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    minWidth: 46,
    height: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  likesText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 5,
    paddingTop: 8,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 11,
    lineHeight: 14,
  },
  highlight: {
    marginTop: 5,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
