import RNDateTimePicker from '@react-native-community/datetimepicker'
import * as Haptics from 'expo-haptics'
import {t} from 'i18next'
import moment from 'moment'
import * as React from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import DatePicker from '../DatePicker'
import MText from '../MText'

export default function MDateInput({
  placeholder,
  style,
  value,
  setValue,
  maxDate,
  minDate,
  mandatory,
  errors = [],
  clearErrors,
  info = [],
  visible,
  setVisible,
}) {
  const {t} = useTranslation()
  const [date, setDate] = useState(value == null ? maxDate : value)

  const {i18n} = useTranslation()

  const androidPickerComponent = (
    <View style={{alignItems: 'center'}}>
      <DatePicker
        date={date}
        mode="date"
        androidVariant="iosClone"
        locale={i18n.language}
        // style={{backgroundColor: 'purple'}}
        fadeToColor="none"
        textColor="#000"
        minimumDate={deviceInfo?.ios ? minDate : undefined}
        maximumDate={deviceInfo?.ios ? maxDate : undefined}
        onDateChange={d => {
          if (d !== date) {
            setDate(d)
            // acceptDate()
          }
        }}
      />
    </View>
  )

  const pickerComponent = (
    <RNDateTimePicker
      themeVariant="dark"
      value={date}
      display="spinner"
      mode="date"
      textColor="#000"
      onChange={(e, d) => setDate(d)}
      locale={i18n.language}
      minimumDate={minDate}
      maximumDate={maxDate}
    />
  )

  const acceptDate = () => {
    setValue(date)
    setVisible(false)
  }

  const cancel = () => {
    setDate(value == null ? maxDate : value)
    setVisible(false)
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
        <View style={styles.inputContainer}>
          {!value && (
            <View style={{flexDirection: 'row'}}>
              <>
                <MText style={styles.placeholder}>{t(placeholder)}</MText>
                {mandatory && <MText style={{color: '#A347FF'}}>*</MText>}
              </>
            </View>
          )}
          <MText>{value ? moment(value).format('DD.MM.YYYY') : null}</MText>
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
      {visible ? (
        <View>
          <DatePicker value={date} onChange={setDate} />
          <TouchableOpacity
            style={{
              height: 38,
              marginBottom: 10,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#A347FF',
            }}
            onPress={() => {
              Haptics.selectionAsync()
              acceptDate()
            }}>
            <MText style={{color: '#fff', fontSize: normalize(14)}}>
              {t('UnauthorizedStack.Register.next')}
            </MText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}
const styles = StyleSheet.create({
  modal: {},
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
  dateInput: {
    flex: 1,
  },
  pickerButton: {
    color: '#fff',
  },
  pickerButtonContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#818195',
  },
})
