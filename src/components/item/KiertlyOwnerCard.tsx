import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyOwnerCardProps = {
  ownerName?: string;
};

export function KiertlyOwnerCard({ ownerName = 'Anna' }: KiertlyOwnerCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=160&h=160&fit=crop' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.name}>{ownerName}</Text>
        <View style={styles.trustRow}>
          <Feather name="shield" size={13} color={theme.colors.primary} />
          <Text style={styles.trustText}>Luotettava lainaaja</Text>
        </View>
        <Text style={styles.responseText}>Vastaa yleensä 30 min sisällä</Text>
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
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
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
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  trustText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
  },
  responseText: {
    marginTop: 2,
    color: theme.colors.mutedText,
    fontSize: 12,
  },
});
