import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export function KiertlyPhotoUploadBox() {
  return (
    <Pressable accessibilityRole="button" style={styles.box}>
      <View style={styles.iconCircle}>
        <Feather name="camera" size={29} color={theme.colors.white} strokeWidth={2} />
      </View>
      <Text style={styles.title}>+ Lataa valokuvia</Text>
      <Text style={styles.subtitle}>Lisää jopa 10 kuvaa</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D7C9B4',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  iconCircle: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
});
