import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type KiertlyProfileScreenProps = {
  sharedItemCount: number;
  onOwnItemsPress: () => void;
};

export function KiertlyProfileScreen({ sharedItemCount, onOwnItemsPress }: KiertlyProfileScreenProps) {
  return (
    <View style={styles.screenContent}>
      <View style={styles.topBar}>
        <View />
        <Pressable accessibilityRole="button" accessibilityLabel="Ilmoitukset" style={styles.notificationButton}>
          <Feather name="bell" size={23} color={theme.colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Feather name="user" size={52} color={theme.colors.primary} strokeWidth={1.8} />
        </View>
        <View style={styles.profileTextWrap}>
          <Text style={styles.name}>Sanni</Text>
          <Text style={styles.userType}>Kiertly-käyttäjä</Text>
          <Text style={styles.bio}>Teen arjesta kestävämpää jakamalla ja lainaamalla.</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Feather name="package" size={23} color={theme.colors.primary} strokeWidth={1.8} />
          <Text style={styles.statValue}>{sharedItemCount}</Text>
          <Text style={styles.statLabel}>Jaettua tavaraa</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Feather name="refresh-cw" size={23} color={theme.colors.primary} strokeWidth={1.8} />
          <Text style={styles.statValue}>48</Text>
          <Text style={styles.statLabel}>Onnistunutta lainaa</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Feather name="heart" size={23} color={theme.colors.primary} strokeWidth={1.8} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Tallennettua</Text>
        </View>
      </View>

      <View style={styles.menuGroup}>
        <Pressable accessibilityRole="button" onPress={onOwnItemsPress} style={styles.menuRow}>
          <View style={styles.menuIconWrap}>
            <Feather name="box" size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Omat tavarat</Text>
            <Text style={styles.menuSubtitle}>Näytä ja hallinnoi</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </Pressable>
        <View style={[styles.menuRow, styles.menuRowBorder]}>
          <View style={styles.menuIconWrap}>
            <Feather name="bookmark" size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Tallennetut</Text>
            <Text style={styles.menuSubtitle}>Tallentamasi tavarat ja haut</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </View>
        <View style={[styles.menuRow, styles.menuRowBorder]}>
          <View style={styles.menuIconWrap}>
            <Feather name="star" size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Arvostelut</Text>
            <Text style={styles.menuSubtitle}>Palaute ja arviot</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </View>
      </View>

      <View style={styles.menuGroup}>
        <View style={styles.menuRow}>
          <View style={styles.menuIconWrap}>
            <Feather name="settings" size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Asetukset</Text>
            <Text style={styles.menuSubtitle}>Ilmoitukset ja tili</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </View>
        <View style={[styles.menuRow, styles.menuRowBorder]}>
          <View style={styles.menuIconWrap}>
            <Feather name="help-circle" size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Apua</Text>
            <Text style={styles.menuSubtitle}>Usein kysytyt kysymykset ja tuki</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  topBar: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  profileTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  userType: {
    marginTop: theme.spacing.sm,
    color: theme.colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
  },
  bio: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  statsCard: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },
  statValue: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  menuGroup: {
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    overflow: 'hidden',
  },
  menuRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  menuRowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  menuIconWrap: {
    width: 32,
    alignItems: 'center',
  },
  menuTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  menuSubtitle: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
