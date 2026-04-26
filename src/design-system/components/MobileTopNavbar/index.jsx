import { View, Text, TouchableOpacity } from 'react-native'
import { colors, typography, spacing } from '../../tokens'
import { Icon } from '../Icon'

const ICON_ZONE_WIDTH = 40

function MobileTopNavbar({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.screenHorizontal,
          paddingVertical: spacing[2],
          backgroundColor: colors.background.app,
        },
        style,
      ]}
    >
      <View style={{ width: ICON_ZONE_WIDTH }}>
        {leftIcon && onLeftPress ? (
          <TouchableOpacity
            onPress={onLeftPress}
            hitSlop={{
              top: spacing[1],
              bottom: spacing[1],
              left: spacing[1],
              right: spacing[1],
            }}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Icon
              name={leftIcon}
              size={22}
              color={colors.accent.icon}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          width: ICON_ZONE_WIDTH,
          alignItems: 'flex-end',
        }}
      >
        {rightIcon && onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            hitSlop={{
              top: spacing[1],
              bottom: spacing[1],
              left: spacing[1],
              right: spacing[1],
            }}
            accessibilityRole="button"
            accessibilityLabel="Action"
          >
            <Icon
              name={rightIcon}
              size={22}
              color={colors.accent.icon}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  )
}

export { MobileTopNavbar }
export default MobileTopNavbar
