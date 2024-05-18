import Svg, {Path} from 'react-native-svg'
import {View} from 'react-native'

export default function Checkmark({style, size = 12}) {
  return (
    <View style={style}>
      <Svg
        width={12}
        height={9}
        viewBox="0 0 12 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.215554 3.67941C0.502946 3.39202 0.968899 3.39202 1.25629 3.67941L4.47849 7.2697C4.76588 7.55709 4.76588 8.02304 4.47849 8.31043C4.1911 8.59783 3.72515 8.59783 3.43775 8.31043L0.215554 4.72015C-0.0718372 4.43276 -0.0718372 3.9668 0.215554 3.67941Z"
          fill="#A347FF"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.4065 0.215543C11.1191 -0.0718484 10.6532 -0.0718484 10.3658 0.215543L3.43779 7.26984C3.1504 7.55723 3.1504 8.02318 3.43779 8.31057C3.72518 8.59797 4.19114 8.59797 4.47853 8.31057L11.4065 1.25628C11.6939 0.968888 11.6939 0.502934 11.4065 0.215543Z"
          fill="#A347FF"
        />
      </Svg>
    </View>
  )
}
