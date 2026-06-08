import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlySearchBarProps = {
  onPress?: () => void;
};

export function KiertlySearchBar({ onPress }: KiertlySearchBarProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Avaa haku"
        onPress={onPress}
        style={styles.searchBox}
      >
        <Feather name="search" size={28} color={theme.colors.text} strokeWidth={1.9} />
        <Text numberOfLines={1} style={styles.placeholder}>Hae tavaroita tai jäseniä</Text>
        <View style={styles.filterButton}>
          <Feather name="sliders" size={23} color={theme.colors.text} strokeWidth={1.9} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  searchBox: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: 8,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  placeholder: {
    flex: 1,
    color: theme.colors.mutedText,
    fontSize: 20,
    fontWeight: '600',
  },
  filterButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
});
