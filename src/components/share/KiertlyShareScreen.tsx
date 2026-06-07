import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';
import { KiertlyCategoryPicker, type ShareCategory } from './KiertlyCategoryPicker';
import { KiertlyFormField } from './KiertlyFormField';
import { KiertlyFormRow } from './KiertlyFormRow';
import { KiertlyPhotoUploadBox, type SelectedPhoto } from './KiertlyPhotoUploadBox';
import { KiertlyShareHeader } from './KiertlyShareHeader';
import { KiertlyShareMethodChips, type ShareMethod } from './KiertlyShareMethodChips';

type KiertlyShareScreenProps = {
  onClose: () => void;
  onCreateItem: (item: KiertlyGridItem) => Promise<void> | void;
};

const maxPhotos = 10;

function getHighlight(method: ShareMethod, price: string) {
  if (method === 'Vuokraa') {
    return price.trim() ? `${price.trim()} € / päivä` : 'Vuokraa';
  }

  if (method === 'Myy käytettynä') {
    return price.trim() ? `${price.trim()} €` : 'Myy käytettynä';
  }

  if (method === 'Lainaa ilmaiseksi') {
    return 'Lainaa ilmaiseksi';
  }

  if (method === 'Anna ilmaiseksi') {
    return 'Ilmainen';
  }

  return 'Vaihda';
}

function getFilterCategories(method: ShareMethod) {
  if (method === 'Lainaa ilmaiseksi') {
    return ['Lainaa' as const];
  }

  if (method === 'Vuokraa') {
    return ['Vuokraa' as const];
  }

  if (method === 'Vaihda') {
    return ['Vaihda' as const];
  }

  if (method === 'Anna ilmaiseksi') {
    return ['Ilmaiset' as const];
  }

  return ['Kaikki' as const];
}

export function KiertlyShareScreen({ onClose, onCreateItem }: KiertlyShareScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<ShareMethod>('Lainaa ilmaiseksi');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShareCategory | undefined>();
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedPhoto[]>([]);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shouldShowPrice = selectedMethod === 'Vuokraa' || selectedMethod === 'Myy käytettynä';

  function selectCategory(category: ShareCategory) {
    setSelectedCategory(category);
    setIsCategoryPickerOpen(false);
  }

  async function pickPhotos() {
    const remainingPhotoSlots = maxPhotos - selectedPhotos.length;

    if (remainingPhotoSlots <= 0) {
      Alert.alert('Kuvia on jo enimmäismäärä', 'Voit lisätä enintään 10 kuvaa.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Kuvia ei voi valita', 'Salli kuvakirjaston käyttö, jotta voit lisätä tavarasta kuvia.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingPhotoSlots,
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const nextPhotos = result.assets.slice(0, remainingPhotoSlots).map((asset) => ({
      id: asset.assetId ?? asset.uri,
      uri: asset.uri,
    }));

    setSelectedPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos].slice(0, maxPhotos));
  }

  function removePhoto(photoId: string) {
    setSelectedPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== photoId));
  }

  async function submitItem() {
    if (isSubmitting) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedPrice = price.trim();

    if (selectedPhotos.length === 0) {
      Alert.alert('Lisää kuva', 'Lisää tavarasta ainakin yksi kuva.');
      return;
    }

    if (!trimmedTitle) {
      Alert.alert('Lisää otsikko', 'Kirjoita tavaralle otsikko.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Valitse kategoria', 'Valitse tavaralle kategoria.');
      return;
    }

    if (shouldShowPrice && !trimmedPrice) {
      Alert.alert('Lisää hinta', 'Kirjoita hinta tälle jakotavalle.');
      return;
    }

    const newItem: KiertlyGridItem = {
      id: `shared-${Date.now()}`,
      title: trimmedTitle,
      meta: `${selectedMethod} • ${selectedCategory}`,
      highlight: getHighlight(selectedMethod, trimmedPrice),
      likes: 0,
      backgroundColor: '#EFE5D6',
      imageUri: selectedPhotos[0].uri,
      filterCategories: getFilterCategories(selectedMethod),
      categoryLabel: selectedCategory,
      detailDescription: description.trim(),
      ownerName: 'Sinä',
      isAvailable: true,
    };

    setIsSubmitting(true);

    try {
      await onCreateItem(newItem);
      Alert.alert('Tavara lisätty!', 'Tavara tallennettiin Kiertlyyn.', [
        {
          text: 'OK',
          onPress: onClose,
        },
      ]);
    } catch {
      Alert.alert('Tallennus epäonnistui', 'Tavaraa ei voitu tallentaa. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <KiertlyPhotoUploadBox
            selectedPhotos={selectedPhotos}
            onAddPhotos={pickPhotos}
            onRemovePhoto={removePhoto}
          />

          <View style={styles.form}>
            <KiertlyFormField
              label="Otsikko"
              value={title}
              hintText="Mitä jaat?"
              onChangeText={setTitle}
            />
            <KiertlyFormField
              label="Kuvaus"
              value={description}
              hintText="Kerro tavarasta, kunnosta ja muista oleellisista tiedoista."
              onChangeText={setDescription}
              multiline
            />
            <KiertlyFormRow
              label="Kategoria"
              value={selectedCategory ?? 'Valitse kategoria'}
              showChevron
              onPress={() => setIsCategoryPickerOpen(true)}
            />
            <KiertlyShareMethodChips
              selectedMethod={selectedMethod}
              onMethodPress={setSelectedMethod}
            />
            {shouldShowPrice ? (
              <KiertlyFormField
                label="Hinta"
                value={price}
                hintText="0,00 €"
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            ) : null}
            <KiertlyFormRow label="Sijainti" value="Valitse sijainti" showChevron />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={submitItem}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <Text style={styles.submitText}>{isSubmitting ? 'Tallennetaan...' : 'Jaa tavara'}</Text>
          </Pressable>
        </View>

        {isCategoryPickerOpen ? (
          <KiertlyCategoryPicker
            selectedCategory={selectedCategory}
            onSelectCategory={selectCategory}
            onClose={() => setIsCategoryPickerOpen(false)}
          />
        ) : null}
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
  submitButtonDisabled: {
    opacity: 0.72,
  },
  submitText: {
    color: theme.colors.white,
    fontSize: 19,
    fontWeight: '800',
  },
});
