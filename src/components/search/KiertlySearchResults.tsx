import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { KiertlyGridItem } from '../home/KiertlyItemGrid';
import { theme } from '../../constants/theme';
import type { KiertlySearchMode } from './KiertlySearchHeader';

type SearchMember = {
  id: string;
  name: string;
  subtitle: string;
  avatarUri: string;
};

type KiertlySearchResultsProps = {
  mode: KiertlySearchMode;
  query: string;
  items: KiertlyGridItem[];
  onItemPress: (item: KiertlyGridItem) => void;
};

const members: SearchMember[] = [
  {
    id: 'sanni',
    name: 'Sanni',
    subtitle: 'Kiertly-käyttäjä • 23 jaettua tavaraa',
    avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'anna',
    name: 'Anna',
    subtitle: 'Luotettava lainaaja • Työkalut ja koti',
    avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
  },
  {
    id: 'mikko',
    name: 'Mikko',
    subtitle: 'Vuokraa matkailutarvikkeita',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function itemMatchesQuery(item: KiertlyGridItem, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return false;
  }

  const searchableText = normalize(
    [
      item.title,
      item.meta,
      item.highlight,
      item.categoryLabel,
      item.detailDescription,
      item.ownerName,
    ]
      .filter(Boolean)
      .join(' '),
  );

  return searchableText.includes(normalizedQuery);
}

function memberMatchesQuery(member: SearchMember, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return false;
  }

  return normalize(`${member.name} ${member.subtitle}`).includes(normalizedQuery);
}

function SearchPrompt({ mode }: { mode: KiertlySearchMode }) {
  const isMembers = mode === 'members';

  return (
    <View style={styles.promptWrapper}>
      <View style={styles.iconCircle}>
        <Feather name={isMembers ? 'user' : 'search'} size={56} color={theme.colors.primary} strokeWidth={1.8} />
      </View>
      <Text style={styles.promptTitle}>{isMembers ? 'Hae jäseniä' : 'Hae tavaroita'}</Text>
      <Text style={styles.promptDescription}>
        {isMembers
          ? 'Kirjoita jäsenen nimi tai kiinnostava aihe.'
          : 'Kirjoita esimerkiksi porakone, retkeily, matkailu tai kaiutin.'}
      </Text>
    </View>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <View style={styles.promptWrapper}>
      <View style={styles.iconCircle}>
        <Feather name="search" size={56} color={theme.colors.primary} strokeWidth={1.8} />
      </View>
      <Text style={styles.promptTitle}>Ei hakutuloksia</Text>
      <Text style={styles.promptDescription}>Haulla “{query}” ei löytynyt vielä mitään.</Text>
    </View>
  );
}

export function KiertlySearchResults({ mode, query, items, onItemPress }: KiertlySearchResultsProps) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <SearchPrompt mode={mode} />;
  }

  if (mode === 'members') {
    const matchingMembers = members.filter((member) => memberMatchesQuery(member, trimmedQuery));

    if (matchingMembers.length === 0) {
      return <NoResults query={trimmedQuery} />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.memberList}>
        <Text style={styles.resultsTitle}>{matchingMembers.length} jäsentä löytyi</Text>
        {matchingMembers.map((member) => (
          <Pressable key={member.id} accessibilityRole="button" style={styles.memberRow}>
            <Image source={{ uri: member.avatarUri }} style={styles.memberAvatar} />
            <View style={styles.memberTextWrap}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text numberOfLines={1} style={styles.memberSubtitle}>{member.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={22} color={theme.colors.text} />
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  const matchingItems = items.filter((item) => itemMatchesQuery(item, trimmedQuery));

  if (matchingItems.length === 0) {
    return <NoResults query={trimmedQuery} />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsContent}>
      <Text style={styles.resultsTitle}>{matchingItems.length} tavaraa löytyi</Text>
      <View style={styles.grid}>
        {matchingItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => onItemPress(item)}
            style={styles.card}
          >
            <View style={[styles.imageWrap, { backgroundColor: item.backgroundColor }]}> 
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
              ) : (
                <Feather name="package" size={42} color={theme.colors.primary} strokeWidth={1.8} />
              )}
              {item.isAvailable === false ? (
                <View style={styles.unavailableOverlay}>
                  <Text style={styles.unavailableText}>Varattu</Text>
                </View>
              ) : null}
            </View>
            <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.itemMeta}>{item.meta}</Text>
            <Text numberOfLines={1} style={styles.itemHighlight}>
              {item.isAvailable === false ? 'Ei saatavilla juuri nyt' : item.highlight}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  promptWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 120,
  },
  iconCircle: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF3E4',
  },
  promptTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  promptDescription: {
    maxWidth: 310,
    color: theme.colors.mutedText,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  resultsContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 112,
  },
  resultsTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: theme.spacing.lg,
  },
  card: {
    width: '48.5%',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 36, 24, 0.45)',
  },
  unavailableText: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  itemTitle: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  itemMeta: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 11,
    lineHeight: 14,
  },
  itemHighlight: {
    marginTop: 5,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  memberList: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 112,
  },
  memberRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
  },
  memberTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  memberSubtitle: {
    marginTop: 3,
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '600',
  },
});
