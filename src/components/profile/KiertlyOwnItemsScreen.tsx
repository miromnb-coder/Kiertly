import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';

type KiertlyOwnItemsScreenProps = {
  items: KiertlyGridItem[];
  onBack: () => void;
  onItemPress: (item: KiertlyGridItem) => void;
};

export function KiertlyOwnItemsScreen({ items, onBack, onItemPress }: KiertlyOwnItemsScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Takaisin profiiliin"
          hitSlop={12}
          onPress={onBack}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={25} color={theme.colors.text} strokeWidth={2} />
        </Pressable>

        <Text style={styles.headerTitle}>Omat tavarat</Text>

        <View style={styles.headerSpacer} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Feather name="box" size={42} color={theme.colors.primary} strokeWidth={1.7} />
          </View>
          <Text style={styles.emptyTitle}>Ei vielä omia tavaroita</Text>
          <Text style={styles.emptyDescription}>
            Kun lisäät tavaran Jaa-sivulta, se näkyy täällä hallittavana.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Lisäämäsi tavarat</Text>
          <Text style={styles.sectionDescription}>
            Näet täällä kaikki tavarat, jotka olet lisännyt Kiertlyyn.
          </Text>

          <View style={styles.grid}>
            {items.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => onItemPress(item)}
                style={styles.card}
              >
                <View style={[styles.imageWrap, { backgroundColor: item.backgroundColor }]}> 
                  {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
                  ) : (
                    <Feather name="package" size={42} color={theme.colors.primary} strokeWidth={1.8} />
                  )}
                </View>

                <View style={styles.cardTextWrap}>
                  <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
                  <Text numberOfLines={1} style={styles.itemMeta}>{item.meta}</Text>
                  <Text numberOfLines={1} style={styles.itemHighlight}>{item.highlight}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 42,
  },
  emptyState: {
    flex: 1,
    minHeight: 520,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 112,
  },
  emptyIconCircle: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  sectionTitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionDescription: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: theme.spacing.lg,
  },
  card: {
    width: '48.5%',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardTextWrap: {
    paddingTop: 8,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  itemMeta: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 11,
    lineHeight: 14,
  },
  itemHighlight: {
    marginTop: 5,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
