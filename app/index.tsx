import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KiertlyBottomTabBar, type BottomTabKey } from '../src/components/KiertlyBottomTabBar';
import { KiertlyBrowseHeader } from '../src/components/browse/KiertlyBrowseHeader';
import { KiertlyCategoryGrid } from '../src/components/browse/KiertlyCategoryGrid';
import {
  KiertlyCategoryChips,
  type HomeCategory,
} from '../src/components/home/KiertlyCategoryChips';
import { KiertlyItemGrid, type KiertlyGridItem } from '../src/components/home/KiertlyItemGrid';
import { KiertlyItemDetailScreen } from '../src/components/item/KiertlyItemDetailScreen';
import { KiertlyChatScreen } from '../src/components/messages/KiertlyChatScreen';
import { KiertlyMessagesScreen, type MessageThread } from '../src/components/messages/KiertlyMessagesScreen';
import { KiertlyEditItemScreen } from '../src/components/profile/KiertlyEditItemScreen';
import { KiertlyOwnItemsScreen } from '../src/components/profile/KiertlyOwnItemsScreen';
import { KiertlyProfileScreen } from '../src/components/profile/KiertlyProfileScreen';
import { KiertlySearchBar } from '../src/components/home/KiertlySearchBar';
import { KiertlySearchEmptyState } from '../src/components/search/KiertlySearchEmptyState';
import { KiertlySearchHeader, type KiertlySearchMode } from '../src/components/search/KiertlySearchHeader';
import { KiertlySearchTabs } from '../src/components/search/KiertlySearchTabs';
import { KiertlyShareScreen } from '../src/components/share/KiertlyShareScreen';
import { theme } from '../src/constants/theme';

type ProfileSubscreen = 'main' | 'ownItems' | 'editItem';

export default function HomeScreen() {
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

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSearchTab('products');
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
            onOwnItemsPress={() => setProfileSubscreen('ownItems')}
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
          <KiertlySearchEmptyState mode={activeSearchTab} />
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
  pageContent: {
    paddingTop: theme.spacing.sm,
  },
  searchContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
