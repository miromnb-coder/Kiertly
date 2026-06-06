import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KiertlyBottomTabBar } from '../src/components/KiertlyBottomTabBar';
import { KiertlyCategoryChips } from '../src/components/home/KiertlyCategoryChips';
import { KiertlyItemGrid } from '../src/components/home/KiertlyItemGrid';
import { KiertlySearchBar } from '../src/components/home/KiertlySearchBar';
import { theme } from '../src/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <KiertlySearchBar />
        <KiertlyCategoryChips />
        <KiertlyItemGrid />
      </ScrollView>

      <KiertlyBottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingTop: theme.spacing.sm,
  },
});
