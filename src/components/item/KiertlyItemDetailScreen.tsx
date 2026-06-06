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
  onBack: () => void;
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

  return 'Hyväkuntoinen tavara lähialueelta. Sopii arjen tarpeisiin ja on noudettavissa joustavasti. Kysy rohkeasti lisätietoja ennen varausta.';
}

export function KiertlyItemDetailScreen({ item, onBack }: KiertlyItemDetailScreenProps) {
  const category = item.categoryLabel ?? 'Työkalut';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KiertlyItemDetailHeader onBack={onBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <KiertlyItemHeroImage imageUri={item.imageUri} backgroundColor={item.backgroundColor} />

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.meta}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <View style={styles.greenDot} />
              <Text style={styles.badgeText}>Hyväkuntoinen</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="map-pin" size={13} color={theme.colors.mutedText} />
              <Text style={styles.badgeText}>Helsinki, Kallio</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="clock" size={13} color={theme.colors.mutedText} />
              <Text style={styles.badgeText}>Lisätty äsken</Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <Feather name="repeat" size={20} color={theme.colors.primary} />
            <Text style={styles.highlight}>{item.highlight}</Text>
          </View>

          <Text style={styles.description}>{getDescription(item)}</Text>

          <KiertlyOwnerCard ownerName={item.ownerName} />
          <KiertlyItemInfoRows category={category} />
        </View>
      </ScrollView>

      <KiertlyItemActionBar primaryLabel={getPrimaryActionLabel(item.highlight)} />
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
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
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
