import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { HomeCategory } from './KiertlyCategoryChips';
import { kiertlyDefaultItems, type KiertlyGridItem } from './KiertlyItemGrid';

type KiertlyMapPreviewProps = {
  activeCategory: HomeCategory;
  sharedItems: KiertlyGridItem[];
  onItemPress: (item: KiertlyGridItem) => void;
};

type PinPosition = {
  top: `${number}%`;
  left: `${number}%`;
};

const pinPositions: PinPosition[] = [
  { top: '18%', left: '24%' },
  { top: '27%', left: '49%' },
  { top: '22%', left: '72%' },
  { top: '58%', left: '37%' },
  { top: '68%', left: '20%' },
  { top: '50%', left: '63%' },
];

function getDistanceText(item: KiertlyGridItem) {
  const distanceMatch = item.meta.match(/(\d+[,.]\d+\s*km)/i);
  return distanceMatch?.[1] ?? 'Lähellä';
}

function getSubtitle(item: KiertlyGridItem) {
  return item.meta.split('•')[0]?.trim() || item.categoryLabel || 'Lainaa läheltä';
}

function getMapItems(activeCategory: HomeCategory, sharedItems: KiertlyGridItem[]) {
  const matchingSharedItems = sharedItems.filter(
    (item) => activeCategory === 'Kaikki' || item.filterCategories?.includes(activeCategory),
  );
  const baseItems = activeCategory === 'Kaikki'
    ? kiertlyDefaultItems
    : kiertlyDefaultItems.filter((item) => item.filterCategories?.includes(activeCategory));

  return [...matchingSharedItems, ...baseItems].filter((item) => item.isAvailable !== false);
}

export function KiertlyMapPreview({ activeCategory, sharedItems, onItemPress }: KiertlyMapPreviewProps) {
  const items = getMapItems(activeCategory, sharedItems);
  const selectedItem = items[0];
  const otherItems = items.slice(1, 6);

  if (!selectedItem) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Feather name="map-pin" size={42} color={theme.colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={styles.emptyTitle}>Ei karttakohteita</Text>
        <Text style={styles.emptyDescription}>
          Kun tähän kategoriaan lisätään saatavilla olevia tavaroita, ne näkyvät myös karttanäkymässä.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.mapCard}>
        <View style={styles.mapBackground}>
          <View style={[styles.waterShape, styles.leftWater]} />
          <View style={[styles.waterShape, styles.rightWater]} />
          <View style={[styles.parkShape, styles.topPark]} />
          <View style={[styles.parkShape, styles.bottomPark]} />

          <View style={[styles.road, styles.roadOne]} />
          <View style={[styles.road, styles.roadTwo]} />
          <View style={[styles.road, styles.roadThree]} />
          <View style={[styles.road, styles.roadFour]} />
          <View style={[styles.road, styles.roadFive]} />
          <View style={[styles.road, styles.roadSix]} />
          <View style={[styles.road, styles.roadSeven]} />

          <Text style={[styles.mapLabel, styles.meilahti]}>MEILAHTI</Text>
          <Text style={[styles.mapLabel, styles.toolo]}>TÖÖLÖ</Text>
          <Text style={[styles.mapLabel, styles.kallio]}>KALLIO</Text>
          <Text style={[styles.mapLabel, styles.kamppi]}>KAMPPI</Text>
          <Text style={[styles.mapLabel, styles.punavuori]}>PUNAVUORI</Text>
          <Text style={[styles.mapLabel, styles.kaivopuisto]}>KAIVOPUISTO</Text>
          <Text style={[styles.mapLabel, styles.eira]}>EIRA</Text>

          {otherItems.map((item, index) => {
            const position = pinPositions[index] ?? pinPositions[0];

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Avaa ${item.title}`}
                onPress={() => onItemPress(item)}
                style={[styles.pin, position]}
              >
                <Feather name="map-pin" size={34} color={theme.colors.primary} fill={theme.colors.primary} />
              </Pressable>
            );
          })}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Avaa ${selectedItem.title}`}
            onPress={() => onItemPress(selectedItem)}
            style={styles.selectedPin}
          >
            <View style={styles.selectedPinHalo} />
            <View style={styles.selectedPinBubble}>
              {selectedItem.imageUri ? (
                <Image source={{ uri: selectedItem.imageUri }} style={styles.selectedPinImage} resizeMode="cover" />
              ) : (
                <Feather name="package" size={26} color={theme.colors.primary} strokeWidth={1.8} />
              )}
            </View>
            <View style={styles.selectedPinStem} />
          </Pressable>

          <View style={styles.userLocation}>
            <View style={styles.userLocationDot} />
          </View>

          <View style={styles.mapControls}>
            <Pressable accessibilityRole="button" accessibilityLabel="Näytä oma sijainti" style={styles.mapControlButton}>
              <Feather name="crosshair" size={25} color={theme.colors.text} strokeWidth={1.9} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Näytä kohdelista" style={styles.mapControlButton}>
              <Feather name="list" size={25} color={theme.colors.text} strokeWidth={1.9} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Feather name="feather" size={22} color={theme.colors.primary} strokeWidth={2} />
          <View>
            <Text style={styles.sheetTitle}>Lähellä sinua</Text>
            <Text style={styles.sheetSubtitle}>1 kohde</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => onItemPress(selectedItem)}
          style={styles.selectedCard}
        >
          <View style={[styles.selectedCardImageWrap, { backgroundColor: selectedItem.backgroundColor }]}> 
            {selectedItem.imageUri ? (
              <Image source={{ uri: selectedItem.imageUri }} style={styles.selectedCardImage} resizeMode="cover" />
            ) : (
              <Feather name="package" size={36} color={theme.colors.primary} strokeWidth={1.8} />
            )}
          </View>

          <View style={styles.selectedCardTextWrap}>
            <Text numberOfLines={1} style={styles.selectedCardTitle}>{selectedItem.title}</Text>
            <Text numberOfLines={1} style={styles.selectedCardSubtitle}>{getSubtitle(selectedItem)}</Text>
            <View style={styles.distanceRow}>
              <Feather name="map-pin" size={14} color={theme.colors.mutedText} strokeWidth={1.9} />
              <Text style={styles.distanceText}>{getDistanceText(selectedItem)}</Text>
            </View>
          </View>

          <View style={styles.cardMetaRight}>
            <View style={styles.likesRow}>
              <Feather name="heart" size={18} color={theme.colors.text} strokeWidth={1.8} />
              <Text style={styles.likesText}>{selectedItem.likes}</Text>
            </View>
            <Text style={styles.priceText}>{selectedItem.highlight}</Text>
          </View>

          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  mapCard: {
    height: 480,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#EEE9DD',
  },
  mapBackground: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#EEE9DD',
  },
  waterShape: {
    position: 'absolute',
    backgroundColor: '#C7DDE7',
    opacity: 0.86,
  },
  leftWater: {
    left: -64,
    top: 112,
    width: 120,
    height: 230,
    borderRadius: 70,
    transform: [{ rotate: '12deg' }],
  },
  rightWater: {
    right: -54,
    top: 120,
    width: 126,
    height: 350,
    borderRadius: 70,
    transform: [{ rotate: '-10deg' }],
  },
  parkShape: {
    position: 'absolute',
    backgroundColor: '#D9E6CF',
    opacity: 0.78,
  },
  topPark: {
    left: 0,
    top: 0,
    width: 230,
    height: 118,
    borderBottomRightRadius: 110,
  },
  bottomPark: {
    right: 110,
    bottom: 76,
    width: 210,
    height: 180,
    borderRadius: 120,
  },
  road: {
    position: 'absolute',
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
  },
  roadOne: {
    left: -20,
    top: 84,
    width: 620,
    transform: [{ rotate: '-22deg' }],
  },
  roadTwo: {
    left: -70,
    top: 188,
    width: 680,
    transform: [{ rotate: '18deg' }],
  },
  roadThree: {
    left: -40,
    top: 320,
    width: 600,
    transform: [{ rotate: '-14deg' }],
  },
  roadFour: {
    left: 120,
    top: -40,
    width: 6,
    height: 610,
    transform: [{ rotate: '28deg' }],
  },
  roadFive: {
    left: 258,
    top: -60,
    width: 6,
    height: 650,
    transform: [{ rotate: '-13deg' }],
  },
  roadSix: {
    left: 392,
    top: -40,
    width: 6,
    height: 610,
    transform: [{ rotate: '20deg' }],
  },
  roadSeven: {
    left: -20,
    bottom: 96,
    width: 640,
    transform: [{ rotate: '7deg' }],
  },
  mapLabel: {
    position: 'absolute',
    color: '#918B7C',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  meilahti: {
    top: 26,
    left: 30,
  },
  toolo: {
    top: 104,
    left: '47%',
  },
  kallio: {
    top: 64,
    right: 76,
  },
  kamppi: {
    top: 236,
    left: '35%',
  },
  punavuori: {
    bottom: 62,
    left: 64,
  },
  kaivopuisto: {
    bottom: 138,
    left: '50%',
  },
  eira: {
    bottom: 74,
    left: '38%',
  },
  pin: {
    position: 'absolute',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPin: {
    position: 'absolute',
    top: '49%',
    left: '59%',
    width: 78,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPinHalo: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(107, 124, 58, 0.11)',
  },
  selectedPinBubble: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    backgroundColor: '#F7F4EC',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  selectedPinImage: {
    width: '100%',
    height: '100%',
  },
  selectedPinStem: {
    width: 10,
    height: 10,
    marginTop: -1,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  userLocation: {
    position: 'absolute',
    right: 170,
    bottom: 88,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(76, 146, 244, 0.18)',
  },
  userLocationDot: {
    width: 21,
    height: 21,
    borderWidth: 4,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    backgroundColor: '#348AF5',
  },
  mapControls: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  mapControlButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  bottomSheet: {
    marginTop: -86,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FBF8F1',
  },
  sheetHandle: {
    width: 54,
    height: 5,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sheetTitle: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  sheetSubtitle: {
    marginTop: 2,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCard: {
    minHeight: 122,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
  },
  selectedCardImageWrap: {
    width: 114,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  selectedCardImage: {
    width: '100%',
    height: '100%',
  },
  selectedCardTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  selectedCardTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  selectedCardSubtitle: {
    marginTop: 5,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: theme.spacing.sm,
  },
  distanceText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  cardMetaRight: {
    alignItems: 'flex-end',
    gap: theme.spacing.lg,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  priceText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
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
