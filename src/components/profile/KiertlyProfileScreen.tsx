import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type ProfileStat = {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  label: string;
};

type ProfileMenuItem = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
};

const stats: ProfileStat[] = [
  { icon: 'package', value: '23', label: 'Jaettua tavaraa' },
  { icon: 'refresh-cw', value: '48', label: 'Onnistunutta\nlainaa' },
  { icon: 'heart', value: '12', label: 'Tallennettua' },
];

const firstMenuGroup: ProfileMenuItem[] = [
  { icon: 'box', title: 'Omat tavarat', subtitle: 'Näytä ja hallinnoi' },
  { icon: 'bookmark', title: 'Tallennetut', subtitle: 'Tallentamasi tavarat ja haut' },
  { icon: 'star', title: 'Arvostelut', subtitle: 'Saatu palaute ja antamasi arviot' },
];

const secondMenuGroup: ProfileMenuItem[] = [
  { icon: 'settings', title: 'Asetukset', subtitle: 'Ilmoitukset, tili ja yksityisyys' },
  { icon: 'help-circle', title: 'Apua', subtitle: 'Usein kysytyt kysymykset ja tuki' },
];

function ProfileMenuGroup({ items }: { items: ProfileMenuItem[] }) {
  return (
    <View style={styles.menuGroup}>
      {items.map((item, index) => (
        <Pressable key={item.title} accessibilityRole="button" style={[styles.menuRow, index > 0 && styles.menuRowBorder]}>
          <View style={styles.menuIconWrap}>
            <Feather name={item.icon} size={23} color={theme.colors.primary} strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </Pressable>
      ))}
    </View>
  );
}

export function KiertlyProfileScreen() {
  return (
    <View style={styles.screenContent}>
      <View style={styles.topBar}>
        <View />
        <Pressable accessibilityRole="button" accessibilityLabel="Ilmoitukset" style={styles.notificationButton}>
          <Feather name="bell" size={23} color={theme.colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=220&h=220&fit=crop&crop=faces' }}
          style={styles.avatar}
        />
        <View style={styles.profileTextWrap}>
          <Text style={styles.name}>Sanni</Text>
          <View style={styles.userTypeRow}>
            <Text style={styles.leaf}>🌿</Text>
            <Text style={styles.userType}>Kiertly-käyttäjä</Text>
          </View>
          <Text style={styles.bio}>Teen arjesta kestävämpää jakamalla ja lainaamalla.</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={[styles.statItem, index > 0 && styles.statBorder]}>
            <Feather name={stat.icon} size={23} color={theme.colors.primary} strokeWidth={1.8} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <ProfileMenuGroup items={firstMenuGroup} />
      <ProfileMenuGroup items={secondMenuGroup} />
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
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
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
  userTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  leaf: {
    fontSize: 19,
  },
  userType: {
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
