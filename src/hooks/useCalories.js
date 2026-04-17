import { useMemo } from 'react';

// Hook scaffold for calorie and macro progress calculations.
export function useCalories(dayMeals) {
  const totals = useMemo(() => {
    if (!dayMeals) {
      return {
        consumed: 0,
        goal: 0,
        remaining: 0,
      };
    }

    const consumed = dayMeals.meals.reduce((sum, meal) => sum + meal.calories, 0);
    const goal = dayMeals.dailyGoalKcal;

    return {
      consumed,
      goal,
      remaining: Math.max(goal - consumed, 0),
    };
  }, [dayMeals]);

  return totals;
}

export default useCalories;
