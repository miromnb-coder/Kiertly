import type { MessageThread } from '../components/messages/KiertlyMessagesScreen';
import type { KiertlyGridItem } from '../components/home/KiertlyItemGrid';
import type { KiertlyProfile } from './profiles';
import { supabase } from './supabase';

type BorrowRequestRow = {
  id: string;
  item_id: string;
  requester_id: string;
  owner_id: string;
  status: string;
  created_at: string;
};

type MessageThreadRow = {
  id: string;
  item_id: string;
  request_id: string | null;
  owner_id: string;
  requester_id: string;
  created_at: string;
  updated_at: string;
  items?: {
    title: string | null;
    highlight: string | null;
    image_uri: string | null;
  } | null;
  owner_profile?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  requester_profile?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  messages?: {
    body: string | null;
    created_at: string;
  }[] | null;
};

function formatThreadTime(value?: string | null) {
  if (!value) {
    return 'Äsken';
  }

  const date = new Date(value);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return 'Eilen';
}

function getFallbackAvatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEF3E4&color=405032`;
}

function rowToThread(row: MessageThreadRow, currentUserId: string): MessageThread {
  const isOwner = row.owner_id === currentUserId;
  const otherProfile = isOwner ? row.requester_profile : row.owner_profile;
  const otherName = otherProfile?.display_name || 'Kiertly-käyttäjä';
  const latestMessage = row.messages?.[0];

  return {
    id: row.id,
    itemId: row.item_id,
    name: otherName,
    itemTitle: row.items?.title || 'Tavara',
    preview: latestMessage?.body || 'Uusi lainapyyntö',
    time: formatThreadTime(latestMessage?.created_at ?? row.updated_at),
    avatarUri: otherProfile?.avatar_url || getFallbackAvatar(otherName),
    itemImageUri: row.items?.image_uri ?? undefined,
    itemHighlight: row.items?.highlight || 'Lainaa',
    distance: 'Lähellä',
    isOnline: true,
  };
}

export async function createBorrowRequestThread(item: KiertlyGridItem, requester: KiertlyProfile) {
  if (!requester.id) {
    throw new Error('Kirjaudu sisään ennen pyynnön lähettämistä.');
  }

  if (!item.ownerId) {
    throw new Error('Tavaran omistajaa ei löytynyt.');
  }

  if (item.ownerId === requester.id) {
    throw new Error('Et voi lähettää pyyntöä omasta tavarastasi.');
  }

  const { data: requestData, error: requestError } = await supabase
    .from('borrow_requests')
    .insert({
      item_id: item.id,
      requester_id: requester.id,
      owner_id: item.ownerId,
      status: 'pending',
    })
    .select('*')
    .single();

  if (requestError) {
    throw requestError;
  }

  const request = requestData as BorrowRequestRow;

  const { data: threadData, error: threadError } = await supabase
    .from('message_threads')
    .insert({
      item_id: item.id,
      request_id: request.id,
      owner_id: item.ownerId,
      requester_id: requester.id,
    })
    .select('id')
    .single();

  if (threadError) {
    throw threadError;
  }

  const threadId = threadData.id as string;
  const messageBody = `${requester.displayName} pyytää tavaraa: ${item.title}`;

  const { error: messageError } = await supabase.from('messages').insert({
    thread_id: threadId,
    sender_id: requester.id,
    body: messageBody,
  });

  if (messageError) {
    throw messageError;
  }

  return fetchMessageThread(threadId, requester.id);
}

export async function fetchMessageThread(threadId: string, currentUserId: string) {
  const { data, error } = await supabase
    .from('message_threads')
    .select(`
      id,
      item_id,
      request_id,
      owner_id,
      requester_id,
      created_at,
      updated_at,
      items:item_id(title, highlight, image_uri),
      owner_profile:owner_id(display_name, avatar_url),
      requester_profile:requester_id(display_name, avatar_url),
      messages(body, created_at)
    `)
    .eq('id', threadId)
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' })
    .single();

  if (error) {
    throw error;
  }

  return rowToThread(data as MessageThreadRow, currentUserId);
}

export async function fetchMessageThreads(currentUserId: string) {
  const { data, error } = await supabase
    .from('message_threads')
    .select(`
      id,
      item_id,
      request_id,
      owner_id,
      requester_id,
      created_at,
      updated_at,
      items:item_id(title, highlight, image_uri),
      owner_profile:owner_id(display_name, avatar_url),
      requester_profile:requester_id(display_name, avatar_url),
      messages(body, created_at)
    `)
    .or(`owner_id.eq.${currentUserId},requester_id.eq.${currentUserId}`)
    .order('updated_at', { ascending: false })
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToThread(row as MessageThreadRow, currentUserId));
}
