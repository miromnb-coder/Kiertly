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
  { key: 'home', label: 'Etusivu', icon: 'home' },
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
              <View
                style={[
                  styles.iconWrap,
                  isShare && styles.shareIconWrap,
                  !isShare && isActive && styles.activeIconWrap,
                ]}
              >
                <Feather
                  name={tab.icon}
                  size={isShare ? 24 : 23}
                  color={isShare ? theme.colors.white : isActive ? theme.colors.primary : theme.colors.text}
                  strokeWidth={isShare ? 2.8 : 2.2}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                  isShare && styles.shareLabel,
                ]}
              >
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
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bar: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  iconWrap: {
    width: 36,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  activeIconWrap: {
    backgroundColor: '#F0F2E8',
  },
  shareIconWrap: {
    width: 42,
    height: 42,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
  },
  label: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  shareLabel: {
    marginTop: -2,
  },
});
