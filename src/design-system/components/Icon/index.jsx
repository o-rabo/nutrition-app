import * as HeroOutline from 'react-native-heroicons/outline'
import * as HeroSolid from 'react-native-heroicons/solid'
import { colors } from '../../tokens'

const ICON_MAP = {
  today: { outline: 'ChartBarIcon', solid: 'ChartBarIcon' },
  diary: { outline: 'CalendarDaysIcon', solid: 'CalendarDaysIcon' },
  profile: { outline: 'UserIcon', solid: 'UserIcon' },
  search: { outline: 'MagnifyingGlassIcon', solid: 'MagnifyingGlassIcon' },
  barcode: { outline: 'QrCodeIcon', solid: 'QrCodeIcon' },
  back: { outline: 'ChevronLeftIcon', solid: 'ChevronLeftIcon' },
  chevronLeft: { outline: 'ChevronLeftIcon', solid: 'ChevronLeftIcon' },
  forward: { outline: 'ChevronRightIcon', solid: 'ChevronRightIcon' },
  close: { outline: 'XMarkIcon', solid: 'XMarkIcon' },
  plus: { outline: 'PlusIcon', solid: 'PlusIcon' },
  minus: { outline: 'MinusIcon', solid: 'MinusIcon' },
  star: { outline: 'StarIcon', solid: 'StarIcon' },
  check: { outline: 'CheckIcon', solid: 'CheckIcon' },
  pencil: { outline: 'PencilIcon', solid: 'PencilIcon' },
  photo: { outline: 'PhotoIcon', solid: 'PhotoIcon' },
  gallery: { outline: 'PhotoIcon', solid: 'PhotoIcon' },
  torch: { outline: 'BoltIcon', solid: 'BoltIcon' },
  calendar: { outline: 'CalendarDaysIcon', solid: 'CalendarDaysIcon' },
  chart: { outline: 'ChartBarIcon', solid: 'ChartBarIcon' },
  clock: { outline: 'ClockIcon', solid: 'ClockIcon' },
  info: {
    outline: 'InformationCircleIcon',
    solid: 'InformationCircleIcon',
  },
  breakfast: { outline: 'SunIcon', solid: 'SunIcon' },
  lunch: { outline: 'FireIcon', solid: 'FireIcon' },
  dinner: { outline: 'MoonIcon', solid: 'MoonIcon' },
  snacks: { outline: 'CakeIcon', solid: 'CakeIcon' },
}

export function Icon({
  name,
  size = 24,
  color,
  solid = false,
  style,
}) {
  const iconColor = color ?? colors.accent.icon
  const map = ICON_MAP[name]

  if (!map) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  const iconName = solid ? map.solid : map.outline
  const IconSet = solid ? HeroSolid : HeroOutline
  const HeroIcon = IconSet[iconName]

  if (!HeroIcon) {
    console.warn(`Heroicon "${iconName}" not found`)
    return null
  }

  return (
    <HeroIcon
      size={size}
      color={iconColor}
      style={style}
    />
  )
}

export default Icon
