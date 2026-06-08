import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type MapPin = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  top: number;
  left: number;
};

const pins: MapPin[] = [
  { label: 'Lainaa', icon: 'tool', top: 58, left: 82 },
  { label: 'Vuokraa', icon: 'umbrella', top: 86, left: 258 },
  { label: 'Ilmainen', icon: 'gift', top: 156, left: 358 },
  { label: 'Vaihda', icon: 'repeat', top: 205, left: 48 },
  { label: 'Lainaa', icon: 'briefcase', top: 250, left: 235 },
];

export function KiertlyVisualMap() {
  return (
    <View style={styles.mapWrap}>
      <View style={[styles.park, styles.parkOne]} />
      <View style={[styles.park, styles.parkTwo]} />
      <View style={[styles.park, styles.parkThree]} />
      <View style={[styles.waterLine, styles.waterOne]} />
      <View style={[styles.waterLine, styles.waterTwo]} />

      {Array.from({ length: 14 }).map((_, index) => (
        <View
          key={`road-v-${index}`}
          style={[
            styles.road,
            styles.verticalRoad,
            {
              left: 18 + index * 36,
              transform: [{ rotate: index % 2 === 0 ? '24deg' : '-18deg' }],
            },
          ]}
        />
      ))}
      {Array.from({ length: 9 }).map((_, index) => (
        <View
          key={`road-h-${index}`}
          style={[
            styles.road,
            styles.horizontalRoad,
            {
              top: 28 + index * 38,
              transform: [{ rotate: index % 2 === 0 ? '-12deg' : '10deg' }],
            },
          ]}
        />
      ))}

      <View style={styles.userPulse}>
        <View style={styles.userDot} />
      </View>

      {pins.map((pin) => (
        <View key={`${pin.label}-${pin.top}-${pin.left}`} style={[styles.pin, { top: pin.top, left: pin.left }]}> 
          <Text style={styles.pinLabel}>{pin.label}</Text>
          <Feather name={pin.icon} size={27} color={theme.colors.white} strokeWidth={2.1} />
          <View style={styles.pinPoint} />
        </View>
      ))}

      <View style={styles.nearbyCard}>
        <View style={styles.nearbyTitleRow}>
          <Text style={styles.nearbyTitle}>Lähellä sinua</Text>
          <Feather name="map-pin" size={16} color={theme.colors.text} strokeWidth={2} />
        </View>
        <Text style={styles.nearbyMeta}>14 tavaraa</Text>
        <Text style={styles.nearbyMeta}>2 km säteellä</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height: 390,
    overflow: 'hidden',
    marginTop: -3,
    backgroundColor: '#F3EFE5',
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
  },
  verticalRoad: {
    top: -70,
    width: 4,
    height: 560,
  },
  horizontalRoad: {
    left: -80,
    width: 620,
    height: 4,
  },
  waterLine: {
    position: 'absolute',
    width: 26,
    height: 560,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(155, 196, 213, 0.45)',
  },
  waterOne: {
    top: -92,
    left: 190,
    transform: [{ rotate: '31deg' }],
  },
  waterTwo: {
    top: -118,
    left: 300,
    transform: [{ rotate: '-21deg' }],
    opacity: 0.45,
  },
  park: {
    position: 'absolute',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(187, 205, 159, 0.38)',
  },
  parkOne: {
    top: 36,
    right: 42,
    width: 86,
    height: 64,
    transform: [{ rotate: '-11deg' }],
  },
  parkTwo: {
    left: 20,
    bottom: 45,
    width: 98,
    height: 76,
    transform: [{ rotate: '14deg' }],
  },
  parkThree: {
    right: 128,
    bottom: 88,
    width: 74,
    height: 56,
    transform: [{ rotate: '8deg' }],
  },
  userPulse: {
    position: 'absolute',
    top: 171,
    left: 207,
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
    transform: [{ rotate: '-45deg' }],
  },
  pinLabel: {
    marginBottom: 4,
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '800',
    transform: [{ rotate: '45deg' }],
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
    bottom: 20,
    minWidth: 140,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.07,
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
