import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { theme } from '../../constants/theme';

export const homeCategories = ['Kaikki', 'Lainaa', 'Vuokraa', 'Vaihda', 'Ilmaiset', 'Lähellä'] as const;

export type HomeCategory = (typeof homeCategories)[number];

type KiertlyCategoryChipsProps = {
  activeCategory: HomeCategory;
  onCategoryPress: (category: HomeCategory) => void;
};

export function KiertlyCategoryChips({
  activeCategory,
  onCategoryPress,
}: KiertlyCategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {homeCategories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            onPress={() => onCategoryPress(category)}
            style={[styles.chip, isActive && styles.activeChip]}
          >
            <Text style={[styles.chipText, isActive && styles.activeChipText]}>{category}</Text>
          </Pressable>
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
