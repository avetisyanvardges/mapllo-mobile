import Svg, {Path} from 'react-native-svg'

export default function OptionsIcon({size = 16}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12.8116 9.68284C14.4125 9.68284 15.7139 11.0351 15.7139 12.6985C15.7139 14.361 14.4125 15.7142 12.8116 15.7142C11.2107 15.7142 9.90927 14.361 9.90927 12.6985C9.90927 11.0351 11.2107 9.68284 12.8116 9.68284ZM12.8116 11.0973C11.9612 11.0973 11.2706 11.8149 11.2706 12.6985C11.2706 13.5812 11.9612 14.2997 12.8116 14.2997C13.662 14.2997 14.3526 13.5812 14.3526 12.6985C14.3526 11.8149 13.662 11.0973 12.8116 11.0973ZM6.54745 11.991C6.92317 11.991 7.22811 12.3078 7.22811 12.6982C7.22811 13.0886 6.92317 13.4055 6.54745 13.4055H0.96694C0.591216 13.4055 0.28628 13.0886 0.28628 12.6982C0.28628 12.3078 0.591216 11.991 0.96694 11.991H6.54745ZM3.18798 0.285645C4.78889 0.285645 6.09032 1.63884 6.09032 3.30133C6.09032 4.96383 4.78889 6.31702 3.18798 6.31702C1.58797 6.31702 0.285645 4.96383 0.285645 3.30133C0.285645 1.63884 1.58797 0.285645 3.18798 0.285645ZM3.18798 1.70013C2.33852 1.70013 1.64697 2.41869 1.64697 3.30133C1.64697 4.18397 2.33852 4.90253 3.18798 4.90253C4.03835 4.90253 4.72899 4.18397 4.72899 3.30133C4.72899 2.41869 4.03835 1.70013 3.18798 1.70013ZM15.0336 2.59428C15.4093 2.59428 15.7142 2.91112 15.7142 3.30152C15.7142 3.69192 15.4093 4.00876 15.0336 4.00876H9.45214C9.07642 4.00876 8.77148 3.69192 8.77148 3.30152C8.77148 2.91112 9.07642 2.59428 9.45214 2.59428H15.0336Z"
        fill="rgba(16, 16, 34, 0.4)"
        fill-opacity="0.4"
      />
    </Svg>
  )
}