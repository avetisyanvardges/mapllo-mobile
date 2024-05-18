import {StyleSheet, TouchableOpacity, View,} from 'react-native'
import {useTranslation} from 'react-i18next'
import MText from '../MText'
import {useNavigation} from '@react-navigation/native'

export default function MMapInput({style, currentScreen, address, onMapOpen}) {
  let {t} = useTranslation()
  const nav = useNavigation()

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => {
          if (onMapOpen) {
            onMapOpen()
            setTimeout(
              () => nav.push('AddressSelector', {currentScreen, address}),
              700,
            )
          } else {
            nav.push('AddressSelector', {currentScreen, address})
          }
        }}>
        <View style={styles.inputContainer}>
          {!address?.address && (
            <MText style={styles.placeholder}>
              {t('components.MMapInput.placeholder')}
            </MText>
          )}
          <MText>{address?.address}</MText>
        </View>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {},
  suggestionContainer: {
    position: 'absolute',
    backgroundColor: '#f3f3f3',
    borderColor: '#f3f3f3',
    justifyContent: 'flex-end',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  suggestionCurrentItem: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    borderColor: '#ccc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 5,
  },
  suggestionItem: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  suggestionItemDivider: {
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
  },
  inputContainer: {
    height: 35,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    paddingLeft: 15,
  },
  inputContainerBordered: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  error: {
    color: 'red',
    paddingHorizontal: 8,
  },
  info: {
    color: 'green',
    paddingHorizontal: 8,
  },
  placeholder: {
    color: '#818195',
  },
  textInput: {
    flex: 1,
  },
})
