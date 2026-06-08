import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { KiertlyGridItem } from './KiertlyItemGrid';

type MapPinBase = {
  top: number;
  left: number;
};

type MapPin = MapPinBase & {
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const pinPositions: MapPinBase[] = [
  { top: 56, left: 84 },
  { top: 95, left: 260 },
  { top: 150, left: 350 },
  { top: 214, left: 48 },
  { top: 248, left: 235 },
  { top: 316, left: 328 },
];

type KiertlyVisualMapProps = {
  items?: KiertlyGridItem[];
};

function getMapPin(item: KiertlyGridItem, index: number): MapPin {
  const categories = item.filterCategories ?? [];
  const position = pinPositions[index % pinPositions.length];

  if (item.highlight.includes('/ päivä') || categories.includes('Vuokraa')) {
    return { ...position, label: 'Vuokraa', icon: 'umbrella' };
  }

  if (item.highlight === 'Vaihda' || categories.includes('Vaihda')) {
    return { ...position, label: 'Vaihda', icon: 'repeat' };
  }

  if (item.highlight === 'Ilmainen' || categories.includes('Ilmaiset')) {
    return { ...position, label: 'Ilmainen', icon: 'gift' };
  }

  if (categories.includes('Työkalut')) {
    return { ...position, label: 'Lainaa', icon: 'tool' };
  }

  return { ...position, label: 'Lainaa', icon: 'box' };
}

function getItemCountText(count: number) {
  return count === 1 ? '1 tavara' : `${count} tavaraa`;
}

export function KiertlyVisualMap({ items = [] }: KiertlyVisualMapProps) {
  const visiblePins = items.slice(0, pinPositions.length).map(getMapPin);

  return (
    <View style={styles.mapWrap}>
      <View style={[styles.park, styles.parkOne]} />
      <View style={[styles.park, styles.parkTwo]} />
      <View style={[styles.park, styles.parkThree]} />
      <View style={[styles.waterLine, styles.waterOne]} />
      <View style={[styles.waterLine, styles.waterTwo]} />

      {Array.from({ length: 16 }).map((_, index) => (
        <View
          key={`road-v-${index}`}
          style={[
            styles.road,
            styles.verticalRoad,
            {
              left: 8 + index * 34,
              transform: [{ rotate: index % 2 === 0 ? '24deg' : '-18deg' }],
            },
          ]}
        />
      ))}
      {Array.from({ length: 10 }).map((_, index) => (
        <View
          key={`road-h-${index}`}
          style={[
            styles.road,
            styles.horizontalRoad,
            {
              top: 26 + index * 36,
              transform: [{ rotate: index % 2 === 0 ? '-12deg' : '10deg' }],
            },
          ]}
        />
      ))}

      <View style={styles.userPulse}>
        <View style={styles.userDot} />
      </View>

      {visiblePins.map((pin, index) => (
        <View key={`${pin.label}-${pin.top}-${pin.left}-${index}`} style={[styles.pin, { top: pin.top, left: pin.left }]}> 
          <View style={styles.pinInner}>
            <Text style={styles.pinLabel}>{pin.label}</Text>
            <Feather name={pin.icon} size={27} color={theme.colors.white} strokeWidth={2.1} />
          </View>
          <View style={styles.pinPoint} />
        </View>
      ))}

      <View style={styles.nearbyCard}>
        <View style={styles.nearbyTitleRow}>
          <Text style={styles.nearbyTitle}>Lähellä sinua</Text>
          <Feather name="map-pin" size={16} color={theme.colors.text} strokeWidth={2} />
        </View>
        <Text style={styles.nearbyMeta}>{getItemCountText(items.length)}</Text>
        <Text style={styles.nearbyMeta}>2 km säteellä</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F3EFE5',
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.84)',
  },
  verticalRoad: {
    top: -96,
    width: 4,
    height: 660,
  },
  horizontalRoad: {
    left: -98,
    width: 660,
    height: 4,
  },
  waterLine: {
    position: 'absolute',
    width: 25,
    height: 660,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(155, 196, 213, 0.45)',
  },
  waterOne: {
    top: -120,
    left: 190,
    transform: [{ rotate: '31deg' }],
  },
  waterTwo: {
    top: -150,
    left: 302,
    transform: [{ rotate: '-21deg' }],
    opacity: 0.45,
  },
  park: {
    position: 'absolute',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(187, 205, 159, 0.38)',
  },
  parkOne: {
    top: 38,
    right: 42,
    width: 86,
    height: 64,
    transform: [{ rotate: '-11deg' }],
  },
  parkTwo: {
    left: 20,
    bottom: 190,
    width: 98,
    height: 76,
    transform: [{ rotate: '14deg' }],
  },
  parkThree: {
    right: 128,
    bottom: 150,
    width: 74,
    height: 56,
    transform: [{ rotate: '8deg' }],
  },
  userPulse: {
    position: 'absolute',
    top: '29%',
    left: '48%',
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -37,
    marginTop: -37,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(80, 150, 226, 0.14)',
  },
  userDot: {
    width: 26,
    height: 26,
    borderWidth: 4,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    backgroundColor: '#3A91EA',
  },
  pin: {
    position: 'absolute',
    width: 72,
    height: 91,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 12,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
    transform: [{ rotate: '-45deg' }],
  },
  pinInner: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  pinLabel: {
    marginBottom: 4,
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  pinPoint: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    width: 10,
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  nearbyCard: {
    position: 'absolute',
    right: 25,
    bottom: '42%',
    minWidth: 140,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  nearbyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: 4,
  },
  nearbyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  nearbyMeta: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});