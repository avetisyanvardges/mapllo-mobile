import Svg, {Path} from 'react-native-svg'

export default function InstagramIcon({color = 'white', style, size = 25}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}>
      <Path
        d="M10.1968 19.9999C10.1306 19.9999 10.0644 19.9999 9.99771 19.9996C8.43003 20.0035 6.98151 19.9636 5.57282 19.8779C4.28131 19.7993 3.10242 19.353 2.16339 18.5873C1.25732 17.8485 0.63858 16.8495 0.324402 15.6184C0.0509644 14.5466 0.0364685 13.4945 0.022583 12.4769C0.0125122 11.7468 0.00213623 10.8816 0 10.0018C0.00213623 9.11829 0.0125122 8.25312 0.022583 7.52298C0.0364685 6.50553 0.0509644 5.45343 0.324402 4.38151C0.63858 3.15043 1.25732 2.15143 2.16339 1.4126C3.10242 0.646916 4.28131 0.200597 5.57297 0.122014C6.98166 0.0364124 8.43048 -0.00356563 10.0015 0.000249067C11.5697 -0.00310787 13.0177 0.0364124 14.4264 0.122014C15.7179 0.200597 16.8968 0.646916 17.8358 1.4126C18.7421 2.15143 19.3607 3.15043 19.6748 4.38151C19.9483 5.45328 19.9628 6.50553 19.9767 7.52298C19.9867 8.25312 19.9973 9.11829 19.9992 9.99811V10.0018C19.9973 10.8816 19.9867 11.7468 19.9767 12.4769C19.9628 13.4944 19.9484 14.5465 19.6748 15.6184C19.3607 16.8495 18.7421 17.8485 17.8358 18.5873C16.8968 19.353 15.7179 19.7993 14.4264 19.8779C13.0774 19.96 11.6916 19.9999 10.1968 19.9999ZM9.99771 18.4371C11.5399 18.4408 12.9559 18.4019 14.3315 18.3183C15.3081 18.2589 16.1548 17.942 16.8485 17.3763C17.4896 16.8534 17.9312 16.132 18.1609 15.232C18.3885 14.3398 18.4016 13.3819 18.4143 12.4555C18.4242 11.7303 18.4346 10.8712 18.4367 9.99994C18.4346 9.12851 18.4242 8.2696 18.4143 7.54435C18.4016 6.61799 18.3885 5.66004 18.1609 4.7677C17.9312 3.86774 17.4896 3.14631 16.8485 2.62339C16.1548 2.0579 15.3081 1.74097 14.3315 1.68161C12.9559 1.59784 11.5399 1.55924 10.0014 1.5626C8.45947 1.55893 7.04331 1.59784 5.66773 1.68161C4.69116 1.74097 3.84445 2.0579 3.15079 2.62339C2.50961 3.14631 2.06802 3.86774 1.83838 4.7677C1.61072 5.66004 1.5976 6.61783 1.58493 7.54435C1.57501 8.27021 1.56464 9.12973 1.5625 10.0018C1.56464 10.87 1.57501 11.7297 1.58493 12.4555C1.5976 13.3819 1.61072 14.3398 1.83838 15.232C2.06802 16.132 2.50961 16.8534 3.15079 17.3763C3.84445 17.9418 4.69116 18.2588 5.66773 18.3181C7.04331 18.4019 8.45978 18.441 9.99771 18.4371ZM9.96048 14.8828C7.26822 14.8828 5.07767 12.6924 5.07767 9.99994C5.07767 7.30753 7.26822 5.11713 9.96048 5.11713C12.6529 5.11713 14.8433 7.30753 14.8433 9.99994C14.8433 12.6924 12.6529 14.8828 9.96048 14.8828ZM9.96048 6.67963C8.12973 6.67963 6.64017 8.16919 6.64017 9.99994C6.64017 11.8307 8.12973 13.3203 9.96048 13.3203C11.7914 13.3203 13.2808 11.8307 13.2808 9.99994C13.2808 8.16919 11.7914 6.67963 9.96048 6.67963ZM15.3902 3.55463C14.743 3.55463 14.2183 4.07923 14.2183 4.72651C14.2183 5.37378 14.743 5.89838 15.3902 5.89838C16.0374 5.89838 16.562 5.37378 16.562 4.72651C16.562 4.07923 16.0374 3.55463 15.3902 3.55463Z"
        fill={color}
      />
    </Svg>
  )
}