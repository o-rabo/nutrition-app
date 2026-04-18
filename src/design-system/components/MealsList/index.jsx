import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, typography, spacing } from '../../tokens'
import { MealRow } from '../MealRow'

function MealsList({ meals, onMealPress, style }) {
  const navigation = useNavigation()

  const handleMealPress = (id) => {
    if (onMealPress) {
      onMealPress(id)
      return
    }
    const meal = meals.find((m) => m.id === id)
    if (meal?.label) {
      navigation.navigate('Search', {
        mealType: meal.label.toLowerCase(),
      })
    }
  }

  return (
    <View
      style={[
        {
          gap: spacing[0],
        },
        style,
      ]}
    >
      <Text
        style={{
          marginBottom: 12,
          fontSize: typography.fontSize.caption,
          fontWeight: String(typography.fontWeight.regular),
          color: colors.text.muted,
          letterSpacing: typography.letterSpacing.widest,
          textTransform: 'uppercase',
        }}
      >
        Meals
      </Text>
      <View style={{ gap: spacing.componentGap }}>
        {meals.map((meal) => (
          <MealRow
            key={meal.id}
            label={meal.label}
            subtitle={meal.subtitle}
            iconName={meal.iconName}
            calories={meal.calories}
            onPress={() => handleMealPress(meal.id)}
          />
        ))}
      </View>
    </View>
  )
}

export { MealsList }
export default MealsList
