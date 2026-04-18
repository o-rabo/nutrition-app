import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
  TabBar,
  BarcodeScanner,
  SearchResultCard,
} from '../../design-system'

function buildProductFromOff(p) {
  const n = p.nutriments || {}

  const energyKcal =
    n['energy-kcal_100g']
    ?? (typeof n['energy_100g'] === 'number' && n['energy_100g'] > 0
      ? n['energy_100g'] / 4.184
      : 0)

  const vitamins = {
    b1: Number((n['vitamin-b1_100g'] || 0).toFixed(2)),
    b2: Number((n['vitamin-b2_100g'] || 0).toFixed(2)),
    b3: Number((n['vitamin-pp_100g'] || 0).toFixed(2)),
    iron: Number((n['iron_100g'] || 0).toFixed(2)),
    calcium: Number((n['calcium_100g'] || 0).toFixed(0)),
    potassium: Number((n['potassium_100g'] || 0).toFixed(0)),
    magnesium: Number((n['magnesium_100g'] || 0).toFixed(0)),
  }

  const hasVitamins = Object.values(vitamins).some((v) => v > 0)

  return {
    name:
      p.product_name
      || p.product_name_en
      || p.product_name_de
      || 'Unknown product',
    brand: p.brands || '',
    portion: p.quantity || '100g',
    calories: Math.round(energyKcal || 0),
    protein: Number((n['proteins_100g'] || 0).toFixed(1)),
    carbs: Number((n['carbohydrates_100g'] || 0).toFixed(1)),
    fat: Number((n['fat_100g'] || 0).toFixed(1)),
    saturates: Number((n['saturated-fat_100g'] || 0).toFixed(1)),
    unsaturates: Number((n['unsaturated-fat_100g'] || 0).toFixed(1)),
    sugars: Number((n['sugars_100g'] || 0).toFixed(1)),
    starch: Number((n['starch_100g'] || 0).toFixed(1)),
    fibre: Number(
      (n['fiber_100g'] ?? n['fibre_100g'] ?? 0).toFixed(1),
    ),
    salt: Number((n['salt_100g'] || 0).toFixed(1)),
    sodium: Number((n['sodium_100g'] || 0).toFixed(1)),
    energy_kj: Math.round(n['energy_100g'] || 0),
    vitamins: hasVitamins ? vitamins : null,
    tag: 'Food',
  }
}

function SearchScreen({ navigation: navigationProp, route: routeProp }) {
  const navHook = useNavigation()
  const routeHook = useRoute()
  const navigation = navigationProp ?? navHook
  const route = routeProp ?? routeHook

  const mealType = route?.params?.mealType || 'meal'
  const mealTypeStr =
    mealType.charAt(0).toUpperCase() + mealType.slice(1)

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [scannerVisible, setScannerVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
      bottomOffset: 80,
    })
  }

  const handleBarcodeScan = async (barcode) => {
    setScannerVisible(false)
    setSearchQuery(barcode)
    setLoading(true)

    try {
      const cleanBarcode = barcode.trim()

      console.log('Scanned barcode:', barcode)

      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}?fields=product_name,brands,quantity,nutriments,categories_tags`,
        {
          headers: {
            'User-Agent': 'NutritionApp/1.0',
          },
        },
      )

      const data = await response.json()

      console.log('API response status:', data.status)
      console.log('Product data:', data.product)

      if (data.status === 1 && data.product) {
        const p = data.product
        setResults([buildProductFromOff(p)])
      } else {
        console.log('Product not found:', data)
        setResults([])
      }
    } catch (e) {
      console.error('OpenFoodFacts error:', e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const showInitialEmpty =
    !loading
    && searchQuery.trim() === ''
    && results.length === 0

  const showNotFound =
    !loading
    && searchQuery.trim() !== ''
    && results.length === 0

  const showResults = !loading && results.length > 0

  let resultsBody = null
  if (loading) {
    resultsBody = (
      <View style={styles.loadingWrap}>
        <ActivityIndicator
          size="large"
          color={colors.accent.ring}
        />
      </View>
    )
  } else if (showInitialEmpty) {
    resultsBody = (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>
          Nothing to show yet.
        </Text>
      </View>
    )
  } else if (showResults) {
    resultsBody = (
      <FlatList
        style={styles.resultList}
        data={results}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) =>
          `${item.name}-${item.brand}-${index}`
        }
        renderItem={({ item }) => (
          <SearchResultCard
            name={item.name}
            brand={item.brand}
            portion={item.portion}
            calories={item.calories}
            tag={item.tag}
            onCardPress={() => {
              navigation.navigate('MealDetail', {
                mealType,
                product: item,
              })
            }}
            onAddPress={() => {
              showToast(`${item.name} added to ${mealTypeStr}`)
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    )
  } else if (showNotFound) {
    resultsBody = (
      <Text style={styles.notFoundText}>
        No product found for this barcode.
        {'\n'}
        Try scanning again or enter manually.
      </Text>
    )
  }

  return (
    <View style={styles.outer}>
      <SafeAreaView
        edges={['top']}
        style={styles.safe}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>
            {`Log your ${mealTypeStr}`}
          </Text>
          <Text style={styles.subtitle}>
            Search manually or scan the barcode on the food packaging
          </Text>
        </View>

        <View style={styles.searchRow}>
          <Icon
            name="search"
            size={18}
            color={colors.text.secondary}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`What did you eat for ${mealType}?`}
            placeholderTextColor={colors.text.ghost}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={() => setScannerVisible(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open barcode scanner"
          >
            <Icon
              name="barcode"
              size={22}
              color={colors.accent.icon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.resultsArea}>
          {resultsBody}
        </View>

        <TabBar
          activeTab="home"
          onTabPress={(id) => {
            if (id === 'home') {
              navigation.navigate('Home')
            }
          }}
        />
      </SafeAreaView>

      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={(barcode) => handleBarcodeScan(barcode)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  headerBlock: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.medium,
    borderRadius: borderRadius['3xl'],
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[2],
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing[2],
    gap: spacing[1],
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing[1],
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  resultsArea: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: colors.background.app,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[4],
  },
  resultList: {
    flex: 1,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.muted,
    textAlign: 'center',
  },
  notFoundText: {
    marginTop: spacing[4],
    marginHorizontal: spacing.screenHorizontal,
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.muted,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: spacing[2],
  },
})

export { SearchScreen }
export default SearchScreen
