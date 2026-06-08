import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import { KiertlyMapTopBar } from './KiertlyMapTopBar';

type KiertlySearchBarProps = {
  onPress?: () => void;
};

export function KiertlySearchBar({ onPress }: KiertlySearchBarProps) {
  return (
    <View>
      <KiertlyMapTopBar />
      <View style={styles.wrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Avaa haku"
          onPress={onPress}
          style={styles.searchBox}
        >
          <Feather name="search" size={28} color={theme.colors.text} strokeWidth={1.9} />
          <Text numberOfLines={1} style={styles.placeholder}>Hae tavaroita tai kategorioita</Text>
          <View style={styles.filterButton}>
            <Feather name="sliders" size={23} color={theme.colors.text} strokeWidth={1.9} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 28,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  searchBox: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    paddingRight: 8,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.055,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
  },
  placeholder: {
    flex: 1,
    color: theme.colors.mutedText,
    fontSize: 18,
    fontWeight: '600',
  },
  filterButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
});
