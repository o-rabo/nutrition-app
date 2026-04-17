import { colors } from '../../index'
import { icons } from './icons'

function Icon({
  name,
  size = 18,
  color = colors.accent.icon,
  style,
}) {
  const icon = icons[name]

  if (!icon) {
    console.warn(`[Icon] Unknown icon name: "${name}"`)
    return null
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      style={{
        color,
        display: 'block',
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: icon.content }}
    />
  )
}

export { Icon }
export default Icon
