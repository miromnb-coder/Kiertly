import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type InfoRow = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  isHighlighted?: boolean;
  showChevron?: boolean;
};

type KiertlyItemInfoRowsProps = {
  category: string;
  availabilityText: string;
  locationLabel: string;
};

export function KiertlyItemInfoRows({
  category,
  availabilityText,
  locationLabel,
}: KiertlyItemInfoRowsProps) {
  const rows: InfoRow[] = [
    {
      icon: 'archive',
      label: 'Kategoria',
      value: category,
      showChevron: true,
    },
    {
      icon: 'clock',
      label: 'Saatavuus',
      value: availabilityText,
      isHighlighted: true,
    },
    {
      icon: 'map-pin',
      label: 'Sijainti',
      value: locationLabel,
      showChevron: true,
    },
  ];

  return (
    <View style={styles.wrapper}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <View style={styles.leftSide}>
            <Feather name={row.icon} size={18} color={theme.colors.mutedText} />
            <Text style={styles.label}>{row.label}</Text>
          </View>

          <View style={styles.rightSide}>
            <Text
              numberOfLines={1}
              style={[styles.value, row.isHighlighted && styles.highlightedValue]}
            >
              {row.value}
            </Text>
            {row.showChevron ? (
              <Feather name="chevron-right" size={20} color={theme.colors.text} />
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  row: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  rightSide: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.xs,
  },
  value: {
    flexShrink: 1,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  highlightedValue: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
});
