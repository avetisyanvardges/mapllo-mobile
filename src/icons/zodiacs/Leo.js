import Svg, {Path} from 'react-native-svg'

import {normalize} from '../../assets/normalize'

export default function LeoIcon({width, height, color}) {
  return (
    <Svg
      width={width || normalize(27)}
      height={height || normalize(34)}
      viewBox="0 0 27 34"
      fill="none">
      <Path
        d="M20.902 30.593c-1.324-1.214-1.407-4.773 2.754-10.806 3.553-5.158 4.304-11.18 1.908-15.299l.023-.023C23.811 1.384 20.544-.191 16.43.019c-3.85.198-6.76 2.065-8.167 5.263-1.204 2.742-1.157 6.243-.084 9.347-.322-.035-.643-.07-.977-.07-3.97 0-7.202 3.162-7.202 7.048s3.231 7.049 7.202 7.049c3.97 0 7.201-3.163 7.201-7.049 0-1.68-.62-3.244-1.633-4.457-2.48-2.86-3.315-7.586-1.908-10.76.99-2.24 2.91-3.454 5.711-3.594 3.053-.163 5.306.899 6.546 3.046 1.849 3.186 1.121 8.157-1.8 12.393-1.645 2.38-6.653 10.456-2.337 14.389.942.851 2.158 1.283 3.446 1.283 1.454 0 2.993-.537 4.364-1.587l-1.753-2.182c-1.455 1.108-3.195 1.307-4.125.455h-.012zm-9.324-8.997c0 2.357-1.956 4.27-4.364 4.27-2.409 0-4.364-1.913-4.364-4.27 0-2.358 1.955-4.271 4.364-4.271 2.408 0 4.364 1.913 4.364 4.27z"
        fill={color || '#fff'}
      />
    </Svg>
  )
}
