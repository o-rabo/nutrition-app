import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, borderRadius } from '../../tokens'
import { ProgressBar } from '../ProgressBar'

function MacroTile({ label, value, progress, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.background.cardDeep,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border.subtle,
          borderRadius: borderRadius.lg,
          paddingVertical: spacing[1.5],
          paddingHorizontal: spacing[2],
          alignItems: 'center',
          gap: spacing[1],
          flex: 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: typography.fontSize.micro,
          fontWeight: String(typography.fontWeight.regular),
          color: colors.text.secondary,
          letterSpacing: typography.letterSpacing.wider,
          textTransform: 'none',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: typography.fontSize.label,
          fontWeight: String(typography.fontWeight.medium),
          color: colors.text.accent,
          lineHeight: typography.fontSize.label * typography.lineHeight.tight,
          textAlign: 'center',
        }}
      >
        {value}
      </Text>
      <ProgressBar
        value={progress}
        height={spacing.half}
        trackColor={colors.ring.track}
        fillColor={colors.accent.bar}
      />
    </View>
  )
}

export { MacroTile }
export default MacroTile
