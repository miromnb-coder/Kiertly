import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { KiertlySearchMode } from './KiertlySearchHeader';

type KiertlySearchEmptyStateProps = {
  mode: KiertlySearchMode;
};

const copy = {
  products: {
    icon: 'search' as const,
    title: 'Hae mitä tahansa',
    description: 'Tutustu Kiertlyn eri kategorioihin.',
  },
  members: {
    icon: 'user' as const,
    title: 'Seuraa suosikkijakajia',
    description:
      'Hae jäseniä käyttäjätunnuksella, selaa heidän tavaroitaan ja seuraa suosikkejasi.',
  },
};

export function KiertlySearchEmptyState({ mode }: KiertlySearchEmptyStateProps) {
  const current = copy[mode];

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconCircle}>
        <Feather name={current.icon} size={58} color={theme.colors.primary} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{current.title}</Text>
      <Text style={styles.description}>{current.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 120,
  },
  iconCircle: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    maxWidth: 300,
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
