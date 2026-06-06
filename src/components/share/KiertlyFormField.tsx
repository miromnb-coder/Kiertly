import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyFormFieldProps = {
  label: string;
  value: string;
  hintText: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export function KiertlyFormField({
  label,
  value,
  hintText,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
}: KiertlyFormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={hintText}
        placeholderTextColor={theme.colors.mutedText}
        multiline={multiline}
        keyboardType={keyboardType}
        returnKeyType={multiline ? 'default' : 'next'}
        style={[styles.input, multiline && styles.multilineInput]}
      />
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
  input: {
    minHeight: 24,
    padding: 0,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
});
