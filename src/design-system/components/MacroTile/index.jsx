import { colors, typography, spacing, borderRadius } from '../../index'
import { ProgressBar } from '../ProgressBar'

function MacroTile({ label, value, progress, style }) {
  return (
    <div
      style={{
        background: colors.background.cardDeep,
        border: `0.5px solid ${colors.border.subtle}`,
        borderRadius: borderRadius.lg,
        padding: `${spacing[1.5]} ${spacing[2]}`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[1],
        ...style,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: typography.fontSize.micro,
          fontFamily: typography.fontFamily.sans,
          fontWeight: typography.fontWeight.regular,
          color: colors.text.secondary,
          letterSpacing: typography.letterSpacing.wider,
          textTransform: typography.textTransform.none,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: typography.fontSize.label ?? typography.fontSize.caption,
          fontFamily: typography.fontFamily.sans,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.accent,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {value}
      </p>
      <ProgressBar
        value={progress}
        height={spacing.half}
        trackColor={colors.ring?.track ?? colors.border.subtle}
        fillColor={colors.accent?.bar ?? colors.accent.default}
      />
    </div>
  )
}

export { MacroTile }
export default MacroTile
