import Svg, {Path} from 'react-native-svg'

export default function SmallHeartIcon({size = 18}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3.53676 8.71036e-05C3.89156 0.0108774 4.2351 0.0728268 4.56793 0.186025H4.60116C4.62369 0.196726 4.64058 0.208552 4.65185 0.219253C4.77631 0.259238 4.89401 0.304292 5.00665 0.366242L5.22066 0.461982C5.30513 0.507036 5.40651 0.590949 5.46282 0.625303C5.51914 0.658531 5.58109 0.692884 5.63178 0.731744C6.25746 0.253606 7.01719 -0.00545474 7.80001 8.71036e-05C8.15537 8.71036e-05 8.51017 0.0502998 8.84751 0.163498C10.9262 0.83931 11.6752 3.12018 11.0495 5.11382C10.6947 6.13261 10.1147 7.06241 9.35494 7.82214C8.26744 8.87528 7.07407 9.81015 5.78947 10.6155L5.64867 10.7005L5.50224 10.6099C4.21313 9.81015 3.013 8.87528 1.91537 7.81651C1.16072 7.05678 0.580081 6.13261 0.219648 5.11382C-0.416741 3.12018 0.332284 0.83931 2.4335 0.151672C2.59682 0.0953539 2.76521 0.0559315 2.93416 0.0339676H3.00174C3.15999 0.0108774 3.31712 8.71036e-05 3.47481 8.71036e-05H3.53676Z"
        fill="#F3267D"
      />
    </Svg>
  )
}
