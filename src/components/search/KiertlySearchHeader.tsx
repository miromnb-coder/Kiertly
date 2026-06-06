import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../../constants/theme';

export type KiertlySearchMode = 'products' | 'members';

type KiertlySearchHeaderProps = {
  mode: KiertlySearchMode;
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export function KiertlySearchHeader({
  mode,
  value,
  onChangeText,
  onClear,
  onClose,
}: KiertlySearchHeaderProps) {
  const placeholder = mode === 'members' ? 'Hae jäseniä' : 'Hae tavaroita tai jäseniä';

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchBox}>
        <Feather name="search" size={20} color={theme.colors.mutedText} />
        <TextInput
          autoFocus
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedText}
          returnKeyType="search"
          style={styles.input}
        />
        {value.length > 0 ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Tyhjennä haku" onPress={onClear}>
            <Feather name="x" size={18} color={theme.colors.mutedText} />
          </Pressable>
        ) : (
          <Feather name="x" size={18} color={theme.colors.mutedText} />
        )}
      </View>

      <Pressable accessibilityRole="button" onPress={onClose} hitSlop={10}>
        <Text style={styles.closeText}>Sulje</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  searchBox: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: 13,
    borderRadius: theme.radius.md,
    backgroundColor: '#F1EFE7',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  closeText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
