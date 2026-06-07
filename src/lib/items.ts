import type { HomeCategory } from '../components/home/KiertlyCategoryChips';
import type { KiertlyGridItem } from '../components/home/KiertlyItemGrid';
import { supabase } from './supabase';

type ItemRow = {
  id: string;
  user_id: string;
  title: string;
  meta: string | null;
  highlight: string | null;
  likes: number | null;
  background_color: string | null;
  image_uri: string | null;
  image_uris: string[] | null;
  image_paths: string[] | null;
  filter_categories: string[] | null;
  category_label: string | null;
  detail_description: string | null;
  owner_name: string | null;
  is_available: boolean | null;
  created_at: string;
};

function rowToGridItem(row: ItemRow): KiertlyGridItem {
  const imageUris = row.image_uris?.length ? row.image_uris : row.image_uri ? [row.image_uri] : [];

  return {
    id: row.id,
    title: row.title,
    meta: row.meta ?? '',
    highlight: row.highlight ?? '',
    likes: row.likes ?? 0,
    backgroundColor: row.background_color ?? '#EFE5D6',
    imageUri: imageUris[0] ?? undefined,
    imageUris,
    imagePaths: row.image_paths ?? [],
    filterCategories: (row.filter_categories ?? []) as HomeCategory[],
    categoryLabel: row.category_label ?? undefined,
    detailDescription: row.detail_description ?? undefined,
    ownerName: row.owner_name ?? undefined,
    isAvailable: row.is_available ?? true,
  };
}

function itemToPayload(item: KiertlyGridItem, userId?: string) {
  const imageUris = item.imageUris?.length ? item.imageUris : item.imageUri ? [item.imageUri] : [];

  return {
    ...(userId ? { user_id: userId } : {}),
    title: item.title,
    meta: item.meta,
    highlight: item.highlight,
    likes: item.likes,
    background_color: item.backgroundColor,
    image_uri: imageUris[0] ?? null,
    image_uris: imageUris,
    image_paths: item.imagePaths ?? [],
    filter_categories: item.filterCategories ?? [],
    category_label: item.categoryLabel ?? null,
    detail_description: item.detailDescription ?? null,
    owner_name: item.ownerName ?? null,
    is_available: item.isAvailable ?? true,
  };
}

export async function fetchPublicItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToGridItem(row as ItemRow));
}

export async function fetchOwnItems(userId: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToGridItem(row as ItemRow));
}

export async function createOwnItem(item: KiertlyGridItem, userId: string) {
  const { data, error } = await supabase
    .from('items')
    .insert(itemToPayload(item, userId))
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return rowToGridItem(data as ItemRow);
}

export async function updateOwnItem(item: KiertlyGridItem) {
  const { data, error } = await supabase
    .from('items')
    .update(itemToPayload(item))
    .eq('id', item.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return rowToGridItem(data as ItemRow);
}

export async function deleteOwnItem(itemId: string) {
  const { error } = await supabase.from('items').delete().eq('id', itemId);

  if (error) {
    throw error;
  }
}

export async function updateOwnItemAvailability(itemId: string, isAvailable: boolean) {
  const { data, error } = await supabase
    .from('items')
    .update({ is_available: isAvailable })
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return rowToGridItem(data as ItemRow);
}
