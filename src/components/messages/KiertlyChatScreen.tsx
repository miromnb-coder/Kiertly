import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';
import {
  fetchChatMessages,
  sendThreadMessage,
  updateBorrowRequestStatus,
  type BorrowRequestStatus,
  type KiertlyChatMessage,
} from '../../lib/requests';
import type { MessageThread } from './KiertlyMessagesScreen';

type KiertlyChatScreenProps = {
  thread: MessageThread;
  currentUserId: string;
  onBack: () => void;
  onThreadUpdated: (thread: MessageThread) => void;
};

function getStatusTitle(status?: BorrowRequestStatus) {
  if (status === 'accepted') {
    return 'Lainapyyntö hyväksytty';
  }

  if (status === 'declined') {
    return 'Lainapyyntö hylätty';
  }

  if (status === 'cancelled') {
    return 'Lainapyyntö peruttu';
  }

  if (status === 'completed') {
    return 'Laina palautettu';
  }

  return 'Lainapyyntö odottaa vastausta';
}

function getStatusDescription(thread: MessageThread) {
  if (thread.requestStatus === 'accepted') {
    return 'Sopikaa nouto, käyttöaika ja palautus tässä keskustelussa.';
  }

  if (thread.requestStatus === 'declined') {
    return 'Pyyntö on suljettu. Voitte silti jatkaa keskustelua tarvittaessa.';
  }

  if (thread.requestStatus === 'cancelled') {
    return 'Pyytäjä perui pyynnön. Keskustelu jää talteen viesteihin.';
  }

  if (thread.requestStatus === 'completed') {
    return 'Laina on merkitty palautetuksi ja tavara voidaan taas näyttää saatavilla.';
  }

  return thread.isOwner
    ? 'Vastaa pyyntöön hyväksymällä tai hylkäämällä se.'
    : 'Odota omistajan vastausta. Voit myös lähettää lisätietoja viestillä.';
}

function getActionError(status: BorrowRequestStatus) {
  if (status === 'accepted') {
    return 'Pyyntöä ei voitu hyväksyä. Yritä uudelleen.';
  }

  if (status === 'declined') {
    return 'Pyyntöä ei voitu hylätä. Yritä uudelleen.';
  }

  if (status === 'cancelled') {
    return 'Pyyntöä ei voitu perua. Yritä uudelleen.';
  }

  return 'Tilaa ei voitu päivittää. Yritä uudelleen.';
}

export function KiertlyChatScreen({
  thread,
  currentUserId,
  onBack,
  onThreadUpdated,
}: KiertlyChatScreenProps) {
  const [currentThread, setCurrentThread] = useState(thread);
  const [messages, setMessages] = useState<KiertlyChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    setCurrentThread(thread);
  }, [thread]);

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      setIsLoadingMessages(true);

      try {
        const nextMessages = await fetchChatMessages(thread.id, currentUserId);

        if (isMounted) {
          setMessages(nextMessages);
        }
      } catch {
        if (isMounted) {
          Alert.alert('Viestejä ei voitu hakea', 'Yritä hetken päästä uudelleen.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [currentUserId, thread.id]);

  async function refreshMessages() {
    const nextMessages = await fetchChatMessages(currentThread.id, currentUserId);
    setMessages(nextMessages);
  }

  async function sendMessage() {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);

    try {
      const sentMessage = await sendThreadMessage(currentThread.id, currentUserId, trimmedDraft);
      setMessages((currentMessages) => [...currentMessages, sentMessage]);
      setDraft('');
    } catch {
      Alert.alert('Viestiä ei voitu lähettää', 'Tarkista yhteys ja yritä uudelleen.');
    } finally {
      setIsSendingMessage(false);
    }
  }

  async function changeRequestStatus(status: BorrowRequestStatus) {
    if (isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const updatedThread = await updateBorrowRequestStatus(currentThread, status, currentUserId);
      setCurrentThread(updatedThread);
      onThreadUpdated(updatedThread);
      await refreshMessages();
    } catch {
      Alert.alert('Pyyntöä ei voitu päivittää', getActionError(status));
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const canOwnerRespond = currentThread.isOwner && currentThread.requestStatus === 'pending';
  const canRequesterCancel = !currentThread.isOwner && currentThread.requestStatus === 'pending';
  const canOwnerComplete = currentThread.isOwner && currentThread.requestStatus === 'accepted';
  const isSendDisabled = isSendingMessage || !draft.trim();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Takaisin viesteihin"
            hitSlop={12}
            onPress={onBack}
            style={styles.headerIconButton}
          >
            <Feather name="arrow-left" size={27} color={theme.colors.text} strokeWidth={2} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Image source={{ uri: currentThread.avatarUri }} style={styles.headerAvatar} />
            <View style={styles.headerTextWrap}>
              <Text numberOfLines={1} style={styles.headerName}>{currentThread.name}</Text>
              <Text numberOfLines={1} style={styles.headerSubtitle}>{currentThread.itemTitle}</Text>
            </View>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="Keskustelun tiedot" hitSlop={12} style={styles.headerIconButton}>
            <Feather name="info" size={24} color={theme.colors.text} strokeWidth={1.9} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.itemCard}>
            <View style={styles.itemImageWrap}>
              {currentThread.itemImageUri ? (
                <Image source={{ uri: currentThread.itemImageUri }} style={styles.itemImage} resizeMode="cover" />
              ) : (
                <Feather name="package" size={34} color={theme.colors.primary} strokeWidth={1.8} />
              )}
            </View>
            <View style={styles.itemTextWrap}>
              <Text numberOfLines={1} style={styles.itemName}>{currentThread.itemTitle}</Text>
              <Text numberOfLines={1} style={styles.itemHighlight}>{currentThread.itemHighlight}</Text>
              <View style={styles.itemDistanceRow}>
                <Feather name="map-pin" size={14} color={theme.colors.mutedText} strokeWidth={1.8} />
                <Text style={styles.itemDistance}>{currentThread.distance}</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestCard}>
            <View style={styles.requestIconCircle}>
              <Feather name="repeat" size={22} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.requestTextWrap}>
              <Text style={styles.requestTitle}>{getStatusTitle(currentThread.requestStatus)}</Text>
              <Text style={styles.requestDescription}>{getStatusDescription(currentThread)}</Text>

              {canOwnerRespond ? (
                <View style={styles.requestActionsRow}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={isUpdatingStatus}
                    onPress={() => changeRequestStatus('accepted')}
                    style={[styles.requestPrimaryButton, isUpdatingStatus && styles.disabledButton]}
                  >
                    <Text style={styles.requestPrimaryText}>Hyväksy</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    disabled={isUpdatingStatus}
                    onPress={() => changeRequestStatus('declined')}
                    style={[styles.requestSecondaryButton, isUpdatingStatus && styles.disabledButton]}
                  >
                    <Text style={styles.requestSecondaryText}>Hylkää</Text>
                  </Pressable>
                </View>
              ) : null}

              {canRequesterCancel ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isUpdatingStatus}
                  onPress={() => changeRequestStatus('cancelled')}
                  style={[styles.requestSecondaryButton, styles.singleActionButton, isUpdatingStatus && styles.disabledButton]}
                >
                  <Text style={styles.requestSecondaryText}>Peru pyyntö</Text>
                </Pressable>
              ) : null}

              {canOwnerComplete ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isUpdatingStatus}
                  onPress={() => changeRequestStatus('completed')}
                  style={[styles.requestPrimaryButton, styles.singleActionButton, isUpdatingStatus && styles.disabledButton]}
                >
                  <Text style={styles.requestPrimaryText}>Merkitse palautetuksi</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <Text style={styles.dateDivider}>Keskustelu</Text>

          {isLoadingMessages ? (
            <View style={styles.loadingMessages}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.loadingText}>Haetaan viestejä...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyMessagesTitle}>Ei vielä viestejä</Text>
              <Text style={styles.emptyMessagesText}>Aloita keskustelu lähettämällä ensimmäinen viesti.</Text>
            </View>
          ) : (
            <View style={styles.messagesWrap}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[styles.messageRow, message.isMine ? styles.myMessageRow : styles.theirMessageRow]}
                >
                  {!message.isMine ? (
                    <Image source={{ uri: currentThread.avatarUri }} style={styles.messageAvatar} />
                  ) : null}

                  <View style={[styles.bubble, message.isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={styles.messageText}>{message.text}</Text>
                    <View style={styles.messageMetaRow}>
                      <Text style={styles.messageTime}>{message.time}</Text>
                      {message.isMine ? (
                        <Feather name="check" size={12} color={theme.colors.mutedText} strokeWidth={2} />
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <Feather name="message-circle" size={22} color={theme.colors.mutedText} strokeWidth={1.9} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Kirjoita viesti..."
              placeholderTextColor={theme.colors.mutedText}
              multiline
              editable={!isSendingMessage}
              style={styles.input}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={isSendDisabled}
            onPress={sendMessage}
            style={[styles.sendButton, isSendDisabled && styles.disabledButton]}
          >
            {isSendingMessage ? (
              <ActivityIndicator color={theme.colors.white} size="small" />
            ) : (
              <Feather name="send" size={21} color={theme.colors.white} strokeWidth={2.2} />
            )}
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
  header: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  headerAvatar: {
    width: 43,
    height: 43,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  headerTextWrap: {
    maxWidth: 190,
  },
  headerName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    marginTop: 1,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 16,
  },
  itemCard: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.44)',
  },
  itemImageWrap: {
    width: 86,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    backgroundColor: '#F0ECE2',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  itemHighlight: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  itemDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: theme.spacing.sm,
  },
  itemDistance: {
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  requestCard: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: '#EEF3E4',
  },
  requestIconCircle: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  },
  requestTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  requestTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  requestDescription: {
    marginTop: 4,
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  requestPrimaryButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  requestPrimaryText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  requestSecondaryButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  requestSecondaryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  singleActionButton: {
    marginTop: theme.spacing.md,
  },
  disabledButton: {
    opacity: 0.62,
  },
  dateDivider: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingMessages: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyMessages: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  emptyMessagesTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyMessagesText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  messagesWrap: {
    gap: theme.spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  bubble: {
    maxWidth: '68%',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 8,
    borderRadius: theme.radius.lg,
  },
  theirBubble: {
    borderBottomLeftRadius: 8,
    backgroundColor: '#F0ECE4',
  },
  myBubble: {
    borderBottomRightRadius: 8,
    backgroundColor: '#E1DFCB',
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  messageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 5,
  },
  messageTime: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  inputWrap: {
    flex: 1,
    minHeight: 50,
    maxHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  sendButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
});
