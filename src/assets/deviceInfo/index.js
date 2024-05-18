import {Dimensions, Platform} from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const deviceInfo = {
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Dimensions.get('window').height,
  appVersion: DeviceInfo.getVersion(),
  hasNotch: DeviceInfo.hasNotch(),
  OS: Platform.OS,
  ios: Platform.OS === 'ios',
  android: Platform.OS === 'android',
  small_screen: Dimensions.get('window').height < 780,
}


export const fullScreen = {
  width: deviceInfo.deviceWidth,
  height: deviceInfo.deviceHeight,
}
