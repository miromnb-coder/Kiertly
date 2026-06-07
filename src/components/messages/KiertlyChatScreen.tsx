import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
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
import type { MessageThread } from './KiertlyMessagesScreen';

type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
};

type KiertlyChatScreenProps = {
  thread: MessageThread;
  onBack: () => void;
};

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hei! Onko porakone vielä saatavilla ensi viikolla?',
    time: '10.24',
    isMine: false,
  },
  {
    id: '2',
    text: 'Moikka! Kyllä on. Milloin tarvitsisit sitä?',
    time: '10.26',
    isMine: true,
  },
  {
    id: '3',
    text: 'Sopiiko tiistaina illalla?',
    time: '10.27',
    isMine: false,
  },
  {
    id: '4',
    text: 'Kyllä sopii hyvin. Nouto onnistuu klo 18 jälkeen.',
    time: '10.28',
    isMine: true,
  },
  {
    id: '5',
    text: 'Mahtavaa, kiitos! 💚',
    time: '10.29',
    isMine: false,
  },
];

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
}

export function KiertlyChatScreen({ thread, onBack }: KiertlyChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');

  function sendMessage() {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `message-${Date.now()}`,
        text: trimmedDraft,
        time: getCurrentTime(),
        isMine: true,
      },
    ]);
    setDraft('');
  }

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
            <Image source={{ uri: thread.avatarUri }} style={styles.headerAvatar} />
            <View style={styles.headerTextWrap}>
              <Text numberOfLines={1} style={styles.headerName}>{thread.name}</Text>
              <Text numberOfLines={1} style={styles.headerSubtitle}>{thread.itemTitle}</Text>
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
              {thread.itemImageUri ? (
                <Image source={{ uri: thread.itemImageUri }} style={styles.itemImage} resizeMode="cover" />
              ) : (
                <Feather name="package" size={34} color={theme.colors.primary} strokeWidth={1.8} />
              )}
            </View>
            <View style={styles.itemTextWrap}>
              <Text numberOfLines={1} style={styles.itemName}>{thread.itemTitle}</Text>
              <Text numberOfLines={1} style={styles.itemHighlight}>{thread.itemHighlight}</Text>
              <View style={styles.itemDistanceRow}>
                <Feather name="map-pin" size={14} color={theme.colors.mutedText} strokeWidth={1.8} />
                <Text style={styles.itemDistance}>{thread.distance}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.dateDivider}>Tänään</Text>

          <View style={styles.messagesWrap}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[styles.messageRow, message.isMine ? styles.myMessageRow : styles.theirMessageRow]}
              >
                {!message.isMine ? (
                  <Image source={{ uri: thread.avatarUri }} style={styles.messageAvatar} />
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
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <Feather name="paperclip" size={22} color={theme.colors.mutedText} strokeWidth={1.9} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Kirjoita viesti..."
              placeholderTextColor={theme.colors.mutedText}
              multiline
              style={styles.input}
            />
          </View>
          <Pressable accessibilityRole="button" onPress={sendMessage} style={styles.sendButton}>
            <Feather name="send" size={21} color={theme.colors.white} strokeWidth={2.2} />
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
    marginBottom: theme.spacing.xl,
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
  dateDivider: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
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
