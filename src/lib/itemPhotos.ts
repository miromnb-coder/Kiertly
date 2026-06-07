import { supabase } from './supabase';

const itemPhotosBucket = 'item-photos';

type UploadedItemPhoto = {
  path: string;
  publicUrl: string;
};

function getFileExtension(uri: string) {
  const cleanUri = uri.split('?')[0] ?? uri;
  const extension = cleanUri.split('.').pop()?.toLowerCase();

  if (extension === 'png' || extension === 'webp') {
    return extension;
  }

  return 'jpg';
}

function getContentType(extension: string) {
  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

function isRemoteUrl(uri: string) {
  return uri.startsWith('http://') || uri.startsWith('https://');
}

async function uploadSingleItemPhoto(uri: string, userId: string, itemDraftId: string, index: number) {
  const extension = getFileExtension(uri);
  const contentType = getContentType(extension);
  const filePath = `${userId}/${itemDraftId}/${Date.now()}-${index}.${extension}`;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from(itemPhotosBucket)
    .upload(filePath, arrayBuffer, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(itemPhotosBucket).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

export async function uploadItemPhotos(photoUris: string[], userId: string, itemDraftId: string) {
  const localPhotoUris = photoUris.filter((uri) => uri && !isRemoteUrl(uri));

  if (localPhotoUris.length === 0) {
    return {
      imageUris: photoUris,
      imagePaths: [] as string[],
    };
  }

  const uploadedPhotos: UploadedItemPhoto[] = [];

  for (const [index, uri] of localPhotoUris.entries()) {
    const uploadedPhoto = await uploadSingleItemPhoto(uri, userId, itemDraftId, index);
    uploadedPhotos.push(uploadedPhoto);
  }

  return {
    imageUris: uploadedPhotos.map((photo) => photo.publicUrl),
    imagePaths: uploadedPhotos.map((photo) => photo.path),
  };
}

export async function deleteItemPhotos(photoPaths?: string[]) {
  if (!photoPaths?.length) {
    return;
  }

  const { error } = await supabase.storage.from(itemPhotosBucket).remove(photoPaths);

  if (error) {
    throw error;
  }
}
