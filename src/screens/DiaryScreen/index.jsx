import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PagerView from 'react-native-pager-view'
import { useRef, useState, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useNutrition } from '../../context/NutritionContext'
import {
  colors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  Icon,
  MobileTopNavbar,
  NavTab,
} from '../../design-system'

/**
 * Europe/Berlin wall-calendar Y / M / D (Intl; avoids Invalid Date on Hermes).
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

const previousGregorianYmd = (y, m, d) => {
  const t = new Date(Date.UTC(y, m - 1, d - 1, 12, 0, 0, 0))
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1,
    d: t.getUTCDate(),
  }
}

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

/** Oldest first, **today last** (rightmost page index = TODAY_INDEX). */
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
  return dates
}

const ALL_DATES = generateDates()
const TODAY_INDEX = ALL_DATES.length - 1

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

function DayPage({ date, isToday }) {
  const navigation = useNavigation()
  const {
    meals,
    history: historyFromContext,
  } = useNutrition()

  const history = historyFromContext ?? {}
  const CALORIE_GOAL = 2950

  const dateKey = formatDateKey(date)

  const selectedMeals = isToday
    ? meals
    : history[dateKey] || null

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

  const calorieProgress = totalKcal / CALORIE_GOAL

  const getInsight = () => {
    const remaining = CALORIE_GOAL - totalKcal
    if (totalKcal === 0) {
      return {
        title: 'Start logging your meals',
        body: "You haven't logged anything yet. "
          + 'Tap a meal below to get started.',
      }
    }
    if (calorieProgress >= 1) {
      return {
        title: "You've hit your calorie goal",
        body: 'Great job hitting your target today. '
          + 'Keep your macros balanced.',
      }
    }
    if (calorieProgress >= 0.75) {
      return {
        title: 'Good progress today',
        body: `${totalKcal.toLocaleString()} kcal `
          + `logged. ${remaining.toLocaleString()}`
          + ' kcal remaining.',
      }
    }
    if (calorieProgress >= 0.5) {
      return {
        title: 'Halfway there',
        body: `${remaining.toLocaleString()} kcal `
          + 'left to reach your daily goal.',
      }
    }
    if (totalMacros.protein / 150 < 0.3) {
      return {
        title: 'Boost your protein',
        body: 'Your protein intake is low. Try '
          + 'adding chicken, eggs, or Greek yogurt.',
      }
    }
    return {
      title: 'Keep going',
      body: `You're at ${Math.round(
        calorieProgress * 100,
      )}% of your daily goal of `
        + `${CALORIE_GOAL.toLocaleString()} kcal.`,
    }
  }

  const insight = getInsight()

  const mealRows = useMemo(() => {
    return [
      'breakfast',
      'lunch',
      'dinner',
      'snacks',
    ].map((key) => {
      const meal = selectedMeals?.[key]
      const items = meal?.items || []
      const kcal = items.reduce(
        (sum, i) => sum + (i.kcal || 0),
        0,
      )
      let subtitle = 'Not logged yet'
      if (items.length === 1) {
        subtitle = items[0].name
      }
      if (items.length > 1) {
        subtitle = `${items[0].name} `
          + `+${items.length - 1} more`
      }
      return {
        id: key,
        label: meal?.label
          || key.charAt(0).toUpperCase()
          + key.slice(1),
        subtitle,
        iconName: meal?.iconName || key,
        calories: kcal > 0 ? kcal : undefined,
      }
    })
  }, [selectedMeals])

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.screenHorizontal,
        paddingTop: spacing[2],
        paddingBottom: spacing[4],
      }}
    >
      <View style={{ marginBottom: spacing[1.5] }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: spacing[1],
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
            fontWeight: typography.fontWeight.medium,
            color: calorieProgress >= 1
              ? colors.state.success
              : colors.accent.icon,
          }}
        >
          {calorieProgress >= 1
            ? 'Goal reached!'
            : `${(CALORIE_GOAL - totalKcal)
              .toLocaleString()} kcal remaining`}
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
            pct: Math.min(
              totalMacros.protein / 150,
              1,
            ),
          },
          {
            label: 'Carbs',
            value: Math.round(totalMacros.carbs),
            goal: 300,
            unit: 'g',
            pct: Math.min(
              totalMacros.carbs / 300,
              1,
            ),
          },
          {
            label: 'Fat',
            value: Math.round(totalMacros.fat),
            goal: 65,
            unit: 'g',
            pct: Math.min(
              totalMacros.fat / 65,
              1,
            ),
          },
        ].map((macro, i, arr) => (
          <View
            key={macro.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing[1],
              borderBottomWidth: i < arr.length - 1
                ? spacing.px / 2
                : 0,
              borderBottomColor: colors.border.subtle,
            }}
          >
            <Text
              style={{
                ...textStyles.label,
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
                ...textStyles.label,
                color: colors.text.accent,
                fontWeight: typography.fontWeight.medium,
                textAlign: 'right',
                minWidth: 11.25 * spacing[1],
              }}
            >
              {macro.value.toLocaleString()}
              <Text
                style={{
                  color: colors.text.muted,
                  fontWeight: typography.fontWeight.regular,
                  fontSize: typography.fontSize.micro,
                }}
              >
                {' '}
                / {macro.goal}
                {macro.unit}
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
                  ...textStyles.label,
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

          <View style={{ alignItems: 'flex-end' }}>
            {meal.calories
              ? (
                  <>
                    <Text
                      style={{
                        ...textStyles.label,
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
                  </>
                )
              : (
                  <Text
                    style={{
                      ...textStyles.label,
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
              ...textStyles.label,
              color: colors.text.muted,
              textAlign: 'center',
            }}
          >
            No meals logged on this day.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export function DiaryScreen() {
  const navigation = useNavigation()
  const pagerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(TODAY_INDEX)

  const prevDate = ALL_DATES[currentIndex - 1]
  const currDate = ALL_DATES[currentIndex]
  const nextDate = ALL_DATES[currentIndex + 1]

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: colors.background.app,
      }}
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderBottomWidth: spacing.px / 2,
          borderBottomColor: colors.border.subtle,
          paddingHorizontal: spacing.screenHorizontal,
        }}
      >
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          {prevDate && (
            <NavTab
              label={formatDateLabel(prevDate)}
              active={false}
              onPress={() => {
                if (currentIndex > 0) {
                  const i = currentIndex - 1
                  pagerRef.current?.setPage(i)
                  setCurrentIndex(i)
                }
              }}
            />
          )}
        </View>

        <View style={{ flex: 1, alignItems: 'center' }}>
          {currDate && (
            <NavTab
              label={formatDateLabel(currDate)}
              active
              onPress={() => {
                console.log('open date picker')
              }}
            />
          )}
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {nextDate && (
            <NavTab
              label={formatDateLabel(nextDate)}
              active={false}
              onPress={() => {
                if (currentIndex < TODAY_INDEX) {
                  const i = currentIndex + 1
                  pagerRef.current?.setPage(i)
                  setCurrentIndex(i)
                }
              }}
            />
          )}
        </View>
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={TODAY_INDEX}
        onPageSelected={(e) => {
          setCurrentIndex(e.nativeEvent.position)
        }}
        scrollEnabled
        orientation="horizontal"
      >
        {ALL_DATES.map((date, index) => (
          <View
            key={formatDateKey(date) || String(index)}
            style={{ flex: 1 }}
          >
            <DayPage
              date={date}
              isToday={index === TODAY_INDEX}
            />
          </View>
        ))}
      </PagerView>
    </SafeAreaView>
  )
}

export default DiaryScreen
