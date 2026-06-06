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
import { KiertlyItemGrid } from '../src/components/home/KiertlyItemGrid';
import { KiertlySearchBar } from '../src/components/home/KiertlySearchBar';
import { KiertlySearchEmptyState } from '../src/components/search/KiertlySearchEmptyState';
import { KiertlySearchHeader, type KiertlySearchMode } from '../src/components/search/KiertlySearchHeader';
import { KiertlySearchTabs } from '../src/components/search/KiertlySearchTabs';
import { KiertlyShareScreen } from '../src/components/share/KiertlyShareScreen';
import { theme } from '../src/constants/theme';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<KiertlySearchMode>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HomeCategory>('Kaikki');

  function closeSearch() {
    setIsSearchOpen(false);
    setSearchQuery('');
    setActiveSearchTab('products');
  }

  function openHomeCategory(category: HomeCategory) {
    setActiveCategory(category);
    setActiveTab('home');
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

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
        <KiertlySearchBar onPress={() => setIsSearchOpen(true)} />
        <KiertlyCategoryChips
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
        />
        <KiertlyItemGrid activeCategory={activeCategory} />
      </ScrollView>
    );
  }

  if (activeTab === 'share' && !isSearchOpen) {
    return <KiertlyShareScreen onClose={() => setActiveTab('home')} />;
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
          <KiertlyBottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
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
