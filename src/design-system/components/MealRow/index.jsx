import { useState } from 'react'
import { colors, typography, spacing, borderRadius } from '../../index'
import { Icon } from '../Icon'

function MealRow({ label, subtitle, calories, iconName, onPress, style }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const hasCalories = typeof calories === 'number'

  return (
    <button
      type="button"
      onClick={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        background: colors.background.card,
        border: `0.5px solid ${colors.border.subtle}`,
        borderRadius: borderRadius['2xl'],
        padding: spacing[2],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
        boxSizing: 'border-box',
        opacity: isHovered ? 0.75 : 1,
        transform: isPressed ? 'scale(0.98)' : 'none',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.iconGap,
        }}
      >
        <div
          style={{
            width: spacing[5],
            height: spacing[5],
            background: colors.background.iconWell ?? colors.background.cardDeep,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon
            name={iconName}
            size={18}
            color={colors.accent.icon ?? colors.accent.default}
          />
        </div>
        <div style={{ textAlign: 'left' }}>
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.sans,
              fontWeight: typography.fontWeight.medium,
              color: colors.text.primary,
              lineHeight: typography.lineHeight.snug,
            }}
          >
            {label}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: typography.fontSize.bodySmall,
              fontFamily: typography.fontFamily.sans,
              fontWeight: typography.fontWeight.regular,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {hasCalories ? (
          <>
            <p
              style={{
                margin: 0,
                fontSize: typography.fontSize.base,
                fontFamily: typography.fontFamily.sans,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.accent,
              }}
            >
              {calories.toLocaleString()}
            </p>
            <p
              style={{
                margin: '1px 0 0',
                fontSize: typography.fontSize.micro,
                fontFamily: typography.fontFamily.sans,
                fontWeight: typography.fontWeight.regular,
                color: colors.text.muted,
              }}
            >
              kcal
            </p>
          </>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.sans,
              fontWeight: typography.fontWeight.regular,
              color: colors.text.ghost ?? colors.text.muted,
            }}
          >
            + add
          </p>
        )}
      </div>
    </button>
  )
}

export { MealRow }
export default MealRow
