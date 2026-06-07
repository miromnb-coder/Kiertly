import { supabase } from './supabase';

export type KiertlyProfile = {
  id: string;
  displayName: string;
  email: string;
  location: string;
  avatarUrl?: string;
  createdAt: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  location: string | null;
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
