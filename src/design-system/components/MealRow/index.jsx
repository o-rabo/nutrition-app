import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, typography, spacing, borderRadius } from '../../tokens'
import { Icon } from '../Icon'

function MealRow({ label, subtitle, calories, iconName, onPress, style }) {
  const [pressed, setPressed] = useState(false)

  const hasCalories = typeof calories === 'number'

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          backgroundColor: colors.background.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border.subtle,
          borderRadius: borderRadius['2xl'],
          padding: spacing[2],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.iconGap,
          flex: 1,
        }}
      >
        <View
          style={{
            width: spacing[5],
            height: spacing[5],
            backgroundColor:
              colors.background.iconWell ?? colors.background.cardDeep,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={iconName}
            size={18}
            color={colors.accent.icon ?? colors.accent.default}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: String(typography.fontWeight.medium),
              color: colors.text.primary,
              lineHeight: typography.fontSize.base * typography.lineHeight.snug,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              marginTop: 2,
              fontSize: typography.fontSize.bodySmall,
              fontWeight: String(typography.fontWeight.regular),
              color: colors.text.secondary,
              lineHeight:
                typography.fontSize.bodySmall * typography.lineHeight.normal,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {hasCalories ? (
          <>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: String(typography.fontWeight.medium),
                color: colors.text.accent,
              }}
            >
              {calories.toLocaleString()}
            </Text>
            <Text
              style={{
                marginTop: 1,
                fontSize: typography.fontSize.micro,
                fontWeight: String(typography.fontWeight.regular),
                color: colors.text.muted,
              }}
            >
              kcal
            </Text>
          </>
        ) : (
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: String(typography.fontWeight.regular),
              color: colors.text.ghost ?? colors.text.muted,
            }}
          >
            + add
          </Text>
        )}
      </View>
    </Pressable>
  )
}

export { MealRow }
export default MealRow
