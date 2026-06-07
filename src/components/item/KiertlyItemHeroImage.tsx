import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyItemHeroImageProps = {
  imageUri?: string;
  backgroundColor: string;
  imageCount?: number;
};

export function KiertlyItemHeroImage({
  imageUri,
  backgroundColor,
  imageCount = imageUri ? 1 : 0,
}: KiertlyItemHeroImageProps) {
  return (
    <View style={[styles.hero, { backgroundColor }]}> 
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Feather name="package" size={62} color={theme.colors.primary} strokeWidth={1.7} />
        </View>
      )}

      {imageCount > 0 ? (
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>1/{imageCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 260,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterPill: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(31, 36, 24, 0.72)',
  },
  counterText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
