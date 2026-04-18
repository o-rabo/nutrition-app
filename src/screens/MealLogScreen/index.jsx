import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
} from '../../design-system'

function MealLogScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const mealType = route.params?.mealType

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])

  const mealLabelLower =
    typeof mealType === 'string' ? mealType.toLowerCase() : ''

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView
          edges={['top']}
          style={styles.headerSafe}
        >
          <View style={styles.backRow}>
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
          </View>

          <Text style={styles.title}>
            {`Log your ${mealLabelLower}`}
          </Text>

          <Text style={styles.subtitle}>
            Search manually or scan the barcode on the food packaging
          </Text>

          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={18}
              color={colors.accent.icon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                `What did you eat for ${mealLabelLower}?`
              }
              placeholderTextColor={colors.text.ghost}
              returnKeyType="search"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BarcodeScanner', {
                  mealType,
                })
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Scan barcode"
            >
              <Icon
                name="barcode"
                size={22}
                color={colors.accent.icon}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.resultsArea}>
          {results.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Nothing to show yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(_, index) => `result-${index}`}
              renderItem={() => <View />}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  flex: {
    flex: 1,
  },
  headerSafe: {
    backgroundColor: colors.background.app,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing[1],
    paddingBottom: spacing[2],
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1.5],
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    marginBottom: spacing.half,
  },
  subtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1.5],
    gap: spacing[1],
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  resultsArea: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.background.app,
  },
  emptyWrap: {
    marginTop: spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacing[2],
  },
})

export { MealLogScreen }
export default MealLogScreen
