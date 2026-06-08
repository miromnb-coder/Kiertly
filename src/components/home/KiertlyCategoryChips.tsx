import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { theme } from '../../constants/theme';

export const homeCategories = ['Kaikki', 'Lainaa', 'Vuokraa', 'Ilmaiset', 'Vaihda', 'Tänään', 'Työkalut'] as const;

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
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  chip: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.035,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  activeChip: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  activeChipText: {
    color: theme.colors.white,
  },
});
