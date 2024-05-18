import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function AriesIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(34)}
      height={height || normalize(33)}
      viewBox="0 0 34 33">
      <Path
        d="M1.246 2.787C2.36.992 4.15 0 6.303 0c3.781 0 8.077 2.846 10.22 14.1C18.675 2.846 22.972 0 26.752 0c2.154 0 3.957.992 5.057 2.787 1.873 3.023 1.393 7.57-.035 10.498l-2.493-1.24c1.229-2.527 1.299-5.94.163-7.782-.608-.98-1.498-1.452-2.704-1.452-2.657 0-8.837 2.857-8.837 29.357h-2.775c0-26.5-6.18-29.357-8.837-29.357-1.218 0-2.096.484-2.704 1.452-1.136 1.83-1.054 5.255.164 7.782l-2.494 1.24C-.17 10.357-.638 5.81 1.223 2.787H1.2h.046z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
