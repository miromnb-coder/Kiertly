import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

export type MessageThread = {
  id: string;
  name: string;
  itemTitle: string;
  preview: string;
  time: string;
  avatarUri: string;
  itemImageUri?: string;
  itemHighlight: string;
  distance: string;
  isOnline?: boolean;
  unreadCount?: number;
};

type KiertlyMessagesScreenProps = {
  threads: MessageThread[];
  onThreadPress: (thread: MessageThread) => void;
};

export function KiertlyMessagesScreen({ threads, onThreadPress }: KiertlyMessagesScreenProps) {
  return (
    <View style={styles.screenContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Viestit</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Suodata viestejä" style={styles.filterButton}>
          <Feather name="sliders" size={24} color={theme.colors.primary} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={21} color={theme.colors.mutedText} strokeWidth={2} />
        <Text style={styles.searchText}>Hae keskusteluja</Text>
      </View>

      {threads.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Feather name="message-circle" size={40} color={theme.colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>Ei vielä keskusteluja</Text>
          <Text style={styles.emptyDescription}>
            Kun pyydät tavaraa lainaan tai joku pyytää sinun tavaraasi, keskustelu ilmestyy tänne.
          </Text>
        </View>
      ) : (
        <View style={styles.threadList}>
          {threads.map((thread) => (
            <Pressable
              key={thread.id}
              accessibilityRole="button"
              onPress={() => onThreadPress(thread)}
              style={styles.threadRow}
            >
              <View style={styles.avatarWrap}>
                <Image source={{ uri: thread.avatarUri }} style={styles.avatar} />
                {thread.isOnline ? <View style={styles.onlineDot} /> : null}
              </View>

              <View style={styles.threadContent}>
                <View style={styles.threadTopRow}>
                  <View style={styles.threadTitleWrap}>
                    <Text numberOfLines={1} style={styles.name}>{thread.name}</Text>
                    <Text numberOfLines={1} style={styles.itemTitle}>{thread.itemTitle}</Text>
                  </View>
                  <View style={styles.rightMeta}>
                    <Text style={styles.time}>{thread.time}</Text>
                    {thread.unreadCount ? (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{thread.unreadCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <Text numberOfLines={2} style={styles.preview}>{thread.preview}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 112,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  filterButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  searchBar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: '#F0ECE2',
  },
  searchText: {
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    minHeight: 430,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconCircle: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  threadList: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  threadRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarWrap: {
    width: 62,
    height: 62,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 4,
    width: 12,
    height: 12,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    borderColor: theme.colors.background,
    backgroundColor: theme.colors.primary,
  },
  threadContent: {
    flex: 1,
    minWidth: 0,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  threadTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  itemTitle: {
    marginTop: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rightMeta: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  time: {
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  unreadText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  preview: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
});
