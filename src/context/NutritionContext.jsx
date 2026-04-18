import { createContext, useContext, useState } from 'react'

const initialMeals = {
  breakfast: {
    label: 'Breakfast',
    items: [],
    iconName: 'breakfast',
  },
  lunch: {
    label: 'Lunch',
    items: [],
    iconName: 'lunch',
  },
  dinner: {
    label: 'Dinner',
    items: [],
    iconName: 'dinner',
  },
  snacks: {
    label: 'Snacks',
    items: [],
    iconName: 'snacks',
  },
}

export const NutritionContext = createContext(null)

export function NutritionProvider({ children }) {
  const [meals, setMeals] = useState(initialMeals)

  const addItemToMeal = (mealType, item) => {
    const key = mealType.toLowerCase()
    setMeals((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        items: [
          ...prev[key].items,
          {
            ...item,
            loggedAt: new Date().toISOString(),
          },
        ],
      },
    }))
  }

  const getTotalCalories = () => {
    return Object.values(meals).reduce((total, meal) => {
      return total + meal.items.reduce(
        (sum, item) => sum + item.kcal,
        0,
      )
    }, 0)
  }

  const getMealCalories = (mealType) => {
    const key = mealType.toLowerCase()
    return meals[key]?.items.reduce(
      (sum, item) => sum + item.kcal,
      0,
    ) || 0
  }

  const getMealSubtitle = (mealType) => {
    const key = mealType.toLowerCase()
    const items = meals[key]?.items || []
    if (items.length === 0) return 'Not logged yet'
    if (items.length === 1) return items[0].name
    return `${items[0].name} + ${items.length - 1} more`
  }

  const getTotalMacros = () => {
    return Object.values(meals).reduce((totals, meal) => {
      meal.items.forEach((item) => {
        totals.protein += item.protein
        totals.carbs += item.carbs
        totals.fat += item.fat
      })
      return totals
    }, { protein: 0, carbs: 0, fat: 0 })
  }

  return (
    <NutritionContext.Provider
      value={{
        meals,
        addItemToMeal,
        getTotalCalories,
        getMealCalories,
        getMealSubtitle,
        getTotalMacros,
      }}
    >
      {children}
    </NutritionContext.Provider>
  )
}

export function useNutrition() {
  const context = useContext(NutritionContext)
  if (!context) {
    throw new Error(
      'useNutrition must be used within NutritionProvider',
    )
  }
  return context
}
