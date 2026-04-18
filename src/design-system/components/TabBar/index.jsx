import { StyleSheet, View } from 'react-native'
import { colors, spacing } from '../../tokens'
import { TabBarItem } from '../TabBarItem'

const TABS = [
  {
    id: 'today',
    label: 'Today',
    iconName: 'today',
  },
  {
    id: 'diary',
    label: 'Diary',
    iconName: 'diary',
  },
  {
    id: 'profile',
    label: 'Profile',
    iconName: 'profile',
  },
]

function TabBar({ activeTab, onTabPress, style }) {
  return (
    <View style={[styles.container, style]}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.tabBar,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.tabBarTop,
    paddingBottom: spacing.tabBarBottom,
    paddingHorizontal: spacing.screenHorizontal,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
})

export { TabBar, TABS }
export default TabBar
