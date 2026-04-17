import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors, typography } from '../../tokens'

function CalorieRing({
  consumed,
  goal,
  size = 172,
  strokeWidth = 10,
  style,
}) {
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0
  const fillOffset = circumference - circumference * progress
  const cx = size / 2
  const cy = size / 2

  return (
    <View style={[{ width: size, height: size, position: 'relative' }, style]}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ rotate: '-90deg' }],
        }}
      >
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors.ring.track}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors.ring.fill}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={fillOffset}
          />
        </Svg>
      </View>
      <View style={styles.center}>
        <Text
          style={{
            lineHeight: typography.fontSize.display * typography.lineHeight.tight,
            fontSize: typography.fontSize.display,
            fontWeight: '500',
            color: colors.text.primary,
            textAlign: 'center',
          }}
        >
          {consumed.toLocaleString()}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontSize: typography.fontSize.caption,
            fontWeight: '400',
            color: colors.text.secondary,
            textAlign: 'center',
          }}
        >
          {`of ${goal.toLocaleString()} kcal`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export { CalorieRing }
export default CalorieRing
