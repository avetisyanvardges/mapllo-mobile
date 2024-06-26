import {View} from 'react-native'
import {ClipPath, Defs, G, Path, Rect, Svg} from 'react-native-svg'

export default function DeletedAva({size = 50, style}) {
  return (
    <View style={[style, {overflow: 'hidden'}]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <G clip-path="url(#clip0_7410_345)">
          <Rect width="60" height="60" rx="14" fill="#A0A0A7" />
          <G clip-path="url(#clip1_7410_345)">
            <Path
              d="M23.688 11.554C30.0945 7.46129 38.7351 8.0389 44.1877 13.5386C53.8433 23.2791 46.177 40.9088 30.3036 40.8693C20.8469 40.8446 11.5535 34.3279 11.5535 22.1634C11.5535 12.2303 19.4748 5.36804 28.9723 4.02521C29.9925 3.88204 30.069 4.31648 30.1404 4.82992C30.1965 5.25943 30.4311 5.69388 29.3447 5.89135C15.8942 8.38449 10.0488 23.8913 19.5156 32.7925C23.9482 36.9592 31.6859 38.1392 37.2763 35.5917C43.239 32.8764 46.8248 25.4168 44.7335 19.3C43.5042 15.701 40.5101 12.8425 36.1949 11.6379C32.1603 10.5123 27.7329 11.1047 24.6214 12.9906C24.04 13.3411 23.6727 13.1091 23.3565 12.7487C23.0249 12.3686 22.9535 12.0082 23.6778 11.5441L23.688 11.554Z"
              fill="white"
            />
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.6784 18.0017C22.1273 16.9452 22.9434 16.3528 24.4124 16.3528C25.8763 16.3528 26.6924 16.9452 27.1463 18.0017C27.891 19.7444 27.891 25.1306 27.1463 26.8733C26.6975 27.9298 25.8814 28.5222 24.4124 28.5222C22.9485 28.5222 22.1324 27.9298 21.6784 26.8733C20.9337 25.1306 20.9337 19.7444 21.6784 18.0017Z"
              fill="white"
            />
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M32.8591 18.0017C33.3079 16.9452 34.124 16.3528 35.593 16.3528C37.0569 16.3528 37.873 16.9452 38.327 18.0017C39.0717 19.7444 39.0717 25.1306 38.327 26.8733C37.8781 27.9298 37.062 28.5222 35.593 28.5222C34.1291 28.5222 33.313 27.9298 32.8591 26.8733C32.1144 25.1306 32.1144 19.7444 32.8591 18.0017Z"
              fill="white"
            />
            <Path
              d="M59 61.9991C57.8319 52.1747 48.9108 43.5352 30.4769 43.5648C30.3188 43.5648 30.1606 43.5648 29.9974 43.5697C29.8393 43.5697 29.6812 43.5648 29.518 43.5648C11.084 43.5352 2.16293 52.1698 0.994873 61.9991C2.60159 61.9991 1.53045 61.9991 3.13717 61.9991C6.66175 51.3058 19.2962 47.7513 29.421 47.7513C29.6098 47.7513 29.7985 47.7513 29.9923 47.7562C30.1861 47.7513 30.3749 47.7513 30.5636 47.7513C40.6885 47.7513 53.3229 51.3009 56.8475 61.9991C58.4542 61.9991 57.3831 61.9991 58.9898 61.9991H59Z"
              fill="white"
            />
          </G>
        </G>
        <Defs>
          <ClipPath id="clip0_7410_345">
            <Rect width="60" height="60" rx="14" fill="white" />
          </ClipPath>
          <ClipPath id="clip1_7410_345">
            <Rect
              width="58"
              height="58"
              fill="white"
              transform="translate(1 4)"
            />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  )
}
