import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyItemDetailHeaderProps = {
  onBack: () => void;
};

export function KiertlyItemDetailHeader({ onBack }: KiertlyItemDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Takaisin"
        hitSlop={12}
        onPress={onBack}
        style={styles.iconButton}
      >
        <Feather name="arrow-left" size={24} color={theme.colors.text} strokeWidth={2} />
      </Pressable>

      <Text style={styles.title}>Tavaran tiedot</Text>

      <Pressable accessibilityRole="button" accessibilityLabel="Tallenna" hitSlop={12} style={styles.iconButton}>
        <Feather name="heart" size={24} color={theme.colors.text} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
