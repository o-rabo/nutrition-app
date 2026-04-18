import { useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import Svg, { Circle, G } from 'react-native-svg'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
} from '../../design-system'
import { useNutrition } from '../../context/NutritionContext'

const RING_SIZE = 84
const RING_RADIUS = 34
const RING_STROKE = 7
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const CARD_RADIUS = borderRadius['3xl']

const GRAMS_DEFAULT = 100

function num(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function MealDetailScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { addItemToMeal, getTotalCalories } = useNutrition()
  const mealType = route.params?.mealType ?? ''
  const raw = route.params?.product

  const product = raw && typeof raw === 'object' ? raw : {}

  const [grams, setGrams] = useState(GRAMS_DEFAULT)
  const [gramFieldFocused, setGramFieldFocused] = useState(false)
  const [gramDraft, setGramDraft] = useState('')
  const gramDraftRef = useRef('')
  const gramInputRef = useRef(null)

  const ratio = grams / 100

  const pCalories = num(product.calories)
  const pProtein = num(product.protein)
  const pCarbs = num(product.carbs)
  const pFat = num(product.fat)
  const pSat = num(product.saturates)
  const pUnsat = num(product.unsaturates)
  const pSugars = num(product.sugars)
  const pStarch = num(product.starch)
  const pFibre = num(product.fibre)
  const pSalt = num(product.salt)
  const pSodium = num(product.sodium)
  const pEnergyKj100 = num(product.energy_kj)

  const kcal = Math.round(pCalories * ratio)
  const protein = (pProtein * ratio).toFixed(1)
  const carbs = (pCarbs * ratio).toFixed(1)
  const fat = (pFat * ratio).toFixed(1)
  const saturates = (pSat * ratio).toFixed(1)
  const unsaturates = (pUnsat * ratio).toFixed(1)
  const sugars = (pSugars * ratio).toFixed(1)
  const starch = (pStarch * ratio).toFixed(1)
  const fibre = (pFibre * ratio).toFixed(1)
  const salt = (pSalt * ratio).toFixed(1)
  const sodium = (pSodium * ratio).toFixed(1)
  const energyKjDisplay = Math.round(
    (pEnergyKj100 || pCalories * 4.184) * ratio,
  )

  const progress = Math.min(kcal / 600, 1)
  const fillOffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress)

  const proteinN = parseFloat(protein, 10)
  const carbsN = parseFloat(carbs, 10)
  const fatN = parseFloat(fat, 10)

  const pct = (value, goal) =>
    Math.min(100, Math.max(0, (value / goal) * 100))

  const mealTitle = mealType
    ? mealType.charAt(0).toUpperCase() + mealType.slice(1).toLowerCase()
    : 'meal'

  const vitamins = product.vitamins
  const hasVitamins =
    vitamins
    && typeof vitamins === 'object'
    && Object.values(vitamins).some((v) => num(v) > 0)

  const v = vitamins || {}

  const vit = (x, decimals) =>
    (num(x) * ratio).toFixed(decimals)

  const currentTotal = getTotalCalories()

  const handleAdd = useCallback(() => {
    const item = {
      name: product.name ?? '',
      brand: product.brand ?? '',
      grams,
      kcal,
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    }

    addItemToMeal(mealType, item)

    Toast.show({
      type: 'success',
      text1: `${product.name} added to ${
        mealType.charAt(0).toUpperCase() + mealType.slice(1)
      }`,
      position: 'bottom',
      visibilityTime: 3000,
      bottomOffset: 80,
    })

    navigation.navigate('MainTabs', { screen: 'Today' })
  }, [
    addItemToMeal,
    mealType,
    product.name,
    product.brand,
    grams,
    kcal,
    protein,
    carbs,
    fat,
    navigation,
  ])

  const decGrams = () => setGrams((g) => Math.max(1, g - 1))
  const incGrams = () => setGrams((g) => Math.min(9999, g + 1))

  const onGramFocus = () => {
    setGramFieldFocused(true)
    setGramDraft('')
    gramDraftRef.current = ''
  }

  const onGramChangeText = (text) => {
    const raw = text.replace(/[^0-9]/g, '')
    setGramDraft(raw)
    gramDraftRef.current = raw
    if (raw === '') return
    const n = parseInt(raw, 10)
    if (!Number.isNaN(n) && n >= 1 && n <= 9999) {
      setGrams(n)
    }
  }

  const onGramBlur = () => {
    setGramFieldFocused(false)
    const raw = gramDraftRef.current.replace(/[^0-9]/g, '')
    if (raw === '') {
      setGrams(GRAMS_DEFAULT)
      setGramDraft('')
      gramDraftRef.current = ''
      return
    }
    const n = parseInt(raw, 10)
    if (Number.isNaN(n) || n < 1 || n > 9999) {
      setGrams(GRAMS_DEFAULT)
    } else {
      setGrams(n)
    }
    setGramDraft('')
    gramDraftRef.current = ''
  }

  const chips = [10, 50, 100, 200]

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="chevronLeft" size={22} color={colors.accent.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name || 'Food details'}
        </Text>
        <TouchableOpacity
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Favourite"
        >
          <Text style={styles.favouriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.ringRow}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <G transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}>
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke={colors.ring.track}
                  strokeWidth={RING_STROKE}
                  fill="none"
                />
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke={colors.ring.fill}
                  strokeWidth={RING_STROKE}
                  fill="none"
                  strokeDasharray={`${CIRCUMFERENCE}`}
                  strokeDashoffset={fillOffset}
                  strokeLinecap="round"
                />
              </G>
            </Svg>
            <View style={styles.ringCenter}>
              <Text style={styles.ringKcal}>{kcal}</Text>
              <Text style={styles.ringKcalLabel}>kcal</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name || '—'}</Text>
          <Text style={styles.productMeta}>
            {[product.brand, product.portion].filter(Boolean).join(' · ')}
          </Text>

          <View style={styles.macroBlock}>
            <MacroBar
              label="Protein"
              valueText={`${protein}g`}
              pct={pct(proteinN, 150)}
            />
            <MacroBar
              label="Carbs"
              valueText={`${carbs}g`}
              pct={pct(carbsN, 300)}
            />
            <MacroBar
              label="Fat"
              valueText={`${fat}g`}
              pct={pct(fatN, 65)}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Serving size</Text>
          <View style={styles.gramRow}>
            <TouchableOpacity
              style={styles.gramBtn}
              onPress={decGrams}
            >
              <Text style={styles.gramBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.gramInputWrap}>
              <TextInput
                ref={gramInputRef}
                style={styles.gramsInput}
                value={gramFieldFocused ? gramDraft : String(grams)}
                onChangeText={onGramChangeText}
                onFocus={onGramFocus}
                onBlur={onGramBlur}
                keyboardType="number-pad"
                returnKeyType="done"
                textAlign="center"
                selectTextOnFocus={false}
              />
              <Text style={styles.gramsUnit}>g</Text>
            </View>
            <TouchableOpacity
              style={styles.gramBtn}
              onPress={incGrams}
            >
              <Text style={styles.gramBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsRow}>
            {chips.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.chip,
                  grams === c && styles.chipSelected,
                ]}
                onPress={() => {
                  setGrams(c)
                  setGramFieldFocused(false)
                  setGramDraft('')
                  gramDraftRef.current = ''
                  gramInputRef.current?.blur()
                  Keyboard.dismiss()
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    grams === c && styles.chipTextSelected,
                  ]}
                >
                  {c}
                  g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <NutritionRow
            bold
            label="Energy"
            value={`${kcal} kcal / ${energyKjDisplay} kJ`}
          />
          <NutritionRow bold label="Fat" value={`${fat}g`} />
          <NutritionRow indent label="of which saturates" value={`${saturates}g`} />
          <NutritionRow
            indent
            label="of which unsaturates"
            value={`${unsaturates}g`}
          />
          <NutritionRow bold label="Carbohydrates" value={`${carbs}g`} />
          <NutritionRow indent label="of which sugars" value={`${sugars}g`} />
          <NutritionRow indent label="of which starch" value={`${starch}g`} />
          <NutritionRow bold label="Fibre" value={`${fibre}g`} />
          <NutritionRow bold label="Protein" value={`${protein}g`} />
          <NutritionRow bold label="Salt" value={`${salt}g`} />
          <NutritionRow indent label="of which sodium" value={`${sodium}g`} />

          {hasVitamins ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.vitaminsHeading}>
                Vitamins & minerals
              </Text>
              {num(v.b1) > 0 ? (
                <VitRow
                  label="Vitamin B1 (Thiamine)"
                  value={`${vit(v.b1, 2)}mg`}
                />
              ) : null}
              {num(v.b2) > 0 ? (
                <VitRow
                  label="Vitamin B2 (Riboflavin)"
                  value={`${vit(v.b2, 2)}mg`}
                />
              ) : null}
              {num(v.b3) > 0 ? (
                <VitRow
                  label="Vitamin B3 (Niacin)"
                  value={`${vit(v.b3, 2)}mg`}
                />
              ) : null}
              {num(v.iron) > 0 ? (
                <VitRow label="Iron" value={`${vit(v.iron, 2)}mg`} />
              ) : null}
              {num(v.calcium) > 0 ? (
                <VitRow label="Calcium" value={`${vit(v.calcium, 0)}mg`} />
              ) : null}
              {num(v.potassium) > 0 ? (
                <VitRow
                  label="Potassium"
                  value={`${vit(v.potassium, 0)}mg`}
                />
              ) : null}
              {num(v.magnesium) > 0 ? (
                <VitRow
                  label="Magnesium"
                  value={`${vit(v.magnesium, 0)}mg`}
                />
              ) : null}
            </>
          ) : null}
        </View>

        <View style={styles.addsStrip}>
          <View>
            <Text style={styles.addsLabel}>
              Adds to today&apos;s total
            </Text>
            <Text style={styles.addsFaint}>
              {`${currentTotal.toLocaleString()} → ${(currentTotal + kcal).toLocaleString()} kcal`}
            </Text>
          </View>
          <View style={styles.addsRight}>
            <Text style={styles.addsPlus}>
              +
              {kcal}
            </Text>
            <Text style={styles.addsUnit}>kcal</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAdd}
        activeOpacity={0.85}
      >
        <Text style={styles.addButtonText}>
          {`Add to ${mealTitle}`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

function MacroBar({ label, valueText, pct }) {
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroTop}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{valueText}</Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct}%` }]} />
      </View>
    </View>
  )
}

function NutritionRow({ bold, indent, label, value }) {
  return (
    <View
      style={[
        styles.nutRow,
        indent && styles.nutRowIndent,
      ]}
    >
      <Text
        style={[
          styles.nutLabel,
          bold && styles.nutLabelBold,
        ]}
      >
        {label}
      </Text>
      <Text style={styles.nutValue}>{value}</Text>
    </View>
  )
}

function VitRow({ label, value }) {
  return (
    <View style={styles.nutRow}>
      <Text style={styles.nutLabel}>{label}</Text>
      <Text style={styles.nutValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.app,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing[1.5],
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: spacing[2],
    fontSize: typography.fontSize.h3,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    textAlign: 'center',
  },
  favouriteIcon: {
    fontSize: 22,
    color: colors.text.secondary,
    width: 28,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  card: {
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: CARD_RADIUS,
    padding: spacing[2],
  },
  ringRow: {
    position: 'relative',
    width: RING_SIZE,
    height: RING_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringKcal: {
    fontSize: typography.fontSize.h2,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  ringKcalLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
  },
  productName: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    textAlign: 'center',
  },
  productMeta: {
    marginTop: spacing.half,
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  macroBlock: {
    marginTop: spacing[2],
    gap: spacing[1.5],
  },
  macroRow: {
    gap: spacing.half,
  },
  macroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  macroValue: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.primary,
    fontWeight: String(typography.fontWeight.medium),
  },
  macroTrack: {
    height: spacing.half,
    borderRadius: spacing.half,
    backgroundColor: colors.background.cardDeep,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    backgroundColor: colors.accent.icon,
    borderRadius: spacing.half,
  },
  sectionLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
    marginBottom: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
  gramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  gramInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  gramBtn: {
    width: spacing[5],
    height: spacing[5],
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.cardDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gramBtnText: {
    fontSize: typography.fontSize.h3,
    color: colors.text.primary,
    fontWeight: String(typography.fontWeight.medium),
  },
  gramsInput: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    minWidth: 80,
    paddingVertical: 0,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    underlineColorAndroid: 'transparent',
  },
  gramsUnit: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.cardDeep,
  },
  chipSelected: {
    backgroundColor: colors.interactive.primaryBg,
  },
  chipText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  chipTextSelected: {
    color: colors.interactive.primaryLabel,
    fontWeight: String(typography.fontWeight.medium),
  },
  nutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[1],
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a3520',
    gap: spacing[2],
  },
  nutRowIndent: {
    paddingLeft: 14,
  },
  nutLabel: {
    flex: 1,
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
  },
  nutLabelBold: {
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
  },
  nutValue: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.accent.icon,
    fontWeight: String(typography.fontWeight.medium),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing[1],
  },
  vitaminsHeading: {
    fontSize: typography.fontSize.caption,
    color: colors.text.muted,
    marginBottom: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
  addsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
  },
  addsLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.muted,
  },
  addsFaint: {
    marginTop: 2,
    fontSize: typography.fontSize.caption,
    color: colors.text.faint,
  },
  addsRight: {
    alignItems: 'flex-end',
  },
  addsPlus: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.accent.glow,
  },
  addsUnit: {
    fontSize: typography.fontSize.micro,
    color: colors.text.muted,
  },
  addButton: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing[2],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.interactive.primaryBg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.interactive.primaryLabel,
  },
})

export { MealDetailScreen }
export default MealDetailScreen
