import { View } from 'react-native'
import { colors, spacing, borderRadius } from '../../tokens'

function ProgressBar({
  value,
  height: heightProp,
  trackColor = colors.ring.track,
  fillColor = colors.ring.fill,
  borderRadius: radiusProp = borderRadius.subtle,
}) {
  const safeValue = Math.max(0, Math.min(100, value))
  const height = heightProp != null ? heightProp : spacing.half
  const radius = radiusProp

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: trackColor,
        height,
        borderRadius: radius,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${safeValue}%`,
          backgroundColor: fillColor,
          height: '100%',
          borderRadius: radius,
        }}
      />
    </View>
  )
}

export { ProgressBar }
export default ProgressBar
