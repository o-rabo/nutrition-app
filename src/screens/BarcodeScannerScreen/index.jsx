import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { colors, typography, spacing, Icon } from '../../design-system'

function BarcodeScannerScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon
            name="chevronLeft"
            size={22}
            color={colors.accent.icon}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.center}>
        <Text style={styles.message}>
          Scanner coming soon
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  headerSafe: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing[1],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})

export { BarcodeScannerScreen }
export default BarcodeScannerScreen
