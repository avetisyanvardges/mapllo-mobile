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
  Animated,
} from 'react-native'

import {Styles} from './styles'
import {normalize} from '../../assets/normalize'
import {getCitiesByQuery, getCityByCoords} from '../../configs/api'
import CancelIcon from '../../icons/CancelIcon'
import SearchIcon from '../../icons/SearchIcon'
import MText from '../MText'

export default function MCityFilterInput({
  style,
  value,
  setValue,
  placeId,
  setPlaceId,
  errors = [],
  clearErrors,
  info = [],
  filters = false,
  focused,
  setFocused,
  setExpanded,
}) {
  const styles = Styles()
  const {t, i18n} = useTranslation()
  const input = useRef()
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsActive, setSuggestionsActive] = useState(false)
  const animation = new Animated.Value(1)
  const inputRange = [0, 1]
  const outputRange = ['50%', '100%']
  const animatedWidth = animation.interpolate({inputRange, outputRange})

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
    if (suggestionsActive) {
      if (!focused) {
        setFocused(true)
      }
    }
  }, [suggestionsActive])

  useEffect(() => {
    if (!filters) {
      autoLocate()
    }
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
      setExpanded(false)
    }
  }

  const suggestionsComponent = () => {
    return (
      <View style={[styles.suggestionContainer, {marginTop: normalize(44)}]}>
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
                setExpanded(false)
              }}>
              <MText>{s.localisedCity}</MText>
            </TouchableOpacity>
          )
        })}
        <TouchableOpacity
          style={[styles.suggestionCurrentItem, styles.suggestionItemDivider]}
          onPress={() => autoLocate()}>
          <MText>{t('UnauthorizedStack.Register.03.currentPos')}</MText>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[style]}>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            input.current.focus()
          }}>
          <Animated.View
            style={[
              styles.inputContainer,
              !suggestionsActive ? styles.inputContainerBordered : '',
              {
                width: animatedWidth,
                height: focused ? '100%' : 35,
                backgroundColor: focused ? '#fff' : '#f3f3f3',
              },
            ]}>
            {focused ? (
              <View style={{paddingRight: normalize(8)}}>
                <SearchIcon size={normalize(19)} />
              </View>
            ) : null}
            <TextInput
              placeholder={t('components.MCityInput.placeholder')}
              placeholderTextColor="#818195"
              onFocus={() => {
                setSuggestionsActive(true)
              }}
              onBlur={() => setSuggestionsActive(false)}
              autoCapitalize={false}
              ref={input}
              style={[
                styles.textInput,
                {
                  paddingVertical: focused ? 10 : 0,
                },
              ]}
              value={value}
              onChangeText={t => {
                setValue(t)
              }}
            />
            {value && (
              <TouchableOpacity
                style={{
                  paddingHorizontal: normalize(8),
                  paddingVertical: 10,
                }}
                onPress={() => {
                  setValue('')
                  setPlaceId(null)
                }}>
                <CancelIcon color="rgba(16, 16, 34, 0.4)" size={14.5} />
              </TouchableOpacity>
            )}
          </Animated.View>
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
