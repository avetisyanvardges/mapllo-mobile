import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function SagittariusIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(28)}
      height={height || normalize(28)}
      viewBox="0 0 28 28"
      fill="none">
      <Path
        d="M8.51 17.308l-4.743-4.756 2.002-2.003 4.756 4.756L22.994 2.837h-12.1V0h16.927v16.938h-2.825V4.84L12.528 17.308l4.744 4.744-2.002 2.015-4.745-4.757-8.522 8.511L0 25.82l8.51-8.511z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
