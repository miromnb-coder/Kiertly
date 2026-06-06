import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../src/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>Kiertly</Text>
        <Text style={styles.title}>Expo + React Native + TypeScript pohja</Text>
        <Text style={styles.description}>
          Tämä on puhdas mobiilisovelluspohja Kiertlylle. Se käyttää Expoa,
          React Nativea, TypeScriptiä ja expo-routeria.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logo: {
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: '800',
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
  },
});
