import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

const categories = ['Kaikki', 'Lainaa', 'Vuokraa', 'Vaihda', 'Ilmaiset', 'Lähellä'];

type KiertlyCategoryChipsProps = {
  activeCategory?: string;
};

export function KiertlyCategoryChips({ activeCategory = 'Kaikki' }: KiertlyCategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <View key={category} style={[styles.chip, isActive && styles.activeChip]}>
            <Text style={[styles.chipText, isActive && styles.activeChipText]}>{category}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 7,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  chip: {
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
  },
  activeChip: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: theme.colors.white,
  },
});
