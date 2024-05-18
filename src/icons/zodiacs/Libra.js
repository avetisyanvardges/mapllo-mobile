import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function LibraIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(34)}
      height={height || normalize(29)}
      viewBox="0 0 34 29"
      fill="none">
      <Path
        d="M33.038 16.228v2.851H18.695V16.24l.822-.373c1.227-.553 3.89-3.02 3.89-6.736 0-3.718-2.767-6.28-6.888-6.28s-6.876 2.514-6.876 6.28c0 3.765 2.674 6.183 3.89 6.736l.821.373v2.839H.012v-2.851h9.584c-1.481-1.72-2.708-4.198-2.708-7.097C6.888 3.753 10.847 0 16.53 0c5.683 0 9.642 3.753 9.642 9.13 0 2.912-1.227 5.39-2.708 7.098h9.573zM33.038 25.84H0v2.85h33.038v-2.85z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
