import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

type KiertlyAuthStartScreenProps = {
  onAppleContinue: () => void;
  onGoogleContinue: () => void;
  onEmailContinue: () => void;
};

export function KiertlyAuthStartScreen({
  onAppleContinue,
  onGoogleContinue,
  onEmailContinue,
}: KiertlyAuthStartScreenProps) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.brandWrap}>
          <Text style={styles.brand}>Kiertly</Text>
          <Text style={styles.tagline}>Lainaa. Vuokraa. Jaa läheltä.</Text>
        </View>

        <View style={styles.actionsWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Jatka Apple-tilillä"
            onPress={onAppleContinue}
            style={styles.appleButton}
          >
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.appleButtonText}>Jatka Apple-tilillä</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>tai</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Jatka Google-tilillä"
            onPress={onGoogleContinue}
            style={styles.googleButton}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Jatka Google-tilillä</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Jatka sähköpostilla"
            onPress={onEmailContinue}
            hitSlop={12}
            style={styles.emailButton}
          >
            <Text style={styles.emailButtonText}>Jatka sähköpostilla</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 92,
    paddingBottom: 68,
  },
  brandWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 56,
  },
  brand: {
    color: '#405032',
    fontSize: 62,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  tagline: {
    marginTop: 14,
    color: theme.colors.mutedText,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsWrap: {
    width: '100%',
  },
  appleButton: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderRadius: theme.radius.md,
    backgroundColor: '#101412',
  },
  appleIcon: {
    color: theme.colors.white,
    fontSize: 34,
    lineHeight: 38,
  },
  appleButtonText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.mutedText,
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 1.5,
    borderColor: '#4D603C',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 28,
    fontWeight: '800',
  },
  googleButtonText: {
    color: '#405032',
    fontSize: 20,
    fontWeight: '700',
  },
  emailButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  emailButtonText: {
    color: '#405032',
    fontSize: 20,
    fontWeight: '800',
  },
});
