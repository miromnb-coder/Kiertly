import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyFormRowProps = {
  label: string;
  value: string;
  rightText?: string;
  showChevron?: boolean;
};

export function KiertlyFormRow({
  label,
  value,
  rightText,
  showChevron = false,
}: KiertlyFormRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      {showChevron ? <Feather name="chevron-right" size={26} color={theme.colors.text} /> : null}
    </View>
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
  rightText: {
    marginLeft: theme.spacing.md,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
});
