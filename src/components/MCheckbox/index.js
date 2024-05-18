import {StyleSheet, TouchableOpacity} from 'react-native'
import CheckboxCheckmarkIcon from '../../icons/CheckboxCheckmarkIcon'
import * as Haptics from 'expo-haptics'

export default function MCheckbox({style, checked, setChecked}) {
  return (
    <TouchableOpacity
      style={[styles.square, style]}
      onPress={() => {
        Haptics.selectionAsync().then(() => setChecked(!checked))
      }}>
      {checked && <CheckboxCheckmarkIcon />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  square: {
    backgroundColor: '#F3F3F4',
    height: 20,
    width: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
