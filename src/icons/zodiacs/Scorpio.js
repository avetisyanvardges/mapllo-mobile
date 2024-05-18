import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function ScorpioIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(31)}
      height={height || normalize(34)}
      viewBox="0 0 31 34"
      fill="none">
      <Path
        d="M0 2.792V0c.821 0 2.71 0 4.002 1.343C5.01.401 6.396 0 7.663 0c1.385 0 2.828.412 3.85 1.437C12.532.412 13.964 0 15.29 0c2.535 0 5.246 1.39 5.246 5.313v19.664c0 3.7.54 4.064 5.973 4.1V27.05l3.92 3.429-3.92 3.428V31.87c-5.492-.035-8.766-.507-8.766-6.892V5.313c0-1.178-.282-2.52-2.453-2.52-2.37 0-2.37 1.825-2.37 2.426v19.758h-2.782V5.313c0-1.178-.281-2.52-2.452-2.52-2.37 0-2.37 1.825-2.37 2.426v19.758H2.534V5.313c0-2.391-.95-2.52-2.512-2.52H0z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
