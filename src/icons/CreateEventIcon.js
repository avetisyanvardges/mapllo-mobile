import Svg, {Path} from 'react-native-svg'

export default function CreateEventIcon({isAbs, active}) {
  return (
    <Svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M23.3395 0.25C28.6945 0.25 31.75 3.274 31.75 8.64475V23.3553C31.75 28.6945 28.7103 31.75 23.3553 31.75H8.64475C3.274 31.75 0.25 28.6945 0.25 23.3553V8.64475C0.25 3.274 3.274 0.25 8.64475 0.25H23.3395ZM15.9843 8.92825C15.2598 8.92825 14.677 9.511 14.677 10.2355V14.677H10.2198C9.87325 14.677 9.5425 14.8187 9.2905 15.055C9.05425 15.307 8.9125 15.6362 8.9125 15.9843C8.9125 16.7087 9.49525 17.2915 10.2198 17.3073H14.677V21.7645C14.677 22.489 15.2598 23.0718 15.9843 23.0718C16.7087 23.0718 17.2915 22.489 17.2915 21.7645V17.3073H21.7645C22.489 17.2915 23.0718 16.7087 23.0718 15.9843C23.0718 15.2598 22.489 14.677 21.7645 14.677H17.2915V10.2355C17.2915 9.511 16.7087 8.92825 15.9843 8.92825Z"
        fill={active ? '#A347FF' : isAbs ? '#fff' : '#818195'}
      />
    </Svg>
  )
}
