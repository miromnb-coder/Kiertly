import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

export type BottomTabKey = 'home' | 'browse' | 'share' | 'messages' | 'profile';

type BottomTabItem = {
  key: BottomTabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

type KiertlyBottomTabBarProps = {
  activeTab?: BottomTabKey;
  onTabPress?: (tab: BottomTabKey) => void;
};

const tabs: BottomTabItem[] = [
  { key: 'home', label: 'Kartta', icon: 'map-pin' },
  { key: 'browse', label: 'Selaa', icon: 'grid' },
  { key: 'share', label: 'Jaa', icon: 'plus' },
  { key: 'messages', label: 'Viestit', icon: 'message-circle' },
  { key: 'profile', label: 'Profiili', icon: 'user' },
];

export function KiertlyBottomTabBar({
  activeTab = 'home',
  onTabPress,
}: KiertlyBottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isShare = tab.key === 'share';

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              onPress={() => onTabPress?.(tab.key)}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isShare && styles.shareIconWrap]}>
                <Feather
                  name={tab.icon}
                  size={isShare ? 23 : 22}
                  color={isShare ? theme.colors.white : isActive ? theme.colors.primary : theme.colors.text}
                  strokeWidth={isShare ? 2.7 : 2.15}
                />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 86,
    paddingTop: 7,
    paddingHorizontal: 8,
    paddingBottom: 0,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bar: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 3,
    paddingTop: 4,
  },
  iconWrap: {
    width: 32,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  shareIconWrap: {
    width: 39,
    height: 39,
    marginTop: -2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
  },
  label: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
