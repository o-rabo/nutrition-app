import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useNutrition } from '../../context/NutritionContext'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
  Button,
} from '../../design-system'

const HEADER_BTN = 40

function MealScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const mealType = route.params?.mealType || 'meal'
  const mealLabel =
    mealType.charAt(0).toUpperCase() + mealType.slice(1)

  const { meals, getMealCalories } = useNutrition()
  const mealData = meals[mealType.toLowerCase()]
  const items = mealData?.items || []
  const totalKcal = getMealCalories(mealType)

  const totalProtein = items
    .reduce((s, i) => s + i.protein, 0)
    .toFixed(1)
  const totalCarbs = items
    .reduce((s, i) => s + i.carbs, 0)
    .toFixed(1)
  const totalFat = items
    .reduce((s, i) => s + i.fat, 0)
    .toFixed(1)

  const goSearch = () => {
    navigation.navigate('Search', { mealType })
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity
            style={styles.headerBtn}
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
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          {mealLabel}
        </Text>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <TouchableOpacity
            style={styles.headerBtnAdd}
            onPress={goSearch}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Add food"
          >
            <Icon name="plus" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Total logged</Text>
          <Text style={styles.summaryKcal}>
            {`${totalKcal} kcal`}
          </Text>
        </View>
        <View style={styles.summaryMacros}>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>
              {totalProtein}
              g
            </Text>
          </View>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>
              {totalCarbs}
              g
            </Text>
          </View>
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>
              {totalFat}
              g
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          items.length === 0 && styles.scrollContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyBlock}>
            <View style={styles.emptyCircle}>
              <Icon
                name="plus"
                size={28}
                color={colors.text.muted}
              />
            </View>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptySub}>
              {`Tap + to add food to your ${mealLabel}`}
            </Text>
            <Button
              label={`Add food to ${mealLabel}`}
              onPress={goSearch}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          items.map((item, index) => {
            const logged = new Date(item.loggedAt)
            const timeStr = logged.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const p = Number(item.protein).toFixed(1)
            const c = Number(item.carbs).toFixed(1)
            const f = Number(item.fat).toFixed(1)
            return (
              <View
                key={`${item.loggedAt}-${index}`}
                style={styles.itemCard}
              >
                <View style={styles.itemTop}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemKcal}>
                    {item.kcal}
                    {' '}
                    kcal
                  </Text>
                </View>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {`${item.brand} · ${item.grams}g`}
                  </Text>
                  <Text style={styles.itemMacrosTiny}>
                    {`P: ${p}g  C: ${c}g  F: ${f}g`}
                  </Text>
                </View>
                <Text style={styles.itemLogged}>
                  {`Logged at ${timeStr}`}
                </Text>
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  headerSide: {
    width: HEADER_BTN,
    alignItems: 'flex-start',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerBtn: {
    width: HEADER_BTN,
    height: HEADER_BTN,
    borderRadius: HEADER_BTN / 2,
    backgroundColor: colors.background.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnAdd: {
    width: HEADER_BTN,
    height: HEADER_BTN,
    borderRadius: HEADER_BTN / 2,
    backgroundColor: colors.accent.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.h3,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: colors.background.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing[2],
    padding: spacing[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryKcal: {
    marginTop: 4,
    fontSize: typography.fontSize.h2,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  summaryMacros: {
    gap: 4,
    minWidth: 112,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
  },
  macroValue: {
    fontSize: typography.fontSize.caption,
    color: colors.text.accent,
    fontWeight: String(typography.fontWeight.medium),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[3],
  },
  scrollContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: spacing[1.5],
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    textAlign: 'center',
  },
  emptySub: {
    marginTop: spacing[1],
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.ghost,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: spacing[2],
    alignSelf: 'stretch',
  },
  itemCard: {
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    marginBottom: spacing[1.5],
    marginHorizontal: spacing.screenHorizontal,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  itemName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  itemKcal: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.accent,
  },
  itemBottom: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  itemMeta: {
    flex: 1,
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
  },
  itemMacrosTiny: {
    fontSize: typography.fontSize.micro,
    color: colors.text.muted,
    textAlign: 'right',
  },
  itemLogged: {
    marginTop: 6,
    fontSize: typography.fontSize.micro,
    color: colors.text.ghost,
  },
})

export { MealScreen }
export default MealScreen
