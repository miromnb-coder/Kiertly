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

function getAvailabilityBadge(item: KiertlyGridItem) {
  if (item.isAvailable === false) {
    return {
      icon: 'pause-circle' as const,
      text: 'Varattu',
      isMuted: true,
    };
  }

  if (item.highlight.includes('/ päivä') || item.filterCategories?.includes('Vuokraa')) {
    return {
      icon: 'tag' as const,
      text: 'Vuokrattavissa',
      isMuted: false,
    };
  }

  if (item.highlight === 'Ilmainen' || item.filterCategories?.includes('Ilmaiset')) {
    return {
      icon: 'gift' as const,
      text: 'Ilmainen',
      isMuted: false,
    };
  }

  if (item.highlight === 'Vaihda' || item.filterCategories?.includes('Vaihda')) {
    return {
      icon: 'repeat' as const,
      text: 'Vaihdettavissa',
      isMuted: false,
    };
  }

  return {
    icon: 'calendar' as const,
    text: 'Lainattavissa',
    isMuted: false,
  };
}

function getLocationText(item: KiertlyGridItem) {
  return item.locationLabel || 'Sijainti lisäämättä';
}

function getOwnerName(item: KiertlyGridItem) {
  return item.ownerName || 'Kiertly-käyttäjä';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'K';
}

export function KiertlyItemGrid({ activeCategory, sharedItems, onItemPress }: KiertlyItemGridProps) {
  const items = sharedItems.filter(
    (item) => activeCategory === 'Kaikki' || item.filterCategories?.includes(activeCategory),
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Feather name="box" size={42} color={theme.colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={styles.emptyTitle}>Ei vielä tavaroita</Text>
        <Text style={styles.emptyDescription}>
          Kun käyttäjät lisäävät tavaroita, ne näkyvät täällä. Voit lisätä ensimmäisen Jaa-painikkeesta.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.feedWrap}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lähellä sinua</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={17} color={theme.colors.mutedText} strokeWidth={2} />
          <Text style={styles.locationText}>Saatavilla nyt</Text>
        </View>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const badge = getAvailabilityBadge(item);
          const ownerName = getOwnerName(item);

          return (
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
                  <Feather name="package" size={46} color={theme.colors.primary} strokeWidth={1.7} />
                )}
                {item.isAvailable === false ? (
                  <View style={styles.unavailableOverlay} />
                ) : null}
              </View>

              <View style={styles.cardBody}>
                <Text numberOfLines={1} style={styles.title}>{item.title}</Text>

                <View style={[styles.badge, badge.isMuted && styles.mutedBadge]}>
                  <Feather name={badge.icon} size={15} color={theme.colors.primary} strokeWidth={2} />
                  <Text numberOfLines={1} style={styles.badgeText}>{badge.text}</Text>
                </View>

                <View style={styles.ownerRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(ownerName)}</Text>
                  </View>
                  <View style={styles.ownerTextWrap}>
                    <Text numberOfLines={1} style={styles.ownerName}>{ownerName}</Text>
                    <Text numberOfLines={1} style={styles.itemLocation}>{getLocationText(item)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.saveButton}>
                <Feather name="heart" size={22} color={theme.colors.text} strokeWidth={1.8} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedWrap: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    gap: 0,
  },
  card: {
    minHeight: 154,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.045,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  imageWrap: {
    width: '42%',
    minHeight: 154,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemPhoto: {
    width: '100%',
    height: '100%',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 24, 0.35)',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingRight: 48,
  },
  title: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  badge: {
    alignSelf: 'flex-start',
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: theme.spacing.sm,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: '#EEF3E4',
  },
  mutedBadge: {
    backgroundColor: '#F3E9E4',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  ownerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  ownerName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  itemLocation: {
    marginTop: 2,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -21,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
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
