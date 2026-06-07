import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';

type KiertlyEditItemScreenProps = {
  item: KiertlyGridItem;
  onBack: () => void;
  onSave: (item: KiertlyGridItem) => Promise<void> | void;
};

export function KiertlyEditItemScreen({ item, onBack, onSave }: KiertlyEditItemScreenProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.detailDescription ?? '');
  const [highlight, setHighlight] = useState(item.highlight);
  const [isSaving, setIsSaving] = useState(false);

  async function saveChanges() {
    if (isSaving) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedHighlight = highlight.trim();

    if (!trimmedTitle) {
      Alert.alert('Lisää otsikko', 'Tavaralla täytyy olla otsikko.');
      return;
    }

    if (!trimmedHighlight) {
      Alert.alert('Lisää jakotieto', 'Kirjoita tavaralle jakotapa tai hinta.');
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        ...item,
        title: trimmedTitle,
        highlight: trimmedHighlight,
        detailDescription: description.trim(),
      });
    } catch {
      Alert.alert('Tallennus epäonnistui', 'Muutoksia ei voitu tallentaa. Yritä uudelleen.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Takaisin omiin tavaroihin"
          hitSlop={12}
          onPress={onBack}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={25} color={theme.colors.text} strokeWidth={2} />
        </Pressable>

        <Text style={styles.headerTitle}>Muokkaa tavaraa</Text>

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
        <View style={styles.infoBox}>
          <Feather name="edit-3" size={24} color={theme.colors.primary} strokeWidth={1.9} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Päivitä tavaran tiedot</Text>
            <Text style={styles.infoText}>Muutokset tallentuvat Supabaseen ja näkyvät omissa tavaroissa.</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Otsikko</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Mitä jaat?"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Jakotapa / hinta</Text>
          <TextInput
            value={highlight}
            onChangeText={setHighlight}
            placeholder="Lainaa ilmaiseksi"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Kuvaus</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Kerro tavarasta lisää"
            placeholderTextColor={theme.colors.mutedText}
            editable={!isSaving}
            multiline
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
          />
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
  infoBox: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
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
  label: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
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
  descriptionInput: {
    minHeight: 150,
    paddingTop: theme.spacing.md,
    lineHeight: 22,
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
