import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';

import { theme } from '../../constants/theme';
import type { HomeCategory } from '../home/KiertlyCategoryChips';

const categoryImageBaseUrl =
  'https://raw.githubusercontent.com/miromnb-coder/Kiertly/main/assets/categories';

const gridGap = 10;

type BrowseCategory = {
  title: string;
  targetCategory: HomeCategory;
  image: ImageSourcePropType;
  backgroundColor: string;
};

const categories: BrowseCategory[] = [
  {
    title: 'Työkalut',
    targetCategory: 'Työkalut',
    image: { uri: `${categoryImageBaseUrl}/tools.PNG` },
    backgroundColor: '#F1E8D7',
  },
  {
    title: 'Retkeily',
    targetCategory: 'Tänään',
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
    targetCategory: 'Tänään',
    image: { uri: `${categoryImageBaseUrl}/sports.PNG` },
    backgroundColor: '#F0E7DA',
  },
];

type KiertlyCategoryGridProps = {
  onCategoryPress: (category: HomeCategory) => void;
};

export function KiertlyCategoryGrid({ onCategoryPress }: KiertlyCategoryGridProps) {
  const { width } = useWindowDimensions();
  const cardSize = (width - theme.spacing.md * 2 - gridGap) / 2;

  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <Pressable
          key={category.title}
          accessibilityRole="button"
          onPress={() => onCategoryPress(category.targetCategory)}
          style={[styles.card, { width: cardSize, height: cardSize }]}
        >
          <ImageBackground
            source={category.image}
            resizeMode="cover"
            style={styles.cardImage}
            imageStyle={styles.cardImageRadius}
          >
            <Text style={styles.title}>{category.title}</Text>
          </ImageBackground>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gridGap,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  card: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#F1E8D7',
    borderWidth: 1,
    borderColor: 'rgba(229, 225, 216, 0.7)',
  },
  cardImage: {
    flex: 1,
    padding: theme.spacing.md,
  },
  cardImageRadius: {
    borderRadius: theme.radius.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
});
