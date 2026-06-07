import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

type KiertlyAuthStartScreenProps = {
  onAppleContinue: () => void;
  onGoogleContinue: () => void;
  onEmailContinue: () => void;
};

const googleLogoUri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAC9klEQVR4nO2bMU4cQRBFy8ghklMQsU9AsDEWIQfY3Eik5I6d+wCQcwCH4HwDTrAHMIRI5Dhqa92eHWamq+r/2f0vROxO7/9V1dPV3WZCCCGEEEIIIYQQQgghhNh1PqAHMIb1+eJt6P9+vl/N4rdRD3KM4O/BagjdoDxF3waTGTQDyRC+hsEI+AAQwtcgjThAPdiMQ/yrswf78v0VNo6PiIcyCF9TTPj17TA1G9IzgEn8q7OH//6WnQ2pBjCJ30emCWkGsInfFf2bZJmQYsDcxC9kmBBuAJv4Y4k2IXTGjxB/yDt733OHRn9N1NtRmAEsfZx6HFMNMIsxAbIOGIrHCrV8x/p88dYifhQhGdAa/ZGtgdaa7p0F7pMws/hm7QJ6T8o0JSizIVZMQPaACq4ZMDX6Ud3IqdngaZyrAcfXK8+v2wvcIu/1p/0TFb9/LAZ9jmFTZGpEe0zIYSvh4+vVuxnBIL5Zfgt6k/BWxBAj9hkX5+vy00cpTSzRv8mUUtSaPemvoX+z4T77yZxA9oQPL/CHAbpAzAXQTXnhMAeMqf+FiAxArmpbMic9A1jLDwqVIDAyAIwMACMDwMgAMDIAjAwAIwPApBswZeW8yzQbsO8r29m1o6Pw6mTu9P2AAmsZQjT0IAacPC8Rj6Uk7FREF7XwL1/vaOYPxHakWdIcoIjfTmgJOnle9or/6XZJMRcgN3NcS0ApQ2MjHlmKkIeyzJxLkErNeFxL0NRIRpUidPSbES3EigkZ5YjhWHrBfRJuFTA6G9huyIRFm4eQntngEfV7d0nPoywxlZsuQuttRDkZYsbmc0+fblyeO7t7wgX0YsvDgMgzo+HNOHS/5/Hosunz0Qd2U7qhaBOmknFaOq0dPTcTso6qp+4HoEwYW4Yy7wmkb8iwZ0L2JQ2oGNlvSH1vRKibktBzQSzZgLymSiGAWU421BmAFL4AH0BNtBGnTzcUwhdoBtKFpxks5a6GclDbGGMIq+BCCCGEEEIIIYQQQgghBIA/ho8r5m7mfPYAAAAASUVORK5CYII=';

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
            <Image source={{ uri: googleLogoUri }} style={styles.googleLogo} resizeMode="contain" />
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
    paddingHorizontal: 34,
    paddingTop: 92,
    paddingBottom: 74,
  },
  brandWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 86,
  },
  brand: {
    color: '#405032',
    fontFamily: 'Georgia',
    fontSize: 72,
    fontWeight: '600',
    letterSpacing: -1.5,
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
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderRadius: 16,
    backgroundColor: '#101412',
  },
  appleIcon: {
    color: theme.colors.white,
    fontSize: 31,
    lineHeight: 35,
  },
  appleButtonText: {
    color: theme.colors.white,
    fontSize: 19,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 1.5,
    borderColor: '#4D603C',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  googleLogo: {
    width: 28,
    height: 28,
    backgroundColor: 'transparent',
  },
  googleButtonText: {
    color: '#405032',
    fontSize: 19,
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
