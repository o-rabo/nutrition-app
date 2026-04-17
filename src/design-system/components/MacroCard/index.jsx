import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, borderRadius } from '../../tokens'
import { CalorieRing } from '../CalorieRing'
import { MacroTile } from '../MacroTile'

function MacroCard({ consumed, goal, macros, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.background.card,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border.subtle,
          borderRadius: borderRadius['3xl'],
          paddingTop: spacing.cardPaddingTop,
          paddingHorizontal: spacing.cardPadding,
          paddingBottom: spacing.cardPadding,
          alignItems: 'center',
          gap: spacing[2.5],
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.caption,
          fontWeight: String(typography.fontWeight.regular),
          color: colors.text.muted,
          letterSpacing: typography.letterSpacing.widest,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {`Today's calories`}
      </Text>
      <CalorieRing
        consumed={consumed}
        goal={goal}
        size={172}
        strokeWidth={10}
      />
      <View
        style={{
          flexDirection: 'row',
          gap: spacing.componentGap,
          width: '100%',
        }}
      >
        <MacroTile
          label="Protein"
          value={macros.protein.value}
          progress={macros.protein.progress}
        />
        <MacroTile
          label="Carbs"
          value={macros.carbs.value}
          progress={macros.carbs.progress}
        />
        <MacroTile
          label="Fat"
          value={macros.fat.value}
          progress={macros.fat.progress}
        />
      </View>
    </View>
  )
}

export { MacroCard }
export default MacroCard
