import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KiertlyBottomTabBar } from '../src/components/KiertlyBottomTabBar';
import { KiertlySearchEmptyState } from '../src/components/search/KiertlySearchEmptyState';
import { KiertlySearchHeader, type KiertlySearchMode } from '../src/components/search/KiertlySearchHeader';
import { KiertlySearchTabs } from '../src/components/search/KiertlySearchTabs';
import { theme } from '../src/constants/theme';

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState<KiertlySearchMode>('products');
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <KiertlySearchHeader
          mode={activeTab}
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          onClose={() => router.back()}
        />
        <KiertlySearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <KiertlySearchEmptyState mode={activeTab} />
      </View>

      <KiertlyBottomTabBar activeTab="browse" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.card,
  },
  content: {
    flex: 1,
    paddingBottom: 86,
  },
});
