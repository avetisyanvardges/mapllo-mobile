import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function GeminiIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(32)}
      height={height || normalize(33)}
      viewBox="0 0 32 33"
      fill="none">
      <Path
        d="M22.598 4.411c5.462-.61 8.532-1.748 8.701-1.818L30.248 0s-5.414 2.006-14.599 2.006C6.466 2.006 1.1.012 1.051 0L0 2.593c.17.07 3.25 1.208 8.7 1.818v23.346c-5.461.61-8.53 1.748-8.7 1.819l1.051 2.592s5.414-2.006 14.598-2.006c9.185 0 14.55 1.995 14.599 2.006l1.051-2.592c-.17-.07-3.25-1.209-8.7-1.819V4.411zm-2.864 23.1a63.08 63.08 0 00-4.085-.13c-1.462 0-2.803.048-4.084.13V4.657c1.269.083 2.622.13 4.085.13 1.462 0 2.803-.047 4.084-.13v22.854z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
