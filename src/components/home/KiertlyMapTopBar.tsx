import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyMapTopBarProps = {
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
};

export function KiertlyMapTopBar({
  onMenuPress,
  onNotificationsPress,
}: KiertlyMapTopBarProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Avaa valikko"
        onPress={onMenuPress}
        style={styles.roundButton}
      >
        <Feather name="menu" size={23} color={theme.colors.text} strokeWidth={2} />
      </Pressable>

      <View style={styles.logoWrap}>
        <Text style={styles.logo}>Kiertly</Text>
        <Feather name="leaf" size={18} color={theme.colors.primary} strokeWidth={2} style={styles.logoLeaf} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ilmoitukset"
        onPress={onNotificationsPress}
        style={styles.roundButton}
      >
        <Feather name="bell" size={22} color={theme.colors.text} strokeWidth={1.9} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: theme.spacing.lg,
  },
  roundButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: '500',
    letterSpacing: -1.1,
    fontFamily: 'serif',
  },
  logoLeaf: {
    marginLeft: -2,
    marginTop: 9,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
});
