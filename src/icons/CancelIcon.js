import Svg, {Path} from 'react-native-svg'

export default function CancelIcon({color = 'white', size = 15}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.7929 0.292893C13.1834 -0.0976311 13.8166 -0.0976311 14.2071 0.292893C14.5976 0.683417 14.5976 1.31658 14.2071 1.70711L8.66421 7.25L14.2071 12.7929C14.5976 13.1834 14.5976 13.8166 14.2071 14.2071C13.8166 14.5976 13.1834 14.5976 12.7929 14.2071L7.25 8.66421L1.70711 14.2071C1.31658 14.5976 0.683418 14.5976 0.292894 14.2071C-0.0976312 13.8166 -0.0976312 13.1834 0.292894 12.7929L5.83579 7.25L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7.25 5.83579L12.7929 0.292893Z"
        fill={color}
      />
    </Svg>
  )
}