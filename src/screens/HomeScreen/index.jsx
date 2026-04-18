import {
  View,
  Text,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, typography, spacing }
  from '../../design-system/tokens'
import { MacroCard, MealsList }
  from '../../design-system/components'
import { useNutrition } from '../../context/NutritionContext'

function HomeScreen() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const {
    meals,
    getTotalCalories,
    getMealCalories,
    getMealSubtitle,
    getTotalMacros,
  } = useNutrition()

  const macrosTotals = getTotalMacros()
  const macros = {
    protein: {
      value: `${Math.round(macrosTotals.protein)}g`,
      progress: Math.min(
        Math.round((macrosTotals.protein / 150) * 100),
        100,
      ),
    },
    carbs: {
      value: `${Math.round(macrosTotals.carbs)}g`,
      progress: Math.min(
        Math.round((macrosTotals.carbs / 300) * 100),
        100,
      ),
    },
    fat: {
      value: `${Math.round(macrosTotals.fat)}g`,
      progress: Math.min(
        Math.round((macrosTotals.fat / 65) * 100),
        100,
      ),
    },
  }

  const mealRows = [
    'breakfast', 'lunch', 'dinner', 'snacks',
  ].map((key) => ({
    id: key,
    label: meals[key].label,
    subtitle: getMealSubtitle(key),
    iconName: meals[key].iconName,
    calories: getMealCalories(key) || undefined,
  }))

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'Europe/Berlin',
    })
  }

  const getGreeting = () => {
    const hour = new Date().toLocaleString(
      'en-GB',
      {
        hour: 'numeric',
        hour12: false,
        timeZone: 'Europe/Berlin',
      },
    )
    const h = parseInt(hour, 10)
    if (h >= 5 && h < 12) return 'Good morning'
    if (h >= 12 && h < 17) return 'Good afternoon'
    if (h >= 17 && h < 22) return 'Good evening'
    return 'Good night'
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.app }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.screenHorizontal,
          paddingTop: insets.top + spacing.sectionGap,
          paddingBottom: spacing[4],
          gap: spacing.sectionGap,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: typography.fontSize.caption,
                fontWeight: String(typography.fontWeight.regular),
                color: colors.text.secondary,
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {getFormattedDate()}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={{
                marginTop: 2,
                fontSize: typography.fontSize.h2,
                fontWeight: String(typography.fontWeight.medium),
                color: colors.text.primary,
                lineHeight: typography.fontSize.h2 * typography.lineHeight.snug,
              }}
            >
              {`${getGreeting()}, Olga`}
            </Text>
          </View>
        </View>
        <>
          <MacroCard
            consumed={getTotalCalories()}
            goal={2950}
            macros={macros}
          />
          <MealsList
            meals={mealRows}
            onMealPress={(id) => navigation.navigate(
              'Meal',
              { mealType: id },
            )}
          />
        </>
      </ScrollView>
    </View>
  )
}

export { HomeScreen }
export default HomeScreen
