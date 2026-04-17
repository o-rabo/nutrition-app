import { useState } from 'react'
import { colors, typography, spacing, borderRadius } from '../../index'

function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  fullWidth = true,
  style,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const interactive = colors.interactive

  const opacity = disabled ? 0.5 : isHovered ? 0.8 : 1

  const primaryStyles = {
    background: interactive.primaryBg ?? interactive.primary,
    color: interactive.primaryLabel,
    border: 'none',
    borderRadius: borderRadius.full,
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium,
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity,
    transform: isPressed && !disabled ? 'scale(0.98)' : 'none',
  }

  const ghostStyles = {
    background: interactive.ghostBg ?? interactive.ghost,
    color: interactive.ghostLabel,
    border: `0.5px solid ${interactive.ghostBorder}`,
    borderRadius: borderRadius.full,
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium,
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity,
    transform: isPressed && !disabled ? 'scale(0.98)' : 'none',
  }

  const variantStyles = variant === 'ghost' ? ghostStyles : primaryStyles

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{ ...variantStyles, ...style }}
    >
      {label}
    </button>
  )
}

export { Button }
export default Button
