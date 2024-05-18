import * as Location from 'expo-location'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {getCitiesByQuery, getCityByCoords} from '../../configs/api'
import CancelIcon from '../../icons/CancelIcon'
import MText from '../MText'

export default function MCityInput({
  style,
  value,
  setValue,
  placeId,
  setPlaceId,
  errors = [],
  clearErrors,
  info = [],
}) {
  const {t, i18n} = useTranslation()
  const input = useRef()
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsActive, setSuggestionsActive] = useState(false)

  useEffect(() => {
    const f = async () => {
      const suggestions = await getCitiesByQuery(value, i18n.language)
      setSuggestions([...suggestions.data])
    }
    if (value && value.length > 2 && !placeId) {
      const timeout = setTimeout(() => f(), 400)
      return () => clearTimeout(timeout)
    } else {
      setSuggestions([])
    }
  }, [value])

  useEffect(() => {
    autoLocate()
  }, [])

  const autoLocate = async () => {
    const permissions = await Location.requestForegroundPermissionsAsync()
    if (permissions.granted) {
      const position = await Location.getLastKnownPositionAsync()
      const result = await getCityByCoords(
        position?.coords?.longitude,
        position?.coords?.latitude,
        position?.coords?.longitude,
      )
      setPlaceId(result.data?.placeId)
      setValue(result.data?.localisedCity)
      Keyboard.dismiss()
    }
  }

  const suggestionsComponent = () => {
    const offset = (suggestions.length + 1) * 36
    const shift = StyleSheet.create({
      top: -offset,
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
              onPress={() => {
                setPlaceId(s.placeId)
                setValue(s.localisedCity)
                setSuggestions([])
                Keyboard.dismiss()
              }}>
              <MText>{s.localisedCity}</MText>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {suggestionsActive && suggestionsComponent()}
      <View>
        <TouchableWithoutFeedback onPress={() => input.current.focus()}>
          <View
            style={[
              styles.inputContainer,
              !suggestionsActive ? styles.inputContainerBordered : '',
            ]}>
            <TextInput
              placeholder={t('components.MCityInput.placeholder')}
              placeholderTextColor="#818195"
              onFocus={() => setSuggestionsActive(true)}
              onBlur={() => setSuggestionsActive(false)}
              autoCapitalize={false}
              ref={input}
              style={styles.textInput}
              value={value}
              onChangeText={t => {
                setPlaceId(null)
                setValue(t)
              }}
            />
            {value && (
              <TouchableOpacity
                style={{padding: 4}}
                onPress={() => {
                  setValue('')
                  setPlaceId(null)
                }}>
                <CancelIcon color="rgba(16, 16, 34, 0.4)" size={12} />
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
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: '#ccc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    fontWeight: '300',
  },
})
