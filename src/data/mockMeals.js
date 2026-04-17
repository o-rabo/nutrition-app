// Mock daily meal snapshot for local development.
export const mockMeals = {
  date: 'default-day',
  dailyGoalKcal: 2950,
  meals: [
    {
      name: 'Breakfast',
      calories: 542,
      logged: true,
      items: ['oats', 'banana', 'coffee'],
    },
    {
      name: 'Lunch',
      calories: 1089,
      logged: true,
      items: ['chicken rice bowl'],
    },
    {
      name: 'Dinner',
      calories: 0,
      logged: false,
      items: [],
    },
    {
      name: 'Snacks',
      calories: 100,
      logged: true,
      items: ['apple', 'almonds'],
    },
  ],
  macros: {
    protein: { current: 124, goal: 295, unit: 'g' },
    carbs: { current: 287, goal: 300, unit: 'g' },
    fat: { current: 78, goal: 120, unit: 'g' },
  },
};

export default mockMeals;
