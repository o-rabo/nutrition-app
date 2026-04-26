import { View, Text, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import {
  HomeScreen,
  DiaryScreen,
  ProfileScreen,
  MealScreen,
  SearchScreen,
  MealDetailScreen,
  BarcodeScannerScreen,
  MealLogScreen,
} from './src/screens'
import { NutritionProvider, useNutrition } from './src/context/NutritionContext'
import { Icon } from './src/design-system'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

/** Web / deep-link paths (see https://reactnavigation.org/docs/configuring-links) */
const linking = {
  prefixes: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Today: '',
          Diary: 'diary',
          Profile: 'profile',
        },
      },
      Meal: 'meal',
      Search: 'search',
      MealDetail: 'meal-detail',
      BarcodeScanner: 'barcode',
      MealLog: 'meal-log',
    },
  },
}

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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a2010',
          borderTopWidth: 0.5,
          borderTopColor: '#1e4d2b',
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        tabBarActiveTintColor: '#6acc7e',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        animation: 'none',
      }}
    >
      <Tab.Screen
        name="Today"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="today"
              size={24}
              color={color}
              solid={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="diary"
              size={24}
              color={color}
              solid={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="profile"
              size={24}
              color={color}
              solid={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { isLoaded } = useNutrition()

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0d2b17',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#5bb56e"
        />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
        />
        <Stack.Screen name="Meal" component={MealScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MealDetail" component={MealDetailScreen} />
        <Stack.Screen
          name="BarcodeScanner"
          component={BarcodeScannerScreen}
        />
        <Stack.Screen name="MealLog" component={MealLogScreen} />
      </Stack.Navigator>
    </>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NutritionProvider>
          <NavigationContainer linking={linking}>
            <AppNavigator />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </NutritionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
