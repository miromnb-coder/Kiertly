import { supabase } from './supabase';

export type KiertlyProfile = {
  id: string;
  displayName: string;
  email: string;
  location: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
};

export type UpdateOwnProfileInput = {
  displayName: string;
  location: string;
  bio?: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
};

function getDisplayNameFromEmail(email?: string | null) {
  const fallbackName = email?.split('@')[0]?.trim();
  return fallbackName || 'Kiertly-käyttäjä';
}

function rowToProfile(row: ProfileRow): KiertlyProfile {
  return {
    id: row.id,
    displayName: row.display_name ?? getDisplayNameFromEmail(row.email),
    email: row.email ?? '',
    location: row.location ?? 'Helsinki',
    bio: row.bio ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
  };
}

export async function ensureOwnProfile(userId: string, email?: string | null) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        display_name: getDisplayNameFromEmail(email),
        email: email ?? '',
      },
      { onConflict: 'id', ignoreDuplicates: true },
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return rowToProfile(data as ProfileRow);
}

export async function fetchOwnProfile(userId: string, email?: string | null) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return rowToProfile(data as ProfileRow);
  }

  return ensureOwnProfile(userId, email);
}

export async function updateOwnProfile(userId: string, updates: UpdateOwnProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.displayName.trim(),
      location: updates.location.trim() || 'Sijainti lisäämättä',
      bio: updates.bio?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return rowToProfile(data as ProfileRow);
}
