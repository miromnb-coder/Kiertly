import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { theme } from '../../constants/theme';
import type { HomeCategory } from '../home/KiertlyCategoryChips';

const categoryImageBaseUrl =
  'https://raw.githubusercontent.com/miromnb-coder/Kiertly/main/assets/categories';

type BrowseCategory = {
  title: string;
  targetCategory: HomeCategory;
  image: ImageSourcePropType;
  backgroundColor: string;
};

const categories: BrowseCategory[] = [
  {
    title: 'Työkalut',
    targetCategory: 'Lainaa',
    image: { uri: `${categoryImageBaseUrl}/tools.PNG` },
    backgroundColor: '#F1E8D7',
  },
  {
    title: 'Retkeily',
    targetCategory: 'Lähellä',
    image: { uri: `${categoryImageBaseUrl}/camping.PNG` },
    backgroundColor: '#EEF3E4',
  },
  {
    title: 'Matkailu',
    targetCategory: 'Vuokraa',
    image: { uri: `${categoryImageBaseUrl}/travel.PNG` },
    backgroundColor: '#EFE5D6',
  },
  {
    title: 'Koti',
    targetCategory: 'Ilmaiset',
    image: { uri: `${categoryImageBaseUrl}/home.PNG` },
    backgroundColor: '#ECE8DC',
  },
  {
    title: 'Elektroniikka',
    targetCategory: 'Vuokraa',
    image: { uri: `${categoryImageBaseUrl}/electronics.PNG` },
    backgroundColor: '#E8E4D8',
  },
  {
    title: 'Juhlat',
    targetCategory: 'Vaihda',
    image: { uri: `${categoryImageBaseUrl}/party.PNG` },
    backgroundColor: '#F3E9D8',
  },
  {
    title: 'Viihde',
    targetCategory: 'Vaihda',
    image: { uri: `${categoryImageBaseUrl}/entertainment.PNG` },
    backgroundColor: '#EEE7D8',
  },
  {
    title: 'Urheilu',
    targetCategory: 'Lähellä',
    image: { uri: `${categoryImageBaseUrl}/sports.PNG` },
    backgroundColor: '#F0E7DA',
  },
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
          <Image source={category.image} style={styles.image} resizeMode="contain" />
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
    overflow: 'hidden',
  },
  title: {
    zIndex: 1,
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  image: {
    alignSelf: 'center',
    width: '92%',
    height: 92,
    marginTop: 2,
  },
});
