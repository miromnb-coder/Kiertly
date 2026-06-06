import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyFormRowProps = {
  label: string;
  value: string;
  rightText?: string;
  showChevron?: boolean;
  onPress?: () => void;
};

export function KiertlyFormRow({
  label,
  value,
  rightText,
  showChevron = false,
  onPress,
}: KiertlyFormRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={styles.row}
    >
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, value !== 'Valitse kategoria' && value !== 'Valitse sijainti' && styles.selectedValue]}>
          {value}
        </Text>
      </View>

      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      {showChevron ? <Feather name="chevron-right" size={26} color={theme.colors.text} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  value: {
    color: theme.colors.mutedText,
    fontSize: 16,
  },
  selectedValue: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  rightText: {
    marginLeft: theme.spacing.md,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
});
