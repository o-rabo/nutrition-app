import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native'
import { colors, typography, spacing, borderRadius }
  from '../../design-system/tokens'
import { MacroCard, MealsList, TabBar, Icon }
  from '../../design-system/components'

const MOCK_DATA = {
  user: {
    name: 'Olga',
    date: 'Friday, 17 April',
  },
  calories: {
    consumed: 2340,
    goal:     2950,
  },
  macros: {
    protein: { value: '124g', progress: 42 },
    carbs:   { value: '287g', progress: 95 },
    fat:     { value: '78g',  progress: 65 },
  },
  meals: [
    {
      id:       'breakfast',
      label:    'Breakfast',
      subtitle: 'Oats, banana, coffee',
      iconName: 'breakfast',
      calories: 542,
    },
    {
      id:       'lunch',
      label:    'Lunch',
      subtitle: 'Chicken rice bowl',
      iconName: 'lunch',
      calories: 1089,
    },
    {
      id:       'dinner',
      label:    'Dinner',
      subtitle: 'Not logged yet',
      iconName: 'dinner',
      calories: undefined,
    },
    {
      id:       'snacks',
      label:    'Snacks',
      subtitle: 'Apple, almonds',
      iconName: 'snacks',
      calories: 100,
    },
  ],
}

function HomeScreen() {
  const [activeTab, setActiveTab] = useState('today')

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.app }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.screenHorizontal,
          paddingBottom: spacing[4],
          gap: spacing.sectionGap,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              style={{
                fontSize: typography.fontSize.caption,
                fontWeight: String(typography.fontWeight.regular),
                color: colors.text.secondary,
                letterSpacing: typography.letterSpacing.wide,
              }}
            >
              {MOCK_DATA.user.date}
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontSize: typography.fontSize.h2,
                fontWeight: String(typography.fontWeight.medium),
                color: colors.text.primary,
                lineHeight: typography.fontSize.h2 * typography.lineHeight.snug,
              }}
            >
              {`Good morning,\n${MOCK_DATA.user.name}`}
            </Text>
          </View>
          <Pressable
            style={{
              width: spacing[5],
              height: spacing[5],
              borderRadius: borderRadius.circle,
              backgroundColor: colors.background.iconWell,
              borderWidth: 1.5,
              borderColor: colors.border.strong,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="profile"
              size={18}
              color={colors.accent.icon}
            />
          </Pressable>
        </View>
        {activeTab === 'today' ? (
          <>
            <MacroCard
              consumed={MOCK_DATA.calories.consumed}
              goal={MOCK_DATA.calories.goal}
              macros={MOCK_DATA.macros}
            />
            <MealsList
              meals={MOCK_DATA.meals}
              onMealPress={(id) => console.log('Navigate to meal:', id)}
            />
          </>
        ) : (
          <Text
            style={{
              paddingVertical: spacing[4],
              fontSize: typography.fontSize.bodySmall,
              fontWeight: String(typography.fontWeight.regular),
              color: colors.text.secondary,
              textAlign: 'center',
            }}
          >
            This section is coming soon.
          </Text>
        )}
      </ScrollView>
      <TabBar
        activeTab={activeTab}
        onTabPress={(id) => setActiveTab(id)}
      />
    </View>
  )
}

export { HomeScreen }
export default HomeScreen
