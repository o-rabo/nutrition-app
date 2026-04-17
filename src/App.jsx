import { MealRow } from './design-system';

// Temporary visual test for MealRow layout and states.
export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: '#0d2b17',
      }}
    >
      <MealRow
        label="Breakfast"
        subtitle="Oats, banana, coffee"
        calories={542}
        iconName="breakfast"
      />
      <MealRow
        label="Lunch"
        subtitle="Chicken rice bowl"
        calories={1089}
        iconName="lunch"
      />
      <MealRow
        label="Dinner"
        subtitle="Not logged yet"
        iconName="dinner"
      />
      <MealRow
        label="Snacks"
        subtitle="Apple, almonds"
        calories={100}
        iconName="snacks"
      />
    </div>
  );
}
