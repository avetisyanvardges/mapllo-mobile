import {View} from 'react-native'

export default function MView({children, style}) {
  return (
    <View style={{borderColor: 'red', borderWidth: 1, flexDirection: 'row'}}>
      <View style={[{flex: 1}, style]}>{children}</View>
    </View>
  )
}
