import {StyleSheet, TextInput, TouchableWithoutFeedback, View,} from 'react-native'
import {useTranslation} from 'react-i18next'
import {useRef} from 'react'
import MText from '../MText'

export default function MInput({
  placeholder,
  style,
  value,
  setValue,
  mandatory,
  errors = [],
  clearErrors,
  children,
  info = [],
  multiline,
  withEmptyLine,
}) {
  let {t} = useTranslation()
  const input = useRef()
  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={() => input.current.focus()}>
        {multiline ? (
          <View style={styles.multilineInputContainer}>
            <TextInput
              allowFontScaling={false}
              multiline={true}
              onFocus={clearErrors}
              placeholder={t(placeholder)}
              autoCapitalize={false}
              ref={input}
              style={styles.multilineTextInput}
              value={value}
              onChangeText={setValue}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            {children}
            {/*{!value && <MText style={[styles.placeholder, children ? {marginLeft: 10} : {}]}>{t(placeholder)}</MText>}*/}
            {children && <View style={{width: 10}}> </View>}
            <TextInput
              allowFontScaling={false}
              onFocus={clearErrors}
              autoCapitalize={false}
              ref={input}
              style={styles.textInput}
              value={value}
              onChangeText={setValue}
              placeholder={t(placeholder)}
              placeholderTextColor={'#818195'}
            />
          </View>
        )}
      </TouchableWithoutFeedback>
      {withEmptyLine && errors.length === 0 && info.length === 0 && (
        <MText> </MText>
      )}
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
  )
}
const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    height: 35,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingLeft: 15,
  },
  multilineInputContainer: {},
  error: {
    color: 'red',
    paddingHorizontal: 8,
    fontSize: 12,
  },
  info: {
    color: 'green',
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholder: {
    color: '#818195',
    fontSize: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '300',
  },
  multilineTextInput: {
    paddingBottom: 5,
    maxHeight: 200,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    paddingTop: 8,
    paddingHorizontal: 8,
    minHeight: 150,
    paddingLeft: 15,
    fontWeight: '300',
    textAlignVertical: 'top',
  },
})
