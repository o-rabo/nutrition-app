import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useMemo, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useNutrition } from '../../context/NutritionContext'
import {
  colors,
  typography,
  spacing,
  borderRadius,
  Icon,
  MobileTopNavbar,
} from '../../design-system'

/**
 * Europe/Berlin wall-calendar Y / M / D. Uses Intl (no re-parsing locale strings
 * with `new Date(...)`, which can yield Invalid Date on Hermes / iOS).
 */
const getBerlinYmd = (d = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const val = (type) => {
    const p = parts.find((x) => x.type === type)
    return p ? Number.parseInt(p.value, 10) : NaN
  }
  let y = val('year')
  let m = val('month')
  let day = val('day')
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(day)) {
    const f = d instanceof Date && !Number.isNaN(d.getTime()) ? d : new Date()
    y = f.getFullYear()
    m = f.getMonth() + 1
    day = f.getDate()
  }
  return { y, m, d: day }
}

const ymdToKeyNum = (y, m, d) => y * 10000 + m * 100 + d

/** One calendar day earlier (Gregorian; same as civil calendar in Berlin). */
const previousGregorianYmd = (y, m, d) => {
  const t = new Date(Date.UTC(y, m - 1, d - 1, 12, 0, 0, 0))
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1,
    d: t.getUTCDate(),
  }
}

/** Noon UTC for that calendar day — stable, valid Date for Intl formatting. */
const ymdToDateUtcNoon = (y, m, d) => new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0))

const addOneDayUtc = (d) => {
  const t = d.getTime()
  if (Number.isNaN(t)) {
    return d
  }
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate() + 1,
      12,
      0,
      0,
      0,
    ),
  )
}

/**
 * Berlin calendar days from 2026-01-01 through today, oldest → newest, then
 * reversed so **Today is index 0 (leftmost)** in the horizontal list.
 * ( Uses robust YMD math — not `new Date(toLocaleString())`, which can break
 *   on Hermes / iOS. )
 */
const generateDates = () => {
  const dates = []
  const { y: ey, m: em, d: ed } = getBerlinYmd()
  const endNum = ymdToKeyNum(ey, em, ed)
  const startNum = ymdToKeyNum(2026, 1, 1)
  if (endNum < startNum) {
    return [ ymdToDateUtcNoon(ey, em, ed) ]
  }
  let cur = ymdToDateUtcNoon(2026, 1, 1)
  const endD = ymdToDateUtcNoon(ey, em, ed)
  while (cur.getTime() <= endD.getTime()) {
    dates.push(new Date(cur))
    cur = addOneDayUtc(cur)
  }
  // Today first (newest = index 0) — scroll right for older days.
  return dates.reverse()
}

const ALL_DATES = generateDates()

const formatDateKey = (date) => {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatDateLabel = (date) => {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return ''
  }
  const { y, m, d } = getBerlinYmd(date)
  const { y: ty, m: tm, d: td } = getBerlinYmd()
  if (y === ty && m === tm && d === td) {
    return 'Today'
  }
  const { y: yy, m: ym, d: yd } = previousGregorianYmd(ty, tm, td)
  if (y === yy && m === ym && d === yd) {
    return 'Yesterday'
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Berlin',
  })
}

const berlinTodayString = () => {
  const { y, m, d } = getBerlinYmd()
  return formatDateKey(ymdToDateUtcNoon(y, m, d))
}

export function DiaryScreen() {
  const navigation = useNavigation()
  const {
    meals,
    history: historyFromContext,
    getTodayString: getTodayStringFromContext,
    getMealCalories: _getMealCalories,
    getMealSubtitle: _getMealSubtitle,
    getTotalCalories,
    getTotalMacros: _getTotalMacros,
  } = useNutrition()

  const history = historyFromContext ?? {}
  const getTodayString = getTodayStringFromContext ?? berlinTodayString

  const todayString = getTodayString()
  const [selectedDate, setSelectedDate] = useState(() => {
    if (ALL_DATES[0]) {
      return ALL_DATES[0]
    }
    const { y, m, d } = getBerlinYmd()
    return ymdToDateUtcNoon(y, m, d)
  })
  const selectedDateKey = formatDateKey(selectedDate)
  const isToday = selectedDateKey === todayString

  const selectedMeals = useMemo(() => {
    if (isToday) {
      return meals
    }
    return history[selectedDateKey] || null
  }, [isToday, meals, history, selectedDateKey])

  const totalKcal = useMemo(() => {
    if (!selectedMeals) {
      return 0
    }
    return Object.values(selectedMeals).reduce(
      (total, meal) => total
        + meal.items.reduce(
          (sum, item) => sum + (item.kcal || 0),
          0,
        ),
      0,
    )
  }, [selectedMeals])

  const totalMacros = useMemo(() => {
    if (!selectedMeals) {
      return { protein: 0, carbs: 0, fat: 0 }
    }
    return Object.values(selectedMeals).reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          totals.protein += item.protein || 0
          totals.carbs += item.carbs || 0
          totals.fat += item.fat || 0
        })
        return totals
      },
      { protein: 0, carbs: 0, fat: 0 },
    )
  }, [selectedMeals])

  const CALORIE_GOAL = 2950
  const calorieProgress = totalKcal / CALORIE_GOAL

  const getInsight = useCallback(() => {
    const remaining = CALORIE_GOAL - totalKcal
    const proteinPct = totalMacros.protein / 150

    if (totalKcal === 0) {
      return {
        title: 'Start logging your meals',
        body:
          "You haven't logged anything yet. "
          + 'Scan a barcode or search for a food '
          + 'to get started.',
      }
    }
    if (calorieProgress >= 1) {
      return {
        title: "You've hit your calorie goal",
        body:
          'Great job hitting your target today. '
          + 'Focus on keeping your macros balanced '
          + 'for the rest of the day.',
      }
    }
    if (calorieProgress >= 0.75) {
      return {
        title: 'Good progress today',
        body: `You've logged ${totalKcal} kcal so far. ${
          remaining} kcal remaining to hit your goal.`,
      }
    }
    if (calorieProgress >= 0.5) {
      return {
        title: 'Halfway there',
        body: `${remaining} kcal left to reach your `
          + 'daily goal. Keep logging your meals '
          + 'to stay on track.',
      }
    }
    if (proteinPct < 0.3) {
      return {
        title: 'Boost your protein',
        body:
          'Your protein intake is low today. '
          + 'Try adding a protein-rich food like '
          + 'chicken, eggs, or Greek yogurt.',
      }
    }
    return {
      title: 'Keep going',
      body: `You're at ${Math.round(calorieProgress * 100)}% `
        + 'of your daily goal. Log more meals to '
        + `reach your target of ${CALORIE_GOAL} kcal.`,
    }
  }, [totalKcal, totalMacros, calorieProgress])

  const insight = getInsight()

  const mealRows = useMemo(() => {
    const mealKeys = [
      'breakfast',
      'lunch',
      'dinner',
      'snacks',
    ]
    return mealKeys.map((key) => {
      const meal = selectedMeals?.[key]
      const items = meal?.items || []
      const kcal = items.reduce(
        (sum, item) => sum + (item.kcal || 0),
        0,
      )

      let subtitle = 'Not logged yet'
      if (items.length === 1) {
        subtitle = items[0].name
      }
      if (items.length > 1) {
        subtitle = `${items[0].name} +${
          items.length - 1} more`
      }

      return {
        id: key,
        label: meal?.label
          || key.charAt(0).toUpperCase() + key.slice(1),
        subtitle,
        iconName: meal?.iconName || key,
        calories: kcal > 0 ? kcal : undefined,
      }
    })
  }, [selectedMeals])

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: colors.background.app }}
    >

      <MobileTopNavbar
        title="Diary"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="barcode"
        onRightPress={() => {
          console.log('barcode tapped')
        }}
      />

      <FlatList
        data={ALL_DATES}
        horizontal
        inverted={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => {
          if (item instanceof Date && !Number.isNaN(item.getTime())) {
            return formatDateKey(item) || `i-${index}`
          }
          return `i-${index}`
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          paddingBottom: spacing[1],
        }}
        renderItem={({ item: date }) => {
          const key = formatDateKey(date)
          const isSelected
            = key === formatDateKey(selectedDate)
          const hasData
            = key === todayString
              ? getTotalCalories() > 0
              : !!history[key]

          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(date)}
              style={{
                paddingHorizontal: spacing[1.5],
                paddingVertical: spacing[1],
                marginRight: spacing[1],
                borderBottomWidth: isSelected ? 2 * spacing.px : 0,
                borderBottomColor: colors.accent.ring,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.bodySmall,
                  fontWeight: isSelected
                    ? typography.fontWeight.medium
                    : typography.fontWeight.regular,
                  color: isSelected
                    ? colors.text.primary
                    : colors.text.muted,
                }}
              >
                {formatDateLabel(date)}
              </Text>

              {hasData && !isSelected && (
                <View
                  style={{
                    width: spacing.half,
                    height: spacing.half,
                    borderRadius: borderRadius.subtle,
                    backgroundColor: colors.accent.ring,
                    alignSelf: 'center',
                    marginTop: 3 * spacing.px,
                  }}
                />
              )}
            </TouchableOpacity>
          )
        }}
      />

      <View
        style={{
          height: spacing.px / 2,
          backgroundColor: colors.border.subtle,
          marginBottom: spacing[2],
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
          paddingBottom: spacing[4],
        }}
      >

        <View style={{ marginBottom: spacing[1] }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: spacing[1.5] / 2,
              marginBottom: spacing.half,
            }}
          >
            <Text
              style={{
                fontSize: 2 * typography.fontSize.h1,
                fontWeight: typography.fontWeight.medium,
                color: colors.text.primary,
                lineHeight: spacing[7],
              }}
            >
              {totalKcal.toLocaleString()}
            </Text>
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.secondary,
              }}
            >
              kcal
            </Text>
          </View>

          <Text
            style={{
              fontSize: typography.fontSize.bodySmall,
              color: calorieProgress >= 1
                ? colors.state.success
                : colors.accent.icon,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {calorieProgress >= 1
              ? `Goal reached! ${totalKcal.toLocaleString()
              } kcal logged`
              : `Under your goal · ${
                (CALORIE_GOAL - totalKcal).toLocaleString()
              } kcal remaining`}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background.card,
            borderWidth: spacing.px / 2,
            borderColor: colors.border.subtle,
            borderRadius: borderRadius['2xl'],
            padding: spacing[2],
            marginBottom: spacing[2],
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: colors.text.primary,
              marginBottom: spacing[1.5] / 2,
            }}
          >
            {insight.title}
          </Text>
          <Text
            style={{
              fontSize: typography.fontSize.bodySmall,
              color: colors.text.secondary,
              lineHeight: spacing[2.5],
            }}
          >
            {insight.body}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background.card,
            borderWidth: spacing.px / 2,
            borderColor: colors.border.subtle,
            borderRadius: borderRadius['2xl'],
            padding: spacing[2],
            marginBottom: spacing[2],
          }}
        >
          <Text
            style={{
              fontSize: typography.fontSize.micro,
              color: colors.text.muted,
              letterSpacing: typography.letterSpacing.widest,
              textTransform: typography.textTransform.uppercase,
              marginBottom: spacing[1.5],
            }}
          >
            Macros
          </Text>

          {[
            {
              label: 'Calories',
              value: totalKcal,
              goal: CALORIE_GOAL,
              unit: 'kcal',
              pct: Math.min(calorieProgress, 1),
            },
            {
              label: 'Protein',
              value: Math.round(totalMacros.protein),
              goal: 150,
              unit: 'g',
              pct: Math.min(totalMacros.protein / 150, 1),
            },
            {
              label: 'Carbs',
              value: Math.round(totalMacros.carbs),
              goal: 300,
              unit: 'g',
              pct: Math.min(totalMacros.carbs / 300, 1),
            },
            {
              label: 'Fat',
              value: Math.round(totalMacros.fat),
              goal: 65,
              unit: 'g',
              pct: Math.min(totalMacros.fat / 65, 1),
            },
          ].map((macro, index, arr) => (
            <View
              key={macro.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: spacing[1],
                borderBottomWidth: index < arr.length - 1
                  ? spacing.px / 2
                  : 0,
                borderBottomColor: colors.border.subtle,
              }}
            >
              <Text
                style={{
                  fontSize: typography.fontSize.bodySmall,
                  color: colors.text.secondary,
                  flex: 1,
                }}
              >
                {macro.label}
              </Text>
              <View
                style={{
                  flex: 2,
                  marginHorizontal: spacing[1.5],
                }}
              >
                <View
                  style={{
                    height: 3 * spacing.px,
                    backgroundColor: colors.ring.track,
                    borderRadius: borderRadius.subtle,
                  }}
                >
                  <View
                    style={{
                      height: 3 * spacing.px,
                      width: `${macro.pct * 100}%`,
                      backgroundColor: macro.pct >= 1
                        ? colors.state.success
                        : colors.accent.bar,
                      borderRadius: borderRadius.subtle,
                    }}
                  />
                </View>
              </View>
              <Text
                style={{
                  fontSize: typography.fontSize.bodySmall,
                  color: colors.text.accent,
                  fontWeight: typography.fontWeight.medium,
                  textAlign: 'right',
                  minWidth: 11.25 * spacing[1],
                }}
              >
                {macro.value.toLocaleString()}
                {' '}
                <Text
                  style={{
                    color: colors.text.muted,
                    fontWeight: typography.fontWeight.regular,
                    fontSize: typography.fontSize.micro,
                  }}
                >
                  {`/ ${macro.goal}${macro.unit}`}
                </Text>
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontSize: typography.fontSize.micro,
            color: colors.text.muted,
            letterSpacing: typography.letterSpacing.widest,
            textTransform: typography.textTransform.uppercase,
            marginBottom: spacing[1.5],
          }}
        >
          Meals
        </Text>

        {mealRows.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            onPress={() => {
              if (isToday) {
                navigation.navigate('Meal', {
                  mealType: meal.id,
                })
              }
            }}
            activeOpacity={isToday ? 0.7 : 1}
            style={{
              backgroundColor: colors.background.card,
              borderWidth: spacing.px / 2,
              borderColor: colors.border.subtle,
              borderRadius: borderRadius['2xl'],
              padding: spacing[2],
              marginBottom: spacing[1.5],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.iconGap,
              }}
            >
              <View
                style={{
                  width: spacing[5],
                  height: spacing[5],
                  backgroundColor: colors.background.iconWell,
                  borderRadius: borderRadius.lg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={meal.iconName}
                  size={typography.fontSize.h3}
                  color={colors.accent.icon}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.text.primary,
                  }}
                >
                  {meal.label}
                </Text>
                <Text
                  style={{
                    fontSize: typography.fontSize.bodySmall,
                    color: colors.text.secondary,
                    marginTop: 2 * spacing.px,
                  }}
                >
                  {meal.subtitle}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              {meal.calories
                ? (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.text.accent,
                        }}
                      >
                        {meal.calories.toLocaleString()}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.fontSize.micro,
                          color: colors.text.muted,
                        }}
                      >
                        kcal
                      </Text>
                    </View>
                  )
                : (
                    <Text
                      style={{
                        fontSize: typography.fontSize.bodySmall,
                        color: colors.text.ghost,
                      }}
                    >
                      {isToday ? '+ add' : 'Not logged'}
                    </Text>
                  )}
            </View>
          </TouchableOpacity>
        ))}

        {!selectedMeals && !isToday && (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: spacing[4],
            }}
          >
            <Text
              style={{
                fontSize: typography.fontSize.base,
                color: colors.text.muted,
                textAlign: 'center',
              }}
            >
              No meals logged on this day.
            </Text>
          </View>
        )}

      </ScrollView>

    </SafeAreaView>
  )
}

export default DiaryScreen
