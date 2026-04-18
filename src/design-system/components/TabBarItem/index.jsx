import { useState } from 'react'
import { Pressable, Text } from 'react-native'
import { colors, typography, spacing } from '../../tokens'
import { Icon } from '../Icon'

function TabBarItem({
  label,
  iconName,
  active = false,
  onPress,
  style,
}) {
  const [pressed, setPressed] = useState(false)

  const opacity = active ? 1 : pressed ? 0.6 : 0.4

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[1],
          gap: spacing.half,
          opacity,
        },
        style,
      ]}
    >
      <Icon
        name={iconName}
        size={24}
        color={active
          ? colors.accent.activeTab
          : colors.text.secondary}
        solid={active}
      />
      <Text
        style={{
          fontSize: typography.fontSize.micro,
          fontWeight: String(
            active
              ? typography.fontWeight.medium
              : typography.fontWeight.regular,
          ),
          color: active ? colors.accent.activeTab : colors.text.secondary,
          lineHeight: typography.fontSize.micro * typography.lineHeight.tight,
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export { TabBarItem }
export default TabBarItem
