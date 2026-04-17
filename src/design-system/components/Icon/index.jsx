import { SvgXml } from 'react-native-svg'
import { icons } from './icons'

function Icon({ name, size = 18, color, style }) {
  const icon = icons[name]

  if (!icon) {
    console.warn(`[Icon] Unknown icon name: "${name}"`)
    return null
  }

  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}">${icon.content}</svg>`

  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
      color={color}
      style={style}
    />
  )
}

export { Icon }
export default Icon
