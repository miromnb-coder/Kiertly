import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KiertlyAuthStartScreen } from '../src/components/auth/KiertlyAuthStartScreen';
import { KiertlyEmailAuthScreen } from '../src/components/auth/KiertlyEmailAuthScreen';
import { KiertlyBottomTabBar, type BottomTabKey } from '../src/components/KiertlyBottomTabBar';
import { KiertlyBrowseHeader } from '../src/components/browse/KiertlyBrowseHeader';
import { KiertlyCategoryGrid } from '../src/components/browse/KiertlyCategoryGrid';
import {
  KiertlyCategoryChips,
  type HomeCategory,
} from '../src/components/home/KiertlyCategoryChips';
import {
  KiertlyItemGrid,
  type KiertlyGridItem,
} from '../src/components/home/KiertlyItemGrid';
import { KiertlyItemDetailScreen } from '../src/components/item/KiertlyItemDetailScreen';
import { KiertlyChatScreen } from '../src/components/messages/KiertlyChatScreen';
import { KiertlyMessagesScreen, type MessageThread } from '../src/components/messages/KiertlyMessagesScreen';
import { KiertlyEditItemScreen } from '../src/components/profile/KiertlyEditItemScreen';
import { KiertlyEditProfileScreen } from '../src/components/profile/KiertlyEditProfileScreen';
import { KiertlyOwnItemsScreen } from '../src/components/profile/KiertlyOwnItemsScreen';
import { KiertlyProfileScreen } from '../src/components/profile/KiertlyProfileScreen';
import { KiertlySearchBar } from '../src/components/home/KiertlySearchBar';
import { KiertlySearchHeader, type KiertlySearchMode } from '../src/components/search/KiertlySearchHeader';
import { KiertlySearchResults } from '../src/components/search/KiertlySearchResults';
import { KiertlySearchTabs } from '../src/components/search/KiertlySearchTabs';
import { KiertlyShareScreen } from '../src/components/share/KiertlyShareScreen';
import { theme } from '../src/constants/theme';
import {
  createOwnItem,
  deleteOwnItem,
  fetchOwnItems,
  fetchPublicItems,
  updateOwnItem,
  updateOwnItemAvailability,
} from '../src/lib/items';
import { deleteItemPhotos, uploadItemPhotos } from '../src/lib/itemPhotos';
import {
  fetchOwnProfile,
  updateOwnProfile,
  type KiertlyProfile,
  type UpdateOwnProfileInput,
} from '../src/lib/profiles';
import {
  createBorrowRequestThread,
  fetchMessageThreads,
} from '../src/lib/requests';
import { supabase } from '../src/lib/supabase';

type ProfileSubscreen = 'main' | 'ownItems' | 'editItem' | 'editProfile';
type AuthScreen = 'start' | 'email';

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('start');
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<KiertlySearchMode>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HomeCategory>('Kaikki');
  const [ownItems, setOwnItems] = useState<KiertlyGridItem[]>([]);
  const [publicItems, setPublicItems] = useState<KiertlyGridItem[]>([]);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);
  const [profile, setProfile] = useState<KiertlyProfile | null>(null);
  const [selectedItem, setSelectedItem] = useState<KiertlyGridItem | undefined>();
  const [selectedThread, setSelectedThread] = useState<MessageThread | undefined>();
  const [profileSubscreen, setProfileSubscreen] = useState<ProfileSubscreen>('main');
  const [editingItem, setEditingItem] = useState<KiertlyGridItem | undefined>();
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const searchableItems = publicItems;
  const userEmail = profile?.email || session?.user.email || null;
  const ownerDisplayName = profile?.displayName || userEmail?.split('@')[0] || 'Kiertly-käyttäjä';

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadItemsAndProfile() {
      if (!session?.user.id) {
        setOwnItems([]);
        setPublicItems([]);
        setMessageThreads([]);
        setProfile(null);
        return;
      }

      try {
        const [nextProfile, nextOwnItems, nextPublicItems, nextMessageThreads] = await Promise.all([
          fetchOwnProfile(session.user.id, session.user.email),
          fetchOwnItems(session.user.id),
          fetchPublicItems(),
          fetchMessageThreads(session.user.id),
        ]);

        if (isMounted) {
          setProfile(nextProfile);
          setOwnItems(nextOwnItems);
          setPublicItems(nextPublicItems);
          setMessageThreads(nextMessageThreads);
        }
      } catch {
        if (isMounted) {
          Alert.alert('Tietoja ei voitu hakea', 'Yritä hetken päästä uudelleen.');
        }
      }
    }

    loadItemsAndProfile();

    return () => {
      isMounted = false;
    };
  }, [session?.user.id, session?.user.email]);

  function resetNavigationState() {
    setActiveTab('home');
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSearchTab('products');
    setActiveCategory('Kaikki');
    setSelectedItem(undefined);
    setSelectedThread(undefined);
    setEditingItem(undefined);
    setIsSubmittingRequest(false);
    setProfileSubscreen('main');
  }

  function upsertPublicItem(itemToUpsert: KiertlyGridItem) {
    if (itemToUpsert.isAvailable === false) {
      setPublicItems((currentItems) => currentItems.filter((item) => item.id !== itemToUpsert.id));
      return;
    }

    setPublicItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemToUpsert.id);

      if (existingItem) {
        return currentItems.map((item) => (item.id === itemToUpsert.id ? itemToUpsert : item));
      }

      return [itemToUpsert, ...currentItems];
    });
  }

  function upsertMessageThread(threadToUpsert: MessageThread) {
    setMessageThreads((currentThreads) => {
      const existingThread = currentThreads.find((thread) => thread.id === threadToUpsert.id);

      if (existingThread) {
        return [
          threadToUpsert,
          ...currentThreads.filter((thread) => thread.id !== threadToUpsert.id),
        ];
      }

      return [threadToUpsert, ...currentThreads];
    });
  }

  function syncItemAvailabilityFromThread(threadToSync: MessageThread) {
    if (!threadToSync.itemId) {
      return;
    }

    const shouldMarkUnavailable = threadToSync.requestStatus === 'accepted';
    const shouldMarkAvailable = threadToSync.requestStatus === 'completed';

    if (!shouldMarkUnavailable && !shouldMarkAvailable) {
      return;
    }

    const nextAvailability = shouldMarkAvailable;

    setOwnItems((currentItems) =>
      currentItems.map((item) =>
        item.id === threadToSync.itemId ? { ...item, isAvailable: nextAvailability } : item,
      ),
    );
    setPublicItems((currentItems) => {
      if (shouldMarkUnavailable) {
        return currentItems.filter((item) => item.id !== threadToSync.itemId);
      }

      return currentItems.map((item) =>
        item.id === threadToSync.itemId ? { ...item, isAvailable: nextAvailability } : item,
      );
    });
    setSelectedItem((currentItem) =>
      currentItem?.id === threadToSync.itemId
        ? { ...currentItem, isAvailable: nextAvailability }
        : currentItem,
    );
  }

  function handleThreadUpdated(updatedThread: MessageThread) {
    upsertMessageThread(updatedThread);
    setSelectedThread(updatedThread);
    syncItemAvailabilityFromThread(updatedThread);
  }

  async function signOut() {
    resetNavigationState();
    setOwnItems([]);
    setPublicItems([]);
    setMessageThreads([]);
    setProfile(null);
    setAuthScreen('start');
    await supabase.auth.signOut();
  }

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSearchTab('products');
  }

  function openSearchItem(item: KiertlyGridItem) {
    setSelectedItem(item);
    setIsSearchOpen(false);
  }

  function openHomeCategory(category: HomeCategory) {
    setActiveCategory(category);
    setActiveTab('home');
    setProfileSubscreen('main');
  }

  async function createSharedItem(item: KiertlyGridItem) {
    if (!session?.user.id) {
      throw new Error('Kirjaudu sisään ennen tavaran lisäämistä.');
    }

    const uploadedPhotos = await uploadItemPhotos(item.imageUris ?? [], session.user.id, item.id);
    const itemWithUploadedPhotos = {
      ...item,
      ownerName: ownerDisplayName,
      imageUri: uploadedPhotos.imageUris[0],
      imageUris: uploadedPhotos.imageUris,
      imagePaths: uploadedPhotos.imagePaths,
    };
    const createdItem = await createOwnItem(itemWithUploadedPhotos, session.user.id);

    setOwnItems((currentItems) => [createdItem, ...currentItems]);
    upsertPublicItem(createdItem);
    setActiveCategory('Kaikki');
    setActiveTab('home');
    setProfileSubscreen('main');
  }

  function handleTabPress(tab: BottomTabKey) {
    setSelectedItem(undefined);
    setSelectedThread(undefined);
    setEditingItem(undefined);
    setProfileSubscreen('main');
    setActiveTab(tab);
  }

  function editItem(item: KiertlyGridItem) {
    setEditingItem(item);
    setProfileSubscreen('editItem');
  }

  async function saveItem(updatedItem: KiertlyGridItem) {
    const savedItem = await updateOwnItem(updatedItem);

    setOwnItems((currentItems) =>
      currentItems.map((item) => (item.id === savedItem.id ? savedItem : item)),
    );
    upsertPublicItem(savedItem);
    setSelectedItem((currentItem) =>
      currentItem?.id === savedItem.id ? savedItem : currentItem,
    );
    setEditingItem(undefined);
    setProfileSubscreen('ownItems');
  }

  async function saveProfile(updates: UpdateOwnProfileInput) {
    if (!session?.user.id) {
      throw new Error('Kirjaudu sisään ennen profiilin muokkaamista.');
    }

    const updatedProfile = await updateOwnProfile(session.user.id, updates);

    setProfile(updatedProfile);
    setProfileSubscreen('main');
  }

  async function deleteItem(itemId: string) {
    try {
      const itemToDelete = ownItems.find((item) => item.id === itemId);

      await deleteOwnItem(itemId);
      await deleteItemPhotos(itemToDelete?.imagePaths);

      setOwnItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      setPublicItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      setSelectedItem((currentItem) => (currentItem?.id === itemId ? undefined : currentItem));
    } catch {
      Alert.alert('Poisto epäonnistui', 'Tavaraa ei voitu poistaa. Yritä uudelleen.');
    }
  }

  async function toggleAvailability(itemToToggle: KiertlyGridItem) {
    try {
      const updatedItem = await updateOwnItemAvailability(
        itemToToggle.id,
        itemToToggle.isAvailable === false,
      );

      setOwnItems((currentItems) =>
        currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );
      upsertPublicItem(updatedItem);
      setSelectedItem((currentItem) =>
        currentItem?.id === updatedItem.id ? updatedItem : currentItem,
      );
    } catch {
      Alert.alert('Saatavuutta ei voitu muuttaa', 'Yritä hetken päästä uudelleen.');
    }
  }

  async function requestItem(item: KiertlyGridItem) {
    if (isSubmittingRequest) {
      return;
    }

    if (!profile) {
      Alert.alert('Profiilia ei löytynyt', 'Kirjaudu uudelleen ja kokeile sitten uudestaan.');
      return;
    }

    if (!item.ownerId) {
      Alert.alert('Tavaraa ei voi pyytää', 'Avaa oikea käyttäjän lisäämä tavara lähettääksesi lainapyynnön.');
      return;
    }

    if (item.ownerId === profile.id) {
      Alert.alert('Oma tavara', 'Et voi lähettää pyyntöä omasta tavarastasi.');
      return;
    }

    setIsSubmittingRequest(true);

    try {
      const thread = await createBorrowRequestThread(item, profile);
      upsertMessageThread(thread);
      setSelectedThread(thread);
      setSelectedItem(undefined);
      setActiveTab('messages');
    } catch {
      Alert.alert('Pyyntöä ei voitu lähettää', 'Yritä hetken päästä uudelleen.');
    } finally {
      setIsSubmittingRequest(false);
    }
  }

  async function openItemChat(item: KiertlyGridItem) {
    const existingThread = messageThreads.find((thread) => thread.itemId === item.id);

    if (existingThread) {
      setSelectedThread(existingThread);
      setSelectedItem(undefined);
      setActiveTab('messages');
      return;
    }

    await requestItem(item);
  }

  function renderMainContent() {
    if (activeTab === 'browse') {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
          <KiertlyBrowseHeader onSearchPress={() => setIsSearchOpen(true)} />
          <KiertlyCategoryGrid onCategoryPress={openHomeCategory} />
        </ScrollView>
      );
    }

    if (activeTab === 'messages') {
      return <KiertlyMessagesScreen threads={messageThreads} onThreadPress={setSelectedThread} />;
    }

    if (activeTab === 'profile') {
      if (profileSubscreen === 'editProfile' && profile) {
        return (
          <KiertlyEditProfileScreen
            profile={profile}
            userEmail={userEmail}
            onBack={() => setProfileSubscreen('main')}
            onSave={saveProfile}
          />
        );
      }

      if (profileSubscreen === 'editItem' && editingItem) {
        return (
          <KiertlyEditItemScreen
            item={editingItem}
            onBack={() => setProfileSubscreen('ownItems')}
            onSave={saveItem}
          />
        );
      }

      if (profileSubscreen === 'ownItems') {
        return (
          <KiertlyOwnItemsScreen
            items={ownItems}
            onBack={() => setProfileSubscreen('main')}
            onItemPress={setSelectedItem}
            onEditItem={editItem}
            onDeleteItem={deleteItem}
            onToggleAvailability={toggleAvailability}
          />
        );
      }

      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
          <KiertlyProfileScreen
            sharedItemCount={ownItems.length}
            profile={profile}
            userEmail={userEmail}
            onEditProfilePress={() => setProfileSubscreen('editProfile')}
            onOwnItemsPress={() => setProfileSubscreen('ownItems')}
            onSignOut={signOut}
          />
        </ScrollView>
      );
    }

    return (
      <View style={styles.mapContent}>
        <KiertlySearchBar onPress={() => setIsSearchOpen(true)} />
        <KiertlyCategoryChips
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />
        <KiertlyItemGrid
          activeCategory={activeCategory}
          sharedItems={publicItems}
          onItemPress={setSelectedItem}
        />
      </View>
    );
  }

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top', 'bottom']}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!session) {
    if (authScreen === 'email') {
      return (
        <KiertlyEmailAuthScreen
          onBack={() => setAuthScreen('start')}
          onAuthenticated={() => setAuthScreen('start')}
        />
      );
    }

    return (
      <KiertlyAuthStartScreen
        onAppleContinue={() => setAuthScreen('email')}
        onGoogleContinue={() => setAuthScreen('email')}
        onEmailContinue={() => setAuthScreen('email')}
      />
    );
  }

  if (selectedThread && !isSearchOpen) {
    return (
      <KiertlyChatScreen
        thread={selectedThread}
        currentUserId={session.user.id}
        onBack={() => setSelectedThread(undefined)}
        onThreadUpdated={handleThreadUpdated}
      />
    );
  }

  if (selectedItem && !isSearchOpen) {
    return (
      <KiertlyItemDetailScreen
        item={selectedItem}
        isSubmittingRequest={isSubmittingRequest}
        onBack={() => setSelectedItem(undefined)}
        onRequestItem={requestItem}
        onChatPress={openItemChat}
      />
    );
  }

  if (activeTab === 'share' && !isSearchOpen) {
    return (
      <KiertlyShareScreen
        onClose={() => setActiveTab('home')}
        onCreateItem={createSharedItem}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {isSearchOpen ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.searchContent}
        >
          <KiertlySearchHeader
            mode={activeSearchTab}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            onClose={closeSearch}
          />
          <KiertlySearchTabs activeTab={activeSearchTab} onTabChange={setActiveSearchTab} />
          <KiertlySearchResults
            mode={activeSearchTab}
            query={searchQuery}
            items={searchableItems}
            onItemPress={openSearchItem}
          />
        </KeyboardAvoidingView>
      ) : (
        <>
          {renderMainContent()}
          <KiertlyBottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  pageContent: {
    paddingTop: theme.spacing.sm,
  },
  mapContent: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.background,
  },
  searchContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});