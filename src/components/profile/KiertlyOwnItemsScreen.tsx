import { Feather } from '@expo/vector-icons';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';

type KiertlyOwnItemsScreenProps = {
  items: KiertlyGridItem[];
  onBack: () => void;
  onItemPress: (item: KiertlyGridItem) => void;
  onEditItem: (item: KiertlyGridItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleAvailability: (item: KiertlyGridItem) => void;
};

export function KiertlyOwnItemsScreen({
  items,
  onBack,
  onItemPress,
  onEditItem,
  onDeleteItem,
  onToggleAvailability,
}: KiertlyOwnItemsScreenProps) {
  function confirmDelete(item: KiertlyGridItem) {
    Alert.alert('Poista tavara?', `Haluatko varmasti poistaa tavaran "${item.title}"?`, [
      { text: 'Peruuta', style: 'cancel' },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: () => onDeleteItem(item.id),
      },
    ]);
  }

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
            Muokkaa tietoja, poista tavara tai vaihda saatavuus nopeasti.
          </Text>

          <View style={styles.list}>
            {items.map((item) => {
              const isAvailable = item.isAvailable !== false;

              return (
                <View key={item.id} style={styles.card}>
                  <Pressable accessibilityRole="button" onPress={() => onItemPress(item)} style={styles.cardTop}>
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
                      <View style={[styles.statusPill, isAvailable ? styles.availablePill : styles.unavailablePill]}>
                        <View style={[styles.statusDot, isAvailable ? styles.availableDot : styles.unavailableDot]} />
                        <Text style={styles.statusText}>{isAvailable ? 'Saatavilla' : 'Varattu'}</Text>
                      </View>
                    </View>
                  </Pressable>

                  <View style={styles.actionsRow}>
                    <Pressable accessibilityRole="button" onPress={() => onEditItem(item)} style={styles.actionButton}>
                      <Feather name="edit-3" size={16} color={theme.colors.primary} strokeWidth={2} />
                      <Text style={styles.actionText}>Muokkaa</Text>
                    </Pressable>

                    <Pressable accessibilityRole="button" onPress={() => onToggleAvailability(item)} style={styles.actionButton}>
                      <Feather name={isAvailable ? 'pause-circle' : 'check-circle'} size={16} color={theme.colors.primary} strokeWidth={2} />
                      <Text style={styles.actionText}>{isAvailable ? 'Merkitse varatuksi' : 'Saatavilla'}</Text>
                    </Pressable>

                    <Pressable accessibilityRole="button" onPress={() => confirmDelete(item)} style={[styles.actionButton, styles.deleteButton]}>
                      <Feather name="trash-2" size={16} color="#A14C3A" strokeWidth={2} />
                      <Text style={styles.deleteText}>Poista</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
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
  list: {
    gap: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  cardTop: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  imageWrap: {
    width: 96,
    height: 96,
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
    flex: 1,
    minWidth: 0,
    paddingVertical: 2,
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  itemMeta: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
  },
  itemHighlight: {
    marginTop: 5,
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  availablePill: {
    backgroundColor: '#EEF3E4',
  },
  unavailablePill: {
    backgroundColor: '#F3E9E4',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
  },
  availableDot: {
    backgroundColor: theme.colors.primary,
  },
  unavailableDot: {
    backgroundColor: '#A14C3A',
  },
  statusText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  actionText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  deleteButton: {
    borderColor: '#E3C7BE',
  },
  deleteText: {
    color: '#A14C3A',
    fontSize: 12,
    fontWeight: '800',
  },
});
