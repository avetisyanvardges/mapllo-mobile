import * as Location from 'expo-location'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {normalize} from '../../assets/normalize'
import {
  getAddressByCoords,
  getAddressesByQuery,
  getLocationByPlaceId,
} from '../../configs/api'
import CancelIcon from '../../icons/CancelIcon'
import LensIcon from '../../icons/LensIcon'
import MText from '../MText'

export default function MAddressInput({
  auto,
  style,
  value,
  setValue,
  setLocation,
  errors = [],
  info = [],
}) {
  const {t, i18n} = useTranslation()
  const input = useRef()
  const [inputText, setInputText] = useState(value?.address)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsActive, setSuggestionsActive] = useState(false)

  useEffect(() => {
    if (inputText !== value?.address) {
      setInputText(value.address)
    }
  }, [value])

  useEffect(() => {
    const f = async () => {
      const pos = await Location.getLastKnownPositionAsync()
      const suggestions = await getAddressesByQuery(
        inputText,
        pos?.coords?.latitude,
        pos?.coords?.longitude,
      )
      setSuggestions([...suggestions.data])
    }
    if (inputText && inputText.length > 2) {
      const timeout = setTimeout(() => f(), 400)
      return () => clearTimeout(timeout)
    } else {
      setSuggestions([])
    }
  }, [inputText])

  useEffect(() => {
    if (auto) {
      autoLocate()
    }
  }, [])

  const autoLocate = async () => {
    const permissions = await Location.requestForegroundPermissionsAsync()
    if (permissions.granted) {
      const position = await Location.getLastKnownPositionAsync()
      const result = await getAddressByCoords(
        position?.coords?.longitude,
        position?.coords?.latitude,
        i18n.language,
      )
      setValue(result?.data)
      setInputText(result?.data?.address)
      setLocation({
        ...position.coords,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      })
      Keyboard.dismiss()
    }
  }

  const suggestionPressed = async s => {
    getLocationByPlaceId(s.placeId).then(r => {
      setValue(r.data)
      setSuggestions([])
      setLocation({...r.data, latitudeDelta: 0.02, longitudeDelta: 0.02})
      Keyboard.dismiss()
    })
  }

  const suggestionsComponent = () => {
    const shift = StyleSheet.create({
      top: normalize(10),
    })
    return (
      <View style={[styles.suggestionContainer, shift]}>
        <TouchableOpacity
          style={[styles.suggestionCurrentItem, styles.suggestionItemDivider]}
          onPress={() => autoLocate()}>
          <MText>{t('UnauthorizedStack.Register.03.currentPos')}</MText>
        </TouchableOpacity>
        {suggestions.map((s, i) => {
          const sss = [styles.suggestionItem]
          if (i !== suggestions.length - 1) {
            sss.push(styles.suggestionItemDivider)
          }
          return (
            <TouchableOpacity
              key={i}
              style={sss}
              onPress={() => suggestionPressed(s)}>
              <MText>{s.address}</MText>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <View>
        <TouchableWithoutFeedback onPress={() => input.current.focus()}>
          <View
            style={[
              styles.inputContainer,
              !suggestionsActive ? styles.inputContainerBordered : '',
            ]}>
            <View style={styles.lens}>
              <LensIcon />
            </View>
            <TextInput
              placeholder={t('components.MMapInput.placeholder')}
              placeholderTextColor="#818195"
              onFocus={() => setSuggestionsActive(true)}
              onBlur={() => setSuggestionsActive(false)}
              autoCapitalize={false}
              ref={input}
              style={styles.textInput}
              value={inputText}
              onChangeText={t => {
                setInputText(t)
              }}
            />
            {value && (
              <TouchableOpacity onPress={() => setInputText('')}>
                <CancelIcon color="#D8D8EC" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        {errors.map((e, i) => (
          <MText key={i} style={styles.error}>
            {e}
          </MText>
        ))}
        {info.map((e, i) => (
          <MText key={i} style={styles.info}>
            {e}
          </MText>
        ))}
      </View>
      {suggestionsActive && suggestionsComponent()}
    </View>
  )
}
const styles = StyleSheet.create({
  lens: {
    marginLeft: 5,
    marginRight: 10,
  },
  container: {},
  suggestionContainer: {
    position: 'relative',
    backgroundColor: '#f3f3f3',
    borderColor: '#f3f3f3',
    justifyContent: 'flex-end',
    width: '100%',
    borderRadius: 10,
    zIndex: 1,
  },
  suggestionCurrentItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  inputContainerBordered: {},
  error: {
    color: 'red',
    paddingHorizontal: 8,
  },
  info: {
    color: 'green',
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    fontWeight: '300',
  },
})
