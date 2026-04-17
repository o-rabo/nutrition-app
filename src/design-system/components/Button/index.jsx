import { useState } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, borderRadius } from '../../tokens'

function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  fullWidth = true,
  style,
}) {
  const [pressed, setPressed] = useState(false)

  const interactive = colors.interactive
  const opacity = disabled ? 0.5 : pressed ? 0.85 : 1

  const primaryStyles = {
    backgroundColor: interactive.primaryBg ?? interactive.primary,
    borderWidth: 0,
    borderRadius: borderRadius.full,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    width: fullWidth ? '100%' : undefined,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity,
    transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
  }

  const ghostStyles = {
    backgroundColor: interactive.ghostBg ?? interactive.ghost,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: interactive.ghostBorder,
    borderRadius: borderRadius.full,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    width: fullWidth ? '100%' : undefined,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity,
    transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
  }

  const variantStyles = variant === 'ghost' ? ghostStyles : primaryStyles
  const textColor =
    variant === 'ghost' ? interactive.ghostLabel : interactive.primaryLabel

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[variantStyles, style]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: String(typography.fontWeight.medium),
          color: textColor,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export { Button }
export default Button
