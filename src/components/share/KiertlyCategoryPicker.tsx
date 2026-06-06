import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export const shareCategories = [
  'Työkalut',
  'Retkeily',
  'Matkailu',
  'Koti',
  'Elektroniikka',
  'Juhlat',
  'Viihde',
  'Urheilu',
] as const;

export type ShareCategory = (typeof shareCategories)[number];

type KiertlyCategoryPickerProps = {
  selectedCategory?: ShareCategory;
  onSelectCategory: (category: ShareCategory) => void;
  onClose: () => void;
};

export function KiertlyCategoryPicker({
  selectedCategory,
  onSelectCategory,
  onClose,
}: KiertlyCategoryPickerProps) {
  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Valitse kategoria</Text>
          <Pressable accessibilityRole="button" hitSlop={10} onPress={onClose}>
            <Feather name="x" size={24} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.list}>
          {shareCategories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                onPress={() => onSelectCategory(category)}
                style={styles.option}
              >
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {category}
                </Text>
                {isSelected ? (
                  <Feather name="check" size={21} color={theme.colors.primary} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 36, 24, 0.18)',
  },
  sheet: {
    maxHeight: '72%',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  list: {
    marginTop: theme.spacing.sm,
  },
  option: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
});
