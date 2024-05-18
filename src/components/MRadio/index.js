import {TouchableOpacity, View} from 'react-native'

export default function MRadio({current, value, activate}) {
  return (
    <TouchableOpacity
      disabled={current === value}
      onPress={activate}
      style={{padding: 10}}>
      <View
        style={{
          backgroundColor: '#F3F3F4',
          borderRadius: 20,
          height: 10,
          width: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {current === value && (
          <View
            style={{
              backgroundColor: '#A347FF',
              height: 5,
              width: 5,
              borderRadius: 20,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}
