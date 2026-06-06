import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyShareHeaderProps = {
  onClose: () => void;
};

export function KiertlyShareHeader({ onClose }: KiertlyShareHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sulje jakaminen"
        hitSlop={12}
        onPress={onClose}
        style={styles.closeButton}
      >
        <Feather name="x" size={28} color={theme.colors.text} strokeWidth={1.9} />
      </Pressable>

      <Text style={styles.title}>Jaa tavara</Text>

      <View style={styles.sideSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  closeButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  sideSpacer: {
    width: 42,
  },
});
