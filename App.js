import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from './src/design-system/tokens'
import HomeScreen from './src/screens/HomeScreen'

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background.app }}>
        <StatusBar style="light" />
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  )
}
