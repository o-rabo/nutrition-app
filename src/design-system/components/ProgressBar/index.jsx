import { colors, spacing, borderRadius } from '../../index'

function ProgressBar({
  value,
  height = spacing.half,
  trackColor = colors.ring?.track ?? colors.border.subtle,
  fillColor = colors.ring?.fill ?? colors.accent.default,
  borderRadius: radius = borderRadius.subtle,
}) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div
      style={{
        width: '100%',
        background: trackColor,
        height,
        borderRadius: radius,
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          background: fillColor,
          height: '100%',
          borderRadius: radius,
        }}
      />
    </div>
  )
}

export { ProgressBar }
export default ProgressBar
