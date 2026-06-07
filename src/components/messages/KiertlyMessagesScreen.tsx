import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

type MessageThread = {
  id: string;
  name: string;
  itemTitle: string;
  preview: string;
  time: string;
  avatarUri: string;
  isOnline?: boolean;
  unreadCount?: number;
};

const messageThreads: MessageThread[] = [
  {
    id: 'anna-drill',
    name: 'Anna',
    itemTitle: 'Akkuporakone Bosch',
    preview: 'Hei! Onko porakone vielä saatavilla ensi viikolla?',
    time: '10.24',
    avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: 'mikko-suitcase',
    name: 'Mikko',
    itemTitle: 'Matkalaukku',
    preview: 'Kiitos! Nouto sopii minulle torstaina iltapäivällä.',
    time: '09.48',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
    isOnline: true,
  },
  {
    id: 'laura-speaker',
    name: 'Laura',
    itemTitle: 'Bluetooth-kaiutin',
    preview: 'Kaiutin toimi tosi hyvin, kiitos lainasta! ⭐',
    time: 'Eilen',
    avatarUri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=faces',
    isOnline: true,
  },
  {
    id: 'joni-chairs',
    name: 'Joni',
    itemTitle: 'Retkituolit 2 kpl',
    preview: 'Sovitaan kohtaamispaikka huomiselle.',
    time: 'Pe',
    avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'sofia-party',
    name: 'Sofia',
    itemTitle: 'Juhlat',
    preview: 'Moi! Laitoin vielä viestin yksityiskohdista 😊',
    time: 'Pe',
    avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  },
];

export function KiertlyMessagesScreen() {
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

      <View style={styles.threadList}>
        {messageThreads.map((thread) => (
          <Pressable key={thread.id} accessibilityRole="button" style={styles.threadRow}>
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
