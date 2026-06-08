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
  locationLabel?: string;
  createdAt?: string;
  ownerId?: string;
  ownerName?: string;
  isAvailable?: boolean;
};

export const kiertlyDefaultItems: KiertlyGridItem[] = [];

type KiertlyItemGridProps = {
  activeCategory: HomeCategory;
  sharedItems: KiertlyGridItem[];
  onItemPress: (item: KiertlyGridItem) => void;
};

function getActionLabel(item: KiertlyGridItem) {
  if (item.highlight.includes('/ päivä') || item.filterCategories?.includes('Vuokraa')) {
    return 'Vuokraa';
  }

  if (item.highlight === 'Vaihda' || item.filterCategories?.includes('Vaihda')) {
    return 'Vaihda';
  }

  if (item.highlight === 'Ilmainen' || item.filterCategories?.includes('Ilmaiset')) {
    return 'Näytä';
  }

  return 'Lainaa';
}

function getValueText(item: KiertlyGridItem) {
  if (item.isAvailable === false) {
    return 'Varattu';
  }

  if (item.highlight === 'Lainaa ilmaiseksi') {
    return 'Ilmainen';
  }

  return item.highlight;
}

function getPickupText(item: KiertlyGridItem) {
  if (item.isAvailable === false) {
    return 'Ei saatavilla';
  }

  return 'Nouto: Tänään';
}

function getDistanceText(index: number) {
  return `${String((index + 3) / 10).replace('.', ',')} km`;
}

export function KiertlyItemGrid({ activeCategory, sharedItems, onItemPress }: KiertlyItemGridProps) {
  const items = sharedItems.filter(
    (item) => activeCategory === 'Kaikki' || item.filterCategories?.includes(activeCategory),
  );

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <View style={styles.sheetHeader}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.sheetTitle}>Lähellä sinua</Text>
            <View style={styles.greenDot} />
          </View>
          <Text style={styles.sheetSubtitle}>Lainaa, vuokraa, vaihda tai anna. Kaikki läheltä.</Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyHint}>
          <Text style={styles.emptyTitle}>Ei vielä tavaroita lähellä</Text>
          <Text style={styles.emptyText}>Lisää ensimmäinen tavara Jaa-painikkeesta.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => onItemPress(item)}
              style={styles.card}
            >
              <View style={[styles.imageWrap, { backgroundColor: item.backgroundColor }]}> 
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.itemPhoto} resizeMode="cover" />
                ) : (
                  <Feather name="package" size={36} color={theme.colors.primary} strokeWidth={1.7} />
                )}
              </View>

              <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.itemValue}>{getValueText(item)}</Text>
                <View style={styles.metaRow}>
                  <Feather name="map-pin" size={13} color={theme.colors.mutedText} strokeWidth={2} />
                  <Text style={styles.metaText}>{getDistanceText(index)}</Text>
                  <Feather name="clock" size={13} color={theme.colors.mutedText} strokeWidth={2} />
                  <Text numberOfLines={1} style={styles.metaText}>{getPickupText(item)}</Text>
                </View>
              </View>

              <View style={styles.rightSide}>
                <Feather name="heart" size={22} color={theme.colors.text} strokeWidth={1.8} />
                <View style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{getActionLabel(item)}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: -28,
    marginHorizontal: theme.spacing.md,
    paddingTop: 8,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 252, 245, 0.96)',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -5 },
    elevation: 5,
  },
  handle: {
    alignSelf: 'center',
    width: 54,
    height: 5,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: '#D8D1C4',
  },
  sheetHeader: {
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sheetTitle: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  sheetSubtitle: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHint: {
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  list: {
    gap: 8,
  },
  card: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: 7,
    borderWidth: 1,
    borderColor: 'rgba(229, 225, 216, 0.82)',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  imageWrap: {
    width: 96,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  itemPhoto: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  itemValue: {
    marginTop: 2,
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  metaText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
  },
  rightSide: {
    width: 88,
    height: 69,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  actionButton: {
    minWidth: 74,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
