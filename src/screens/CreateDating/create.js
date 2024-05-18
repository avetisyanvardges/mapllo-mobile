import {KeyboardAvoidingView, StyleSheet, TouchableOpacity, View,} from 'react-native'
import MMapInput from '../../components/MMapInput'
import MDateInput from '../../components/MDateInput'
import MInput from '../../components/MInput'
import MText from '../../components/MText'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

const minDate = new Date()

export default function CreateDatingNested({
  route,
  onFinish,
  button,
  data,
  onMapOpen,
  currentScreen,
  onChange = data => {},
}) {
  const [inCreation, setInCreation] = useState(false)
  const [location, setLocation] = useState(
    data ? {latitude: data.latitude, longitude: data.longitude} : null,
  )
  const [date, setDate] = useState(data?.date ? data.date : minDate)
  const [description, setDescription] = useState(data?.description)
  const {t} = useTranslation()

  useEffect(() => {
    if (route.params?.address) {
      setLocation(route.params?.address)
    }
  }, [route.params?.address])

  const save = () => {
    if (!inCreation) {
      setInCreation(true)
      onFinish({
        data: {
          description,
          date: date.toISOString(),
          type: 'DATING',
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      })
    }
  }

  useEffect(() => {
    onChange({location, date, description})
  }, [location, date, description])

  const canGoNext = description
  return (
    <KeyboardAvoidingView behavior={'padding'}>
      <View style={styles.sheet}>
        <View style={styles.sheetContent}>
          <MMapInput
            currentScreen={currentScreen}
            address={location?.address}
            onMapOpen={onMapOpen}
          />
          <MDateInput
            placeholder={'CreateEvent.date'}
            style={{marginBottom: 5}}
            minDate={minDate}
            value={date}
            setValue={setDate}
          />
          <MInput
            placeholder={'CreateEvent.description'}
            multiline
            value={description}
            mandatory
            setValue={setDescription}
          />
          <TouchableOpacity
            disabled={!canGoNext}
            style={[styles.buttonStyle, canGoNext ? styles.buttonActive : '']}
            onPress={save}>
            <MText style={styles.nextButtonText}>{t(button)}</MText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginVertical: 8,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: -20,
  },
  sheetContent: {
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  buttonStyle: {
    height: 38,
    marginVertical: 10,
    backgroundColor: 'rgba(0.06, 0.06, 0.13, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#F3267D',
  },
  nextButtonText: {
    color: '#fff',
  },
})
