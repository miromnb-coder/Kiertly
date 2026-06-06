import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { HomeCategory } from '../home/KiertlyCategoryChips';

type BrowseCategory = {
  title: string;
  targetCategory: HomeCategory;
  icon: keyof typeof Feather.glyphMap;
  backgroundColor: string;
};

const categories: BrowseCategory[] = [
  { title: 'Työkalut', targetCategory: 'Lainaa', icon: 'tool', backgroundColor: '#F1E8D7' },
  { title: 'Retkeily', targetCategory: 'Lähellä', icon: 'map', backgroundColor: '#EEF3E4' },
  { title: 'Matkailu', targetCategory: 'Vuokraa', icon: 'briefcase', backgroundColor: '#EFE5D6' },
  { title: 'Koti', targetCategory: 'Ilmaiset', icon: 'home', backgroundColor: '#ECE8DC' },
  { title: 'Elektroniikka', targetCategory: 'Vuokraa', icon: 'smartphone', backgroundColor: '#E8E4D8' },
  { title: 'Juhlat', targetCategory: 'Vaihda', icon: 'flag', backgroundColor: '#F3E9D8' },
  { title: 'Viihde', targetCategory: 'Vaihda', icon: 'book-open', backgroundColor: '#EEE7D8' },
  { title: 'Urheilu', targetCategory: 'Lähellä', icon: 'activity', backgroundColor: '#F0E7DA' },
];

type KiertlyCategoryGridProps = {
  onCategoryPress: (category: HomeCategory) => void;
};

export function KiertlyCategoryGrid({ onCategoryPress }: KiertlyCategoryGridProps) {
  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <Pressable
          key={category.title}
          accessibilityRole="button"
          onPress={() => onCategoryPress(category.targetCategory)}
          style={[styles.card, { backgroundColor: category.backgroundColor }]}
        >
          <Text style={styles.title}>{category.title}</Text>
          <View style={styles.iconWrap}>
            <Feather name={category.icon} size={38} color={theme.colors.primary} strokeWidth={1.8} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  card: {
    width: '48.5%',
    minHeight: 144,
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 225, 216, 0.7)',
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  iconWrap: {
    alignSelf: 'flex-end',
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
  },
});
