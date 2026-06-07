import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { KiertlyProfile, UpdateOwnProfileInput } from '../../lib/profiles';

type KiertlyEditProfileScreenProps = {
  profile: KiertlyProfile;
  userEmail?: string | null;
  onBack: () => void;
  onSave: (updates: UpdateOwnProfileInput) => Promise<void> | void;
};

const maxBioLength = 140;

export function KiertlyEditProfileScreen({
  profile,
  userEmail,
  onBack,
  onSave,
}: KiertlyEditProfileScreenProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const email = profile.email || userEmail || 'Ei sähköpostia';

  async function saveChanges() {
    if (isSaving) {
      return;
    }

    const trimmedDisplayName = displayName.trim();
    const trimmedBio = bio.trim();

    if (!trimmedDisplayName) {
      Alert.alert('Lisää näyttönimi', 'Profiililla täytyy olla nimi.');
      return;
    }

    if (trimmedBio.length > maxBioLength) {
      Alert.alert('Bio on liian pitkä', `Bio voi olla enintään ${maxBioLength} merkkiä.`);
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        displayName: trimmedDisplayName,
        location: location.trim(),
        bio: trimmedBio,
      });
    } catch {
      Alert.alert('Tallennus epäonnistui', 'Profiilia ei voitu päivittää. Yritä uudelleen.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Takaisin profiiliin"
          hitSlop={12}
          onPress={onBack}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={25} color={theme.colors.text} strokeWidth={2} />
        </Pressable>

        <Text style={styles.headerTitle}>Muokkaa profiilia</Text>

        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={saveChanges}
          style={styles.saveHeaderButton}
        >
          <Text style={[styles.saveHeaderText, isSaving && styles.disabledText]}>
            {isSaving ? 'Tallennetaan' : 'Tallenna'}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Feather name="user" size={54} color={theme.colors.primary} strokeWidth={1.8} />
            )}
          </View>
          <Text style={styles.avatarTitle}>Profiilikuva</Text>
          <Text style={styles.avatarDescription}>Kuvan vaihtaminen voidaan lisätä seuraavassa vaiheessa.</Text>
        </View>

        <View style={styles.infoBox}>
          <Feather name="shield" size={24} color={theme.colors.primary} strokeWidth={1.9} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Pidä profiili selkeänä</Text>
            <Text style={styles.infoText}>
              Nimi, sijainti ja lyhyt esittely auttavat muita luottamaan lainaamiseen.
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Näyttönimi</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Miten muut näkevät sinut?"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Sijainti</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Esim. Helsinki, Kallio"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Bio</Text>
            <Text style={styles.counterText}>{bio.trim().length}/{maxBioLength}</Text>
          </View>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Kerro lyhyesti, mitä jaat tai lainaat mielelläsi."
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            multiline
            maxLength={maxBioLength}
            style={[styles.input, styles.bioInput]}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Sähköposti</Text>
          <View style={styles.lockedField}>
            <Feather name="lock" size={18} color={theme.colors.mutedText} strokeWidth={1.9} />
            <Text numberOfLines={1} style={styles.lockedText}>{email}</Text>
          </View>
          <Text style={styles.helperText}>Sähköpostia ei voi muuttaa tästä näkymästä.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={saveChanges}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Tallennetaan...' : 'Tallenna muutokset'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  headerButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  saveHeaderButton: {
    minWidth: 92,
    alignItems: 'flex-end',
  },
  saveHeaderText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  disabledText: {
    opacity: 0.72,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 116,
    height: 116,
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
  avatarTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  avatarDescription: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  infoText: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: theme.spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  counterText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  bioInput: {
    minHeight: 128,
    paddingTop: theme.spacing.md,
    lineHeight: 22,
  },
  lockedField: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: '#F0ECE2',
  },
  lockedText: {
    flex: 1,
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.72,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
});
