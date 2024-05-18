import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function TaurusIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(26)}
      height={height || normalize(33)}
      viewBox="0 0 26 33"
      fill="none">
      <Path
        d="M17.58 7.642c-1.574 3.344-3.406 3.791-4.967 3.791-1.561 0-3.393-.447-5.016-3.862C5.52 3.191 4.02.011 0 .011v2.791c2.04 0 2.987 1.814 4.966 5.994 1.156 2.425 2.643 3.991 4.512 4.792-3.97 1.248-6.835 4.828-6.835 9.043 0 5.263 4.462 9.537 9.957 9.537 5.495 0 9.958-4.274 9.958-9.537 0-4.215-2.877-7.795-6.848-9.043 1.881-.8 3.381-2.402 4.561-4.875 1.942-4.11 2.901-5.922 4.942-5.922V0c-4.008 0-5.507 3.167-7.634 7.642zm2.064 15.012c0 3.721-3.159 6.747-7.044 6.747-3.884 0-7.044-3.026-7.044-6.747 0-3.72 3.16-6.746 7.044-6.746 3.885 0 7.044 3.026 7.044 6.746z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
