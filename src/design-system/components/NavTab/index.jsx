import {
  TouchableOpacity,
  Text,
} from 'react-native'
import {
  colors,
  typography,
  textStyles,
  spacing,
} from '../../tokens'
import { Icon } from '../Icon'

const borderBottomWidthActive = (3 * spacing.px) / 2

export function NavTab({
  label,
  active = false,
  onPress,
  style,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: spacing[2],
          paddingBottom: spacing[2],
          gap: spacing[1],
          borderBottomWidth: active ? borderBottomWidthActive : 0,
          borderBottomColor: active
            ? colors.border.strong
            : 'transparent',
        },
        style,
      ]}
    >
      <Text
        style={{
          ...textStyles.label,
          fontWeight: typography.fontWeight.regular,
          color: active
            ? colors.text.primary
            : colors.text.muted,
        }}
      >
        {label}
      </Text>

      {active && (
        <Icon
          name="calendar"
          size={typography.fontSize.base}
          color={colors.text.primary}
        />
      )}
    </TouchableOpacity>
  )
}

export default NavTab
