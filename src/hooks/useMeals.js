import { useMemo, useState } from 'react';
import { mockMeals } from '../data/mockMeals';

// Hook scaffold for meal state reads/updates.
export function useMeals() {
  const [dayMeals, setDayMeals] = useState(mockMeals);

  const totalCalories = useMemo(
    () => dayMeals.meals.reduce((sum, meal) => sum + meal.calories, 0),
    [dayMeals]
  );

  return {
    dayMeals,
    totalCalories,
    setDayMeals,
  };
}

export default useMeals;
