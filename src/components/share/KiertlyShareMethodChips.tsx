import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export type ShareMethod =
  | 'Lainaa ilmaiseksi'
  | 'Vuokraa'
  | 'Vaihda'
  | 'Anna ilmaiseksi'
  | 'Myy käytettynä';

const methods: ShareMethod[] = [
  'Lainaa ilmaiseksi',
  'Vuokraa',
  'Vaihda',
  'Anna ilmaiseksi',
  'Myy käytettynä',
];

type KiertlyShareMethodChipsProps = {
  selectedMethod: ShareMethod;
  onMethodPress: (method: ShareMethod) => void;
};

export function KiertlyShareMethodChips({
  selectedMethod,
  onMethodPress,
}: KiertlyShareMethodChipsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Jakotapa</Text>
      <View style={styles.chipGrid}>
        {methods.map((method) => {
          const isSelected = selectedMethod === method;

          return (
            <Pressable
              key={method}
              accessibilityRole="button"
              onPress={() => onMethodPress(method)}
              style={[styles.chip, isSelected && styles.selectedChip]}
            >
              <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                {method}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  },
  selectedChip: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  selectedChipText: {
    color: theme.colors.white,
  },
});
