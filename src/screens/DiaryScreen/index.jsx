import { useState, useCallback } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { colors, typography, spacing, TabBar } from '../../design-system'

export function DiaryScreen() {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState('diary')

  useFocusEffect(
    useCallback(() => {
      setActiveTab('diary')
    }, []),
  )

  const handleTabPress = (tabId) => {
    if (tabId === 'today') navigation.navigate('Home')
    if (tabId === 'diary') navigation.navigate('Diary')
    if (tabId === 'profile') navigation.navigate('Profile')
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: colors.background.app,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: typography.fontSize.h2,
            fontWeight: String(typography.fontWeight.medium),
            color: colors.text.primary,
            marginBottom: 8,
          }}
        >
          Diary
        </Text>
        <Text
          style={{
            fontSize: typography.fontSize.bodySmall,
            color: colors.text.muted,
            textAlign: 'center',
            marginHorizontal: spacing.screenHorizontal,
          }}
        >
          Your meal history will appear here. Coming soon.
        </Text>
      </View>
      <TabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  )
}

export default DiaryScreen
