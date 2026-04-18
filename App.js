import 'react-native-gesture-handler'
import { View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import {
  HomeScreen,
  MealLogScreen,
  BarcodeScannerScreen,
  SearchScreen,
  MealDetailScreen,
  MealScreen,
  DiaryScreen,
  ProfileScreen,
} from './src/screens'
import { NutritionProvider } from './src/context/NutritionContext'

const Stack = createNativeStackNavigator()

const toastConfig = {
  success: ({ text1 }) => (
    <View
      style={{
        backgroundColor: '#132b1a',
        borderWidth: 0.5,
        borderColor: '#3b7d4a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#1e4d2b',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#6acc7e',
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          ✓
        </Text>
      </View>
      <Text
        style={{
          color: '#e8f5ea',
          fontSize: 14,
          fontWeight: '500',
          flex: 1,
        }}
      >
        {text1}
      </Text>
    </View>
  ),
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NutritionProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Diary" component={DiaryScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="MealLog" component={MealLogScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Meal" component={MealScreen} />
              <Stack.Screen name="MealDetail" component={MealDetailScreen} />
              <Stack.Screen
                name="BarcodeScanner"
                component={BarcodeScannerScreen}
              />
            </Stack.Navigator>
            <Toast config={toastConfig} />
          </NavigationContainer>
        </NutritionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
