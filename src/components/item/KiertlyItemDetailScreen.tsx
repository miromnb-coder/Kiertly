import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';
import { KiertlyItemActionBar } from './KiertlyItemActionBar';
import { KiertlyItemDetailHeader } from './KiertlyItemDetailHeader';
import { KiertlyItemHeroImage } from './KiertlyItemHeroImage';
import { KiertlyItemInfoRows } from './KiertlyItemInfoRows';
import { KiertlyOwnerCard } from './KiertlyOwnerCard';

type KiertlyItemDetailScreenProps = {
  item: KiertlyGridItem;
  isSubmittingRequest?: boolean;
  onBack: () => void;
  onRequestItem: (item: KiertlyGridItem) => void;
  onChatPress: (item: KiertlyGridItem) => void;
};

function getPrimaryActionLabel(highlight: string) {
  if (highlight.includes('/ päivä')) {
    return 'Vuokraa';
  }

  if (highlight === 'Vaihda') {
    return 'Ehdota vaihtoa';
  }

  if (highlight === 'Ilmainen') {
    return 'Pyydä tavaraa';
  }

  if (highlight.includes('€')) {
    return 'Osta';
  }

  return 'Pyydä lainaan';
}

function getDescription(item: KiertlyGridItem) {
  if (item.detailDescription?.trim()) {
    return item.detailDescription.trim();
  }

  return 'Tavaralle ei ole vielä lisätty tarkempaa kuvausta. Voit kysyä lisätietoja omistajalta viestillä ennen lainausta.';
}

function getLocationLabel(item: KiertlyGridItem) {
  return item.locationLabel || 'Sijainti lisäämättä';
}

function getAvailabilityText(item: KiertlyGridItem) {
  return item.isAvailable === false ? 'Varattu juuri nyt' : 'Saatavilla';
}

function getConditionLabel(item: KiertlyGridItem) {
  return item.isAvailable === false ? 'Varattu' : 'Saatavilla';
}

function getMetaText(item: KiertlyGridItem) {
  const methodText = item.meta.split('•')[0]?.trim();
  const locationLabel = getLocationLabel(item);

  if (methodText) {
    return `${methodText} • ${locationLabel}`;
  }

  return locationLabel;
}

function formatCreatedAt(value?: string) {
  if (!value) {
    return 'Lisätty äskettäin';
  }

  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return 'Lisätty äskettäin';
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfCreatedAt = new Date(
    createdAt.getFullYear(),
    createdAt.getMonth(),
    createdAt.getDate(),
  );
  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfCreatedAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDifference <= 0) {
    return 'Lisätty tänään';
  }

  if (dayDifference === 1) {
    return 'Lisätty eilen';
  }

  if (dayDifference < 7) {
    return `Lisätty ${dayDifference} päivää sitten`;
  }

  return `Lisätty ${String(createdAt.getDate()).padStart(2, '0')}.${String(createdAt.getMonth() + 1).padStart(2, '0')}.`;
}

export function KiertlyItemDetailScreen({
  item,
  isSubmittingRequest = false,
  onBack,
  onRequestItem,
  onChatPress,
}: KiertlyItemDetailScreenProps) {
  const category = item.categoryLabel ?? 'Kategoria lisäämättä';
  const locationLabel = getLocationLabel(item);
  const availabilityText = getAvailabilityText(item);
  const imageCount = item.imageUris?.length || (item.imageUri ? 1 : 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KiertlyItemDetailHeader onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <KiertlyItemHeroImage
          imageUri={item.imageUri}
          backgroundColor={item.backgroundColor}
          imageCount={imageCount}
        />

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{getMetaText(item)}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <View style={[styles.statusDot, item.isAvailable === false && styles.unavailableDot]} />
              <Text style={styles.badgeText}>{getConditionLabel(item)}</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="map-pin" size={13} color={theme.colors.mutedText} />
              <Text style={styles.badgeText}>{locationLabel}</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="clock" size={13} color={theme.colors.mutedText} />
              <Text style={styles.badgeText}>{formatCreatedAt(item.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <Feather name="repeat" size={20} color={theme.colors.primary} />
            <Text style={styles.highlight}>{item.highlight}</Text>
          </View>

          <Text style={styles.description}>{getDescription(item)}</Text>

          <KiertlyOwnerCard ownerName={item.ownerName} locationLabel={locationLabel} />
          <KiertlyItemInfoRows
            category={category}
            availabilityText={availabilityText}
            locationLabel={locationLabel}
          />
        </View>
      </ScrollView>

      <KiertlyItemActionBar
        primaryLabel={getPrimaryActionLabel(item.highlight)}
        isSubmitting={isSubmittingRequest}
        onChatPress={() => onChatPress(item)}
        onPrimaryPress={() => onRequestItem(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 96,
  },
  body: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  badge: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  unavailableDot: {
    backgroundColor: '#A14C3A',
  },
  badgeText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  highlight: {
    color: theme.colors.primary,
    fontSize: 21,
    fontWeight: '800',
  },
  description: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
});
