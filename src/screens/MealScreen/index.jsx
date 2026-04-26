import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useNutrition } from '../../context/NutritionContext'
import {
  BarcodeScanner,
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
} from '../../design-system'

const HEADER_SIDE = 40

function MealScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const mealType = route.params?.mealType || 'meal'
  const mealLabel =
    mealType.charAt(0).toUpperCase() + mealType.slice(1)

  const { meals, getMealCalories } = useNutrition()
  const mealData = meals[mealType.toLowerCase()]
  const items = mealData?.items || []
  const totalKcal = getMealCalories(mealType)

  const [scannerVisible, setScannerVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const totalProtein = Math.round(
    items.reduce((s, i) => s + (Number(i.protein) || 0), 0),
  )
  const totalCarbs = Math.round(
    items.reduce((s, i) => s + (Number(i.carbs) || 0), 0),
  )
  const totalFat = Math.round(
    items.reduce((s, i) => s + (Number(i.fat) || 0), 0),
  )

  const handleBarcodeScan = useCallback(async (barcode) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode.trim()}?fields=product_name,brands,quantity,nutriments`,
        { headers: { 'User-Agent': 'NutritionApp/1.0' } },
      )
      const data = await response.json()

      if (data.status === 1 && data.product) {
        const p = data.product
        const n = p.nutriments || {}

        const product = {
          name:
            p.product_name
            || p.product_name_en
            || p.product_name_de
            || 'Unknown product',
          brand: p.brands || '',
          portion: p.quantity || '100g',
          calories: Math.round(
            n['energy-kcal_100g']
            || (n['energy_100g'] / 4.184)
            || 0,
          ),
          protein: Number((n['proteins_100g'] || 0).toFixed(1)),
          carbs: Number((n['carbohydrates_100g'] || 0).toFixed(1)),
          fat: Number((n['fat_100g'] || 0).toFixed(1)),
          saturates: Number((n['saturated-fat_100g'] || 0).toFixed(1)),
          unsaturates: Number(
            (n['unsaturated-fat_100g'] || 0).toFixed(1),
          ),
          sugars: Number((n['sugars_100g'] || 0).toFixed(1)),
          starch: Number((n['starch_100g'] || 0).toFixed(1)),
          fibre: Number(
            (n['fiber_100g'] || n['fibre_100g'] || 0).toFixed(1),
          ),
          salt: Number((n['salt_100g'] || 0).toFixed(1)),
          sodium: Number((n['sodium_100g'] || 0).toFixed(1)),
          energy_kj: Math.round(n['energy_100g'] || 0),
          vitamins: {
            b1: Number((n['vitamin-b1_100g'] || 0).toFixed(2)),
            b2: Number((n['vitamin-b2_100g'] || 0).toFixed(2)),
            b3: Number((n['vitamin-pp_100g'] || 0).toFixed(2)),
            iron: Number((n['iron_100g'] || 0).toFixed(2)),
            calcium: Number((n['calcium_100g'] || 0).toFixed(0)),
            potassium: Number((n['potassium_100g'] || 0).toFixed(0)),
            magnesium: Number((n['magnesium_100g'] || 0).toFixed(0)),
          },
        }

        navigation.navigate('MealDetail', {
          mealType,
          product,
        })
      } else {
        Alert.alert(
          'Product not found',
          'No product found for this barcode. Try scanning again.',
          [{ text: 'OK' }],
        )
      }
    } catch (e) {
      console.error('Scan error:', e)
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }],
      )
    } finally {
      setLoading(false)
    }
  }, [navigation, mealType])

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <View style={styles.header}>
        <View
          style={[styles.headerSide, { width: HEADER_SIDE }]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon
              name="chevronLeft"
              size={22}
              color={colors.accent.icon}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          Today
        </Text>
        <View style={{ width: HEADER_SIDE }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mealTitle}>{mealLabel}</Text>
        <Text style={styles.mealSubtitle}>
          Key stats at a glance
        </Text>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryKcal}>
              {`${totalKcal} kcal`}
            </Text>
          </View>
          <View style={styles.summaryMacros}>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>
                {totalProtein}
                g
              </Text>
            </View>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>
                {totalCarbs}
                g
              </Text>
            </View>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>
                {totalFat}
                g
              </Text>
            </View>
          </View>
        </View>

        {items.length === 0 ? (
          <Text style={styles.emptyLine}>
            {`Nothing logged yet. Tap "Add" to start tracking food.`}
          </Text>
        ) : (
          items.map((item, index) => {
            const logged = new Date(item.loggedAt)
            const timeStr = logged.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const p = Math.round(Number(item.protein) || 0)
            const c = Math.round(Number(item.carbs) || 0)
            const f = Math.round(Number(item.fat) || 0)
            return (
              <View
                key={`${item.loggedAt}-${index}`}
                style={styles.itemCard}
              >
                <View style={styles.itemTop}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemKcal}>
                    {item.kcal}
                    {' '}
                    kcal
                  </Text>
                </View>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {`${item.brand} · ${item.grams}g`}
                  </Text>
                  <Text style={styles.itemMacrosTiny}>
                    {`P: ${p}g  C: ${c}g  F: ${f}g`}
                  </Text>
                </View>
                <Text style={styles.itemLogged}>
                  {`Logged at ${timeStr}`}
                </Text>
              </View>
            )
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setScannerVisible(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add"
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={(barcode) => {
          setScannerVisible(false)
          handleBarcodeScan(barcode)
        }}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color="#5bb56e"
          />
          <Text style={styles.loadingText}>
            Looking up product...
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  headerSide: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    textAlign: 'center',
  },
  mealTitle: {
    fontSize: 28,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  mealSubtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  summary: {
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
    padding: spacing[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.micro,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryKcal: {
    marginTop: spacing[1],
    fontSize: typography.fontSize.h2,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  summaryMacros: {
    gap: 4,
    minWidth: 112,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
  },
  macroValue: {
    fontSize: typography.fontSize.caption,
    color: colors.text.accent,
    fontWeight: String(typography.fontWeight.medium),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing[2],
  },
  emptyLine: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing[4],
  },
  itemCard: {
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    marginBottom: spacing[1.5],
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  itemName: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  itemKcal: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.accent,
  },
  itemBottom: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  itemMeta: {
    flex: 1,
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
  },
  itemMacrosTiny: {
    fontSize: typography.fontSize.micro,
    color: colors.text.muted,
    textAlign: 'right',
  },
  itemLogged: {
    marginTop: 6,
    fontSize: typography.fontSize.micro,
    color: colors.text.ghost,
  },
  addButton: {
    backgroundColor: colors.interactive.primaryBg,
    borderRadius: borderRadius.full,
    paddingVertical: spacing[2],
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.interactive.primaryLabel,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: 'rgba(13,27,23,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#a8e6b4',
    marginTop: 12,
    fontSize: 14,
  },
})

export { MealScreen }
export default MealScreen
