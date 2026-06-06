import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyFormFieldProps = {
  label: string;
  helperText: string;
};

export function KiertlyFormField({ label, helperText }: KiertlyFormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  helperText: {
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 22,
  },
});
