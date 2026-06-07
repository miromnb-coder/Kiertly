import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export type HomeViewMode = 'grid' | 'map';

type KiertlyHomeViewToggleProps = {
  mode: HomeViewMode;
  onModeChange: (mode: HomeViewMode) => void;
};

export function KiertlyHomeViewToggle({ mode, onModeChange }: KiertlyHomeViewToggleProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'grid' }}
        onPress={() => onModeChange('grid')}
        style={[styles.option, mode === 'grid' && styles.activeOption]}
      >
        <Feather
          name="grid"
          size={18}
          color={mode === 'grid' ? theme.colors.white : theme.colors.text}
          strokeWidth={2}
        />
        <Text style={[styles.optionText, mode === 'grid' && styles.activeOptionText]}>Ruudukko</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'map' }}
        onPress={() => onModeChange('map')}
        style={[styles.option, mode === 'map' && styles.activeOption]}
      >
        <Feather
          name="map"
          size={18}
          color={mode === 'map' ? theme.colors.white : theme.colors.text}
          strokeWidth={2}
        />
        <Text style={[styles.optionText, mode === 'map' && styles.activeOptionText]}>Kartta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  option: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  activeOption: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  activeOptionText: {
    color: theme.colors.white,
  },
});
