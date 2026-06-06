import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export type SelectedPhoto = {
  id: string;
  uri: string;
};

type KiertlyPhotoUploadBoxProps = {
  selectedPhotos: SelectedPhoto[];
  onAddPhotos: () => void;
  onRemovePhoto: (photoId: string) => void;
};

export function KiertlyPhotoUploadBox({
  selectedPhotos,
  onAddPhotos,
  onRemovePhoto,
}: KiertlyPhotoUploadBoxProps) {
  if (selectedPhotos.length === 0) {
    return (
      <Pressable accessibilityRole="button" onPress={onAddPhotos} style={styles.box}>
        <View style={styles.iconCircle}>
          <Feather name="camera" size={29} color={theme.colors.white} strokeWidth={2} />
        </View>
        <Text style={styles.title}>+ Lataa valokuvia</Text>
        <Text style={styles.subtitle}>Lisää jopa 10 kuvaa</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.previewSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previewList}
      >
        {selectedPhotos.map((photo, index) => (
          <View key={photo.id} style={[styles.previewCard, index === 0 && styles.mainPreviewCard]}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Poista kuva"
              onPress={() => onRemovePhoto(photo.id)}
              style={styles.removeButton}
            >
              <Feather name="x" size={15} color={theme.colors.white} strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}

        {selectedPhotos.length < 10 ? (
          <Pressable accessibilityRole="button" onPress={onAddPhotos} style={styles.addMoreCard}>
            <Feather name="plus" size={28} color={theme.colors.primary} strokeWidth={2.4} />
            <Text style={styles.addMoreText}>Lisää</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <Text style={styles.counterText}>{selectedPhotos.length}/10 kuvaa lisätty</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D7C9B4',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  iconCircle: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  previewSection: {
    marginBottom: theme.spacing.xl,
  },
  previewList: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  previewCard: {
    width: 92,
    height: 92,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.border,
  },
  mainPreviewCard: {
    width: 150,
    height: 150,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(31, 36, 24, 0.72)',
  },
  addMoreCard: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D7C9B4',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  addMoreText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  counterText: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
});
