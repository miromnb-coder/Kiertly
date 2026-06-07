import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { HomeCategory } from './KiertlyCategoryChips';

export type KiertlyGridItem = {
  id: string;
  title: string;
  meta: string;
  highlight: string;
  likes: number;
  backgroundColor: string;
  imageUri?: string;
  imageUris?: string[];
  imagePaths?: string[];
  filterCategories?: HomeCategory[];
  categoryLabel?: string;
  detailDescription?: string;
  ownerId?: string;
  ownerName?: string;
  isAvailable?: boolean;
};

export const kiertlyDefaultItems: KiertlyGridItem[] = [
  {
    id: 'drill',
    title: 'Akkuporakone Bosch',
    meta: 'Lainaa naapurilta • 2,4 km',
    highlight: 'Lainaa ilmaiseksi',
    likes: 12,
    backgroundColor: '#E7DDC9',
    categoryLabel: 'Työkalut',
    isAvailable: true,
    detailDescription:
      'Tehokas ja kevyt Boschin akkuporakone sopii kotiprojekteihin kuin pieniin remontteihin. Mukana akku ja laturi. Voin tarvittaessa neuvoa käytössä. Noudettavissa joustavasti.',
  },
  {
    id: 'suitcase',
    title: 'Matkalaukku',
    meta: 'Vuokraa helposti • 3,1 km',
    highlight: '4 € / päivä',
    likes: 7,
    backgroundColor: '#EFE5D6',
    categoryLabel: 'Matkailu',
    isAvailable: true,
    detailDescription:
      'Siisti ja kevyt matkalaukku viikonloppureissuille tai pidemmälle matkalle. Nouto onnistuu joustavasti lähialueelta.',
  },
  {
    id: 'chairs',
    title: 'Retkituolit 2 kpl',
    meta: 'Vaihda tai lainaa • 1,7 km',
    highlight: 'Vaihda',
    likes: 5,
    backgroundColor: '#DDE4D0',
    categoryLabel: 'Retkeily',
    isAvailable: true,
    detailDescription:
      'Kaksi kokoontaitettavaa retkituolia mökille, piknikille tai retkelle. Kevyet kantaa ja helppo pakata mukaan.',
  },
  {
    id: 'speaker',
    title: 'Bluetooth-kaiutin',
    meta: 'Vuokraa lähialueelta • 0,8 km',
    highlight: '2 € / päivä',
    likes: 9,
    backgroundColor: '#E4DED3',
    categoryLabel: 'Elektroniikka',
    isAvailable: true,
    detailDescription:
      'Pieni mutta tehokas bluetooth-kaiutin juhliin, mökille tai piknikille. Akku kestää hyvin yhden päivän käytön.',
  },
];

const itemsByCategory: Record<HomeCategory, KiertlyGridItem[]> = {
  Kaikki: kiertlyDefaultItems,
  Lainaa: [],
  Vuokraa: [],
  Vaihda: [],
  Ilmaiset: [],
  Lähellä: [],
};

type KiertlyItemGridProps = {
  activeCategory: HomeCategory;
  sharedItems: KiertlyGridItem[];
  onItemPress: (item: KiertlyGridItem) => void;
};

export function KiertlyItemGrid({ activeCategory, sharedItems, onItemPress }: KiertlyItemGridProps) {
  const baseItems = itemsByCategory[activeCategory];
  const matchingSharedItems = sharedItems.filter(
    (item) => activeCategory === 'Kaikki' || item.filterCategories?.includes(activeCategory),
  );
  const items = activeCategory === 'Kaikki'
    ? [...matchingSharedItems, ...baseItems]
    : matchingSharedItems;

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Feather name="box" size={42} color={theme.colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={styles.emptyTitle}>Ei vielä tavaroita</Text>
        <Text style={styles.emptyDescription}>
          Tähän kategoriaan lisätään myöhemmin tavaroita.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => onItemPress(item)}
          style={styles.card}
        >
          <View style={[styles.image, { backgroundColor: item.backgroundColor }]}> 
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.itemPhoto} resizeMode="cover" />
            ) : null}
            {item.isAvailable === false ? (
              <View style={styles.unavailableOverlay}>
                <Text style={styles.unavailableText}>Varattu</Text>
              </View>
            ) : null}
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
                {item.isAvailable === false ? 'Ei saatavilla juuri nyt' : item.highlight}
              </Text>
            </View>
            <Feather name="more-vertical" size={18} color={theme.colors.text} />
          </View>
        </Pressable>
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
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  itemPhoto: {
    width: '100%',
    height: '100%',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 36, 24, 0.45)',
  },
  unavailableText: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
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
  emptyState: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 112,
  },
  emptyIconCircle: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
