import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, typography, spacing } from '../../design-system'

export function DiaryScreen() {
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: colors.background.app,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.h2,
            fontWeight: String(typography.fontWeight.medium),
            color: colors.text.primary,
            marginBottom: 8,
          }}
        >
          Diary
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.bodySmall,
            color: colors.text.muted,
            textAlign: 'center',
            marginHorizontal: spacing.screenHorizontal,
          }}
        >
          Your meal history will appear here. Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default DiaryScreen
