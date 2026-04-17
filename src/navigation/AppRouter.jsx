import { Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from '../screens/Home';
import MealLogScreen from '../screens/MealLog';
import SuccessScreen from '../screens/Success';

// Centralized route map for the app.
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/meal-log" element={<MealLogScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
    </Routes>
  );
}
