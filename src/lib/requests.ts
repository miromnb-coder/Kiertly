import type { MessageThread } from '../components/messages/KiertlyMessagesScreen';
import type { KiertlyGridItem } from '../components/home/KiertlyItemGrid';
import type { KiertlyProfile } from './profiles';
import { supabase } from './supabase';

export type BorrowRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';

export type KiertlyChatMessage = {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
};

type BorrowRequestRow = {
  id: string;
  item_id: string;
  requester_id: string;
  owner_id: string;
  status: string;
  created_at: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string | null;
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
  borrow_request?: {
    status: string | null;
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

function formatClockTime(value?: string | null) {
  if (!value) {
    return 'Äsken';
  }

  const date = new Date(value);

  return `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatThreadTime(value?: string | null) {
  if (!value) {
    return 'Äsken';
  }

  const date = new Date(value);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return formatClockTime(value);
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Eilen';
  }

  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.`;
}

function getFallbackAvatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEF3E4&color=405032`;
}

function normalizeRequestStatus(status?: string | null): BorrowRequestStatus {
  if (
    status === 'accepted' ||
    status === 'declined' ||
    status === 'cancelled' ||
    status === 'completed'
  ) {
    return status;
  }

  return 'pending';
}

function getStatusMessage(status: BorrowRequestStatus) {
  if (status === 'accepted') {
    return 'Lainapyyntö hyväksyttiin. Sopikaa noudosta ja palautuksesta tässä keskustelussa.';
  }

  if (status === 'declined') {
    return 'Lainapyyntö hylättiin.';
  }

  if (status === 'cancelled') {
    return 'Lainapyyntö peruttiin.';
  }

  if (status === 'completed') {
    return 'Laina merkittiin palautetuksi.';
  }

  return 'Lainapyyntö odottaa vastausta.';
}

function rowToThread(row: MessageThreadRow, currentUserId: string): MessageThread {
  const isOwner = row.owner_id === currentUserId;
  const otherProfile = isOwner ? row.requester_profile : row.owner_profile;
  const otherName = otherProfile?.display_name || 'Kiertly-käyttäjä';
  const latestMessage = row.messages?.[0];

  return {
    id: row.id,
    itemId: row.item_id,
    requestId: row.request_id ?? undefined,
    ownerId: row.owner_id,
    requesterId: row.requester_id,
    requestStatus: normalizeRequestStatus(row.borrow_request?.status),
    isOwner,
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

function rowToChatMessage(row: MessageRow, currentUserId: string): KiertlyChatMessage {
  return {
    id: row.id,
    text: row.body ?? '',
    time: formatClockTime(row.created_at),
    isMine: row.sender_id === currentUserId,
  };
}

async function findExistingThread(item: KiertlyGridItem, requesterId: string) {
  if (!item.ownerId) {
    return undefined;
  }

  const { data, error } = await supabase
    .from('message_threads')
    .select('id')
    .eq('item_id', item.id)
    .eq('requester_id', requesterId)
    .eq('owner_id', item.ownerId)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0]?.id as string | undefined;
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

  const existingThreadId = await findExistingThread(item, requester.id);

  if (existingThreadId) {
    return fetchMessageThread(existingThreadId, requester.id);
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

  await touchThread(threadId);

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
      borrow_request:request_id(status),
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
      borrow_request:request_id(status),
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

export async function fetchChatMessages(threadId: string, currentUserId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, thread_id, sender_id, body, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToChatMessage(row as MessageRow, currentUserId));
}

export async function sendThreadMessage(threadId: string, senderId: string, body: string) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new Error('Viesti ei voi olla tyhjä.');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: senderId,
      body: trimmedBody,
    })
    .select('id, thread_id, sender_id, body, created_at')
    .single();

  if (error) {
    throw error;
  }

  await touchThread(threadId);

  return rowToChatMessage(data as MessageRow, senderId);
}

export async function updateBorrowRequestStatus(
  thread: MessageThread,
  status: BorrowRequestStatus,
  currentUserId: string,
) {
  if (!thread.requestId) {
    throw new Error('Lainapyyntöä ei löytynyt.');
  }

  if (status !== 'cancelled' && thread.ownerId !== currentUserId) {
    throw new Error('Vain omistaja voi muuttaa lainapyynnön tilaa.');
  }

  if (status === 'cancelled' && thread.requesterId !== currentUserId) {
    throw new Error('Vain pyynnön lähettäjä voi perua lainapyynnön.');
  }

  const { error: requestError } = await supabase
    .from('borrow_requests')
    .update({ status })
    .eq('id', thread.requestId);

  if (requestError) {
    throw requestError;
  }

  if (thread.itemId && (status === 'accepted' || status === 'completed')) {
    const { error: itemError } = await supabase
      .from('items')
      .update({ is_available: status === 'completed' })
      .eq('id', thread.itemId);

    if (itemError) {
      throw itemError;
    }
  }

  const { error: messageError } = await supabase.from('messages').insert({
    thread_id: thread.id,
    sender_id: currentUserId,
    body: getStatusMessage(status),
  });

  if (messageError) {
    throw messageError;
  }

  await touchThread(thread.id);

  return fetchMessageThread(thread.id, currentUserId);
}

async function touchThread(threadId: string) {
  const { error } = await supabase
    .from('message_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId);

  if (error) {
    throw error;
  }
}
