import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyOwnerCardProps = {
  ownerName?: string;
  locationLabel?: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function KiertlyOwnerCard({
  ownerName = 'Kiertly-käyttäjä',
  locationLabel = 'Sijainti lisäämättä',
}: KiertlyOwnerCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{getInitials(ownerName)}</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.name}>{ownerName}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={13} color={theme.colors.primary} />
          <Text numberOfLines={1} style={styles.locationText}>{locationLabel}</Text>
        </View>
        <Text style={styles.helperText}>Lähetä viesti sopiaksesi noudosta ja palautuksesta.</Text>
      </View>

      <Feather name="chevron-right" size={24} color={theme.colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  avatarWrap: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    flex: 1,
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 2,
    color: theme.colors.mutedText,
    fontSize: 12,
  },
});
