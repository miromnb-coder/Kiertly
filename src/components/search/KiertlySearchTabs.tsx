import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';
import type { KiertlySearchMode } from './KiertlySearchHeader';

type KiertlySearchTabsProps = {
  activeTab: KiertlySearchMode;
  onTabChange: (tab: KiertlySearchMode) => void;
};

const tabs: { key: KiertlySearchMode; label: string }[] = [
  { key: 'products', label: 'Tuotteet' },
  { key: 'members', label: 'Jäsenet' },
];

export function KiertlySearchTabs({ activeTab, onTabChange }: KiertlySearchTabsProps) {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            onPress={() => onTabChange(tab.key)}
            style={styles.tab}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
            <View style={[styles.indicator, isActive && styles.activeIndicator]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 54,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    marginBottom: 14,
    color: theme.colors.mutedText,
    fontSize: 16,
    fontWeight: '500',
  },
  activeLabel: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  indicator: {
    width: '100%',
    height: 2,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary,
  },
});
