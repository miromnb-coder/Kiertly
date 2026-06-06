import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlySearchBarProps = {
  onPress?: () => void;
};

export function KiertlySearchBar({ onPress }: KiertlySearchBarProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Avaa haku"
        onPress={onPress}
        style={styles.searchBox}
      >
        <Feather name="search" size={18} color={theme.colors.mutedText} />
        <Text style={styles.placeholder}>Hae tavaroita tai jäseniä</Text>
      </Pressable>

      <View style={styles.iconButton}>
        <Feather name="bell" size={20} color={theme.colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  searchBox: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: '#F1EFE7',
  },
  placeholder: {
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '500',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#F1EFE7',
  },
});
