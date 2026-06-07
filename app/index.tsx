import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
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
  kiertlyDefaultItems,
  type KiertlyGridItem,
} from '../src/components/home/KiertlyItemGrid';
import { KiertlyItemDetailScreen } from '../src/components/item/KiertlyItemDetailScreen';
import { KiertlyChatScreen } from '../src/components/messages/KiertlyChatScreen';
import { KiertlyMessagesScreen, type MessageThread } from '../src/components/messages/KiertlyMessagesScreen';
import { KiertlyEditItemScreen } from '../src/components/profile/KiertlyEditItemScreen';
import { KiertlyOwnItemsScreen } from '../src/components/profile/KiertlyOwnItemsScreen';
import { KiertlyProfileScreen } from '../src/components/profile/KiertlyProfileScreen';
import { KiertlySearchBar } from '../src/components/home/KiertlySearchBar';
import { KiertlySearchHeader, type KiertlySearchMode } from '../src/components/search/KiertlySearchHeader';
import { KiertlySearchResults } from '../src/components/search/KiertlySearchResults';
import { KiertlySearchTabs } from '../src/components/search/KiertlySearchTabs';
import { KiertlyShareScreen } from '../src/components/share/KiertlyShareScreen';
import { theme } from '../src/constants/theme';
import { supabase } from '../src/lib/supabase';

type ProfileSubscreen = 'main' | 'ownItems' | 'editItem';
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
  const [sharedItems, setSharedItems] = useState<KiertlyGridItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KiertlyGridItem | undefined>();
  const [selectedThread, setSelectedThread] = useState<MessageThread | undefined>();
  const [profileSubscreen, setProfileSubscreen] = useState<ProfileSubscreen>('main');
  const [editingItem, setEditingItem] = useState<KiertlyGridItem | undefined>();

  const searchableItems = [...sharedItems, ...kiertlyDefaultItems];
  const userEmail = session?.user.email ?? null;

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

  function resetNavigationState() {
    setActiveTab('home');
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSearchTab('products');
    setActiveCategory('Kaikki');
    setSelectedItem(undefined);
    setSelectedThread(undefined);
    setEditingItem(undefined);
    setProfileSubscreen('main');
  }

  async function signOut() {
    resetNavigationState();
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

  function createSharedItem(item: KiertlyGridItem) {
    setSharedItems((currentItems) => [item, ...currentItems]);
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

  function saveItem(updatedItem: KiertlyGridItem) {
    setSharedItems((currentItems) =>
      currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
    setSelectedItem((currentItem) =>
      currentItem?.id === updatedItem.id ? updatedItem : currentItem,
    );
    setEditingItem(undefined);
    setProfileSubscreen('ownItems');
  }

  function deleteItem(itemId: string) {
    setSharedItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    setSelectedItem((currentItem) => (currentItem?.id === itemId ? undefined : currentItem));
  }

  function toggleAvailability(itemToToggle: KiertlyGridItem) {
    const updatedItem = {
      ...itemToToggle,
      isAvailable: itemToToggle.isAvailable === false,
    };

    setSharedItems((currentItems) =>
      currentItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
    setSelectedItem((currentItem) =>
      currentItem?.id === updatedItem.id ? updatedItem : currentItem,
    );
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
      return <KiertlyMessagesScreen onThreadPress={setSelectedThread} />;
    }

    if (activeTab === 'profile') {
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
            items={sharedItems}
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
            sharedItemCount={sharedItems.length}
            userEmail={userEmail}
            onOwnItemsPress={() => setProfileSubscreen('ownItems')}
            onSignOut={signOut}
          />
        </ScrollView>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        <KiertlySearchBar onPress={() => setIsSearchOpen(true)} />
        <KiertlyCategoryChips
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />
        <KiertlyItemGrid
          activeCategory={activeCategory}
          sharedItems={sharedItems}
          onItemPress={setSelectedItem}
        />
      </ScrollView>
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
    return <KiertlyChatScreen thread={selectedThread} onBack={() => setSelectedThread(undefined)} />;
  }

  if (selectedItem && !isSearchOpen) {
    return <KiertlyItemDetailScreen item={selectedItem} onBack={() => setSelectedItem(undefined)} />;
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
  searchContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
