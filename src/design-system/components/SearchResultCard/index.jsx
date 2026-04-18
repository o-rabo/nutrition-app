import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography, spacing, borderRadius } from '../../tokens'

/**
 * Outer TouchableOpacity = open detail (card tap).
 * Inner TouchableOpacity = quick add (nested; takes priority on RN).
 * Avoids Pressable + child touchable issues inside FlatList (esp. Android).
 */
export function SearchResultCard({
  name,
  brand,
  portion,
  calories,
  tag,
  onCardPress,
  onAddPress,
}) {
  const subtitleLine = [brand, portion].filter(Boolean).join(' · ')

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => {
        if (typeof onCardPress === 'function') {
          onCardPress()
        }
      }}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (typeof onAddPress === 'function') {
              onAddPress()
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.addLink}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.bottomLeft}>
          {subtitleLine ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitleLine}
            </Text>
          ) : null}
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        </View>
        <Text style={styles.calories}>
          {calories}
          {' '}
          kcal
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderWidth: 0.5,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.text.primary,
    marginRight: 12,
  },
  addLink: {
    fontSize: typography.fontSize.base,
    fontWeight: String(typography.fontWeight.medium),
    color: colors.accent.icon,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bottomLeft: {
    flex: 1,
    marginRight: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  tagPill: {
    backgroundColor: colors.background.cardDeep,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: typography.fontSize.micro,
    color: colors.text.muted,
  },
  calories: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.text.muted,
  },
})

export default SearchResultCard
