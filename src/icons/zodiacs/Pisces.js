import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function PiscesIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(26)}
      height={height || normalize(35)}
      viewBox="0 0 26 35"
      fill="none">
      <Path
        d="M0 15.61h6.958C6.603 5.175 1.15 2.606 1.091 2.582L2.229 0C2.525.13 9.4 3.331 9.79 15.61h5.63C15.802 3.33 22.677.13 22.986 0l.569 1.297.58 1.285c-.225.107-5.524 2.748-5.88 13.028h6.96v2.82H18.29c.57 10.053 5.832 13.848 6.07 14.003l-1.577 2.344c-.285-.19-6.697-4.688-7.302-16.348H9.78c-.604 11.66-7.017 16.157-7.302 16.348L.901 32.433c.225-.167 5.5-3.95 6.057-14.004H.036v-2.82H0z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
