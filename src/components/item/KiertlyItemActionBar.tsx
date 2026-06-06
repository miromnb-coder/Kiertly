import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyItemActionBarProps = {
  primaryLabel: string;
};

export function KiertlyItemActionBar({ primaryLabel }: KiertlyItemActionBarProps) {
  return (
    <View style={styles.actionBar}>
      <Pressable accessibilityRole="button" style={styles.chatButton}>
        <Feather name="message-circle" size={22} color={theme.colors.primary} />
        <Text style={styles.chatText}>Chattaa</Text>
      </Pressable>

      <Pressable accessibilityRole="button" style={styles.primaryButton}>
        <Text style={styles.primaryText}>{primaryLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  chatButton: {
    height: 52,
    minWidth: 132,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  chatText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
