import Svg, {Circle, Path} from 'react-native-svg'

export default function CompasSimpleIcon({
  style,
  size = 23,
  active,
  inverted,
  transparent,
}) {
  if (!active && transparent) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5294 32.9412C25.5934 32.9412 32.9412 25.5934 32.9412 16.5294C32.9412 7.46547 25.5934 0.117676 16.5294 0.117676C7.46547 0.117676 0.117676 7.46547 0.117676 16.5294C0.117676 25.5934 7.46547 32.9412 16.5294 32.9412ZM23.3522 11.287C23.6563 10.3153 22.7433 9.40236 21.7716 9.70644L13.2122 12.3851C12.8176 12.5086 12.5086 12.8176 12.3851 13.2122L9.70644 21.7716C9.40236 22.7433 10.3153 23.6563 11.287 23.3522L19.8464 20.6735C20.241 20.5501 20.5501 20.241 20.6735 19.8464L23.3522 11.287Z"
          fill="white"
        />
      </Svg>
    )
  }
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      xmlns="http://www.w3.org/2000/svg"
      style={style}>
      <Circle
        cx="11.353"
        cy="11.3533"
        r="10.9412"
        fill={active ? '#A347FF' : inverted ? '#818195' : '#fff'}
      />
      <Path
        d="M14.848 6.80429C15.4958 6.60157 16.1044 7.21023 15.9017 7.858L14.1159 13.5643C14.0336 13.8274 13.8276 14.0334 13.5645 14.1157L7.85825 15.9015C7.21048 16.1042 6.60182 15.4955 6.80454 14.8478L8.59032 9.14147C8.67264 8.87841 8.87866 8.6724 9.14171 8.59008L14.848 6.80429Z"
        fill={
          active
            ? 'white'
            : transparent
            ? 'rgba(0,0,0,0.3)'
            : inverted
            ? '#fff'
            : '#818195'
        }
      />
    </Svg>
  )
}
