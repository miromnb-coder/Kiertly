import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { KiertlyProfile } from '../../lib/profiles';

type KiertlyProfileScreenProps = {
  sharedItemCount: number;
  profile?: KiertlyProfile | null;
  userEmail?: string | null;
  onEditProfilePress: () => void;
  onOwnItemsPress: () => void;
  onSignOut: () => void;
};

export function KiertlyProfileScreen({
  sharedItemCount,
  profile,
  userEmail,
  onEditProfilePress,
  onOwnItemsPress,
  onSignOut,
}: KiertlyProfileScreenProps) {
  const displayEmail = profile?.email || userEmail || 'Ei sähköpostia';
  const displayName = profile?.displayName || displayEmail.split('@')[0] || 'Kiertly-käyttäjä';
  const displayLocation = profile?.location || 'Sijainti lisäämättä';
  const displayBio = profile?.bio || 'Teen arjesta kestävämpää jakamalla ja lainaamalla.';

  return (
    <View style={styles.screenContent}>
      <View style={styles.topBar}>
        <View />
        <View style={styles.topActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Muokkaa profiilia"
            onPress={onEditProfilePress}
            style={styles.topIconButton}
          >
            <Feather name="edit-3" size={22} color={theme.colors.primary} strokeWidth={2} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Ilmoitukset" style={styles.topIconButton}>
            <Feather name="bell" size={23} color={theme.colors.primary} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Feather name="user" size={52} color={theme.colors.primary} strokeWidth={1.8} />
          )}
        </View>
        <View style={styles.profileTextWrap}>
          <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.userType} numberOfLines={1}>{displayEmail}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color={theme.colors.mutedText} strokeWidth={2} />
            <Text style={styles.locationText} numberOfLines={1}>{displayLocation}</Text>
          </View>
          <Text style={styles.bio}>{displayBio}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onEditProfilePress}
        style={styles.editProfileButton}
      >
        <Feather name="edit-3" size={18} color={theme.colors.primary} strokeWidth={2} />
        <Text style={styles.editProfileText}>Muokkaa profiilia</Text>
      </Pressable>

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
        <Pressable accessibilityRole="button" onPress={onSignOut} style={[styles.menuRow, styles.menuRowBorder]}>
          <View style={styles.menuIconWrap}>
            <Feather name="log-out" size={23} color="#A14C3A" strokeWidth={1.9} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.logoutTitle}>Kirjaudu ulos</Text>
            <Text style={styles.menuSubtitle}>Palaa aloitusnäkymään</Text>
          </View>
          <Feather name="chevron-right" size={22} color={theme.colors.text} strokeWidth={1.9} />
        </Pressable>
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
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  topIconButton: {
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
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  locationText: {
    flex: 1,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  bio: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  editProfileButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  editProfileText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '800',
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
  logoutTitle: {
    color: '#A14C3A',
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
