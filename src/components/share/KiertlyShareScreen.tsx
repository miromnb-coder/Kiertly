import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';
import { KiertlyFormField } from './KiertlyFormField';
import { KiertlyFormRow } from './KiertlyFormRow';
import { KiertlyPhotoUploadBox } from './KiertlyPhotoUploadBox';
import { KiertlyShareHeader } from './KiertlyShareHeader';
import { KiertlyShareMethodChips, type ShareMethod } from './KiertlyShareMethodChips';

type KiertlyShareScreenProps = {
  onClose: () => void;
};

export function KiertlyShareScreen({ onClose }: KiertlyShareScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<ShareMethod>('Lainaa ilmaiseksi');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <KiertlyShareHeader onClose={onClose} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <KiertlyPhotoUploadBox />

          <View style={styles.form}>
            <KiertlyFormField label="Otsikko" helperText="Mitä jaat?" />
            <KiertlyFormField
              label="Kuvaus"
              helperText="Kerro tavarasta, kunnosta ja muista oleellisista tiedoista."
            />
            <KiertlyFormRow label="Kategoria" value="Valitse kategoria" showChevron />
            <KiertlyShareMethodChips
              selectedMethod={selectedMethod}
              onMethodPress={setSelectedMethod}
            />
            <KiertlyFormRow label="Hinta" value="0,00 €" rightText="Valinnainen" />
            <KiertlyFormRow label="Sijainti" value="Valitse sijainti" showChevron />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" style={styles.submitButton}>
            <Text style={styles.submitText}>Jaa tavara</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  form: {
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: 19,
    fontWeight: '800',
  },
});
