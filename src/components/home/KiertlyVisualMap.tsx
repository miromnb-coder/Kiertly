import { Feather } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

import { theme } from '../../constants/theme';
import type { KiertlyGridItem } from './KiertlyItemGrid';

type MapCoordinate = {
  latitude: number;
  longitude: number;
};

type MapPin = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  coordinate: MapCoordinate;
};

const defaultRegion: Region = {
  latitude: 60.1699,
  longitude: 24.9384,
  latitudeDelta: 0.022,
  longitudeDelta: 0.018,
};

const userCoordinate: MapCoordinate = {
  latitude: 60.1699,
  longitude: 24.9384,
};

const pinCoordinates: MapCoordinate[] = [
  { latitude: 60.1742, longitude: 24.9294 },
  { latitude: 60.1731, longitude: 24.9479 },
  { latitude: 60.1677, longitude: 24.9557 },
  { latitude: 60.1648, longitude: 24.9274 },
  { latitude: 60.1625, longitude: 24.9443 },
  { latitude: 60.1762, longitude: 24.9413 },
];

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#F3EFE5' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8D8A7C' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#F7F4EC' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#DED8C9' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#F1EDE3' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#CCD8B5' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#E6E0D0' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#A39F91' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#C9DCE4' }],
  },
];

type KiertlyVisualMapProps = {
  items?: KiertlyGridItem[];
};

function getMapPin(item: KiertlyGridItem, index: number): MapPin {
  const categories = item.filterCategories ?? [];
  const coordinate = pinCoordinates[index % pinCoordinates.length];

  if (item.highlight.includes('/ päivä') || categories.includes('Vuokraa')) {
    return { coordinate, label: 'Vuokraa', icon: 'umbrella' };
  }

  if (item.highlight === 'Vaihda' || categories.includes('Vaihda')) {
    return { coordinate, label: 'Vaihda', icon: 'repeat' };
  }

  if (item.highlight === 'Ilmainen' || categories.includes('Ilmaiset')) {
    return { coordinate, label: 'Ilmainen', icon: 'gift' };
  }

  if (categories.includes('Työkalut')) {
    return { coordinate, label: 'Lainaa', icon: 'tool' };
  }

  return { coordinate, label: 'Lainaa', icon: 'box' };
}

function getItemCountText(count: number) {
  return count === 1 ? '1 tavara' : `${count} tavaraa`;
}

export function KiertlyVisualMap({ items = [] }: KiertlyVisualMapProps) {
  const visiblePins = items.slice(0, pinCoordinates.length).map(getMapPin);

  return (
    <View style={styles.mapWrap}>
      <MapView
        customMapStyle={mapStyle}
        initialRegion={defaultRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        rotateEnabled={false}
        showsBuildings={false}
        showsCompass={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        showsScale={false}
        showsTraffic={false}
        style={StyleSheet.absoluteFill}
        toolbarEnabled={false}
      >
        <Marker coordinate={userCoordinate} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={styles.userPulse}>
            <View style={styles.userDot} />
          </View>
        </Marker>

        {visiblePins.map((pin, index) => (
          <Marker
            key={`${pin.label}-${pin.coordinate.latitude}-${pin.coordinate.longitude}-${index}`}
            coordinate={pin.coordinate}
            anchor={{ x: 0.5, y: 0.92 }}
            tracksViewChanges={false}
          >
            <View style={styles.pinShadow}>
              <View style={styles.pin}>
                <View style={styles.pinInner}>
                  <Text style={styles.pinLabel}>{pin.label}</Text>
                  <Feather name={pin.icon} size={27} color={theme.colors.white} strokeWidth={2.1} />
                </View>
                <View style={styles.pinPoint} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      <View pointerEvents="none" style={styles.topFade} />
      <View pointerEvents="none" style={styles.bottomFade} />

      <View pointerEvents="none" style={styles.nearbyCard}>
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
  topFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 18,
    backgroundColor: 'rgba(247, 244, 236, 0.18)',
  },
  bottomFade: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 130,
    backgroundColor: 'rgba(247, 244, 236, 0.14)',
  },
  userPulse: {
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(80, 150, 226, 0.18)',
  },
  userDot: {
    width: 26,
    height: 26,
    borderWidth: 4,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.pill,
    backgroundColor: '#3A91EA',
  },
  pinShadow: {
    shadowColor: theme.colors.black,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  pin: {
    width: 72,
    height: 91,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 12,
    backgroundColor: theme.colors.primary,
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
    bottom: '43%',
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