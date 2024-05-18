import Svg, {Path, RadialGradient, Stop,} from 'react-native-svg'

export default function FireIcon() {
  return (
    <Svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <RadialGradient
        id="a"
        cx="68.8839"
        cy="124.2963"
        gradientTransform="matrix(-1 -.00434301 -.00712592 1.6408 131.9857 -79.3452)"
        gradientUnits="userSpaceOnUse"
        r="70.587">
        <Stop offset=".3144" stop-color="#ff9800" />
        <Stop offset=".6616" stop-color="#ff6d00" />
        <Stop offset=".9715" stop-color="#f44336" />
      </RadialGradient>
      <RadialGradient
        id="b"
        cx="64.9211"
        cy="54.0621"
        gradientTransform="matrix(-.0101 .9999 .7525 .00760378 26.1538 -11.2668)"
        gradientUnits="userSpaceOnUse"
        r="73.8599">
        <Stop offset=".2141" stop-color="#fff176" />
        <Stop offset=".3275" stop-color="#fff27d" />
        <Stop offset=".4868" stop-color="#fff48f" />
        <Stop offset=".6722" stop-color="#fff7ad" />
        <Stop offset=".7931" stop-color="#fff9c4" />
        <Stop offset=".8221" stop-color="#fff8bd" stop-opacity=".804" />
        <Stop offset=".8627" stop-color="#fff6ab" stop-opacity=".529" />
        <Stop offset=".9101" stop-color="#fff38d" stop-opacity=".2088" />
        <Stop offset=".9409" stop-color="#fff176" stop-opacity="0" />
      </RadialGradient>
      <Path
        d="m35.56 40.73c-.57 6.08-.97 16.84 2.62 21.42 0 0-1.69-11.82 13.46-26.65 6.1-5.97 7.51-14.09 5.38-20.18-1.21-3.45-3.42-6.3-5.34-8.29-1.12-1.17-.26-3.1 1.37-3.03 9.86.44 25.84 3.18 32.63 20.22 2.98 7.48 3.2 15.21 1.78 23.07-.9 5.02-4.1 16.18 3.2 17.55 5.21.98 7.73-3.16 8.86-6.14.47-1.24 2.1-1.55 2.98-.56 8.8 10.01 9.55 21.8 7.73 31.95-3.52 19.62-23.39 33.9-43.13 33.9-24.66 0-44.29-14.11-49.38-39.65-2.05-10.31-1.01-30.71 14.89-45.11 1.18-1.08 3.11-.12 2.95 1.5z"
        fill="url(#a)"
      />
      <Path
        d="m76.11 77.42c-9.09-11.7-5.02-25.05-2.79-30.37.3-.7-.5-1.36-1.13-.93-3.91 2.66-11.92 8.92-15.65 17.73-5.05 11.91-4.69 17.74-1.7 24.86 1.8 4.29-.29 5.2-1.34 5.36-1.02.16-1.96-.52-2.71-1.23-2.15-2.05-3.7-4.72-4.44-7.6-.16-.62-.97-.79-1.34-.28-2.8 3.87-4.25 10.08-4.32 14.47-.22 13.57 10.99 24.57 24.55 24.57 17.09 0 29.54-18.9 19.72-34.7-2.85-4.6-5.53-7.61-8.85-11.88z"
        fill="url(#b)"
      />
    </Svg>
  )
}
