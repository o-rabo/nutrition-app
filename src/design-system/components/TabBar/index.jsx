import { StyleSheet, View } from 'react-native'
import { colors, spacing } from '../../tokens'
import { TabBarItem } from '../TabBarItem'

const TABS = [
  { id: 'today',    label: 'Today',    iconName: 'today'    },
  { id: 'diary',    label: 'Diary',    iconName: 'diary'    },
  { id: 'insights', label: 'Insights', iconName: 'insights' },
  { id: 'profile',  label: 'Profile',  iconName: 'profile'  },
]

function TabBar({ activeTab, onTabPress, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.background.tabBar,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border.subtle,
          paddingTop: spacing.tabBarTop,
          paddingBottom: spacing.tabBarBottom,
          paddingHorizontal: spacing.screenHorizontal,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
        },
        style,
      ]}
    >
      {TABS.map((tab) => (
        <TabBarItem
          key={tab.id}
          label={tab.label}
          iconName={tab.iconName}
          active={activeTab === tab.id}
          onPress={() => onTabPress?.(tab.id)}
        />
      ))}
    </View>
  )
}

export { TabBar }
export default TabBar
