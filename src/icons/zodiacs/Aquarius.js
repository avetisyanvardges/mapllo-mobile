import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function AquariesIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(40)}
      height={height || normalize(26)}
      viewBox="0 0 40 26">
      <Path
        d="M1.503 24.48L0 22.078l9.597-6.438 3.926 5.693 8.479-5.693 3.937 5.693 8.48-5.693 4.705 6.81-2.26 1.646-3.156-4.565-8.48 5.682-3.937-5.682-8.467 5.682-3.937-5.682-7.373 4.95h-.011zM1.503 8.829L0 6.439 9.597 0l3.926 5.694L22.002 0l3.937 5.694L34.419 0l4.705 6.81-2.26 1.646-3.156-4.576-8.48 5.694-3.937-5.694-8.467 5.694L8.887 3.88 1.514 8.829h-.011z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
