import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import MMapInput from "../../components/MMapInput";
import MDateInput from "../../components/MDateInput";
import MInput from "../../components/MInput";
import * as Haptics from "expo-haptics";
import MText from "../../components/MText";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { getEventCount } from "../../configs/api";
import MPopup from './../../components/MPopup';

const minDate = new Date()

export default function CreateEventNested({ route, onFinish, button, data, onMapOpen, currentScreen, onChange = (data) => { } }) {
  const [location, setLocation] = useState(data ? { latitude: data.latitude, longitude: data.longitude } : null)
  const [date, setDate] = useState(data?.date ? data.date : minDate)
  const [description, setDescription] = useState(data?.description)
  const { t } = useTranslation()
  const [canCreate, setCanCreate] = useState(false)
  const isFocused = useIsFocused();
  const popupRef = useRef()

  useEffect(() => {
    if (isFocused) {
      getEventCount().then((r) => {
        if (r.data.count >= 2) {
          popupRef.current.add({ text: t('too_many_events'), type: 'error' })
        }
        setCanCreate(r.data.count < 2)
      })
    }
  }, [isFocused])

  const canGoNext = date && description && canCreate

  const save = () => {
    onFinish({
      data: { description, date: date.toISOString(), type: 'EVENT', latitude: location?.latitude, longitude: location?.longitude }
    })
  }

  useEffect(() => {
    onChange({ location, date, description })
  }, [location, date, description])

  useEffect(() => {
    if (route.params?.address) {
      setLocation(route.params?.address)
    }
  }, [route.params?.address])

  return (
    <>
    <KeyboardAvoidingView behavior={Platform.OS === 'android' ? undefined : 'padding'}>
      <View style={styles.sheet}>
          <View style={styles.sheetContent}>
            <MMapInput currentScreen={currentScreen} address={location} onMapOpen={onMapOpen} style={{ marginBottom: 11 }} />
            <MDateInput placeholder={'CreateEvent.date'} style={{ marginBottom: 11 }} mandatory
              minDate={minDate} value={date} setValue={setDate} />
            <MInput placeholder={'CreateEvent.description'} multiline value={description} mandatory setValue={(v) => {
              setDescription(v)
            }} />
            <TouchableOpacity disabled={!canGoNext} style={[styles.buttonStyle, canGoNext ? styles.buttonActive : '']} onPress={() => {
              Haptics.selectionAsync()
              save()
            }}>
              <MText style={styles.nextButtonText}>{t(button)}</MText>
            </TouchableOpacity>
          </View>
      </View>
      </KeyboardAvoidingView>
      <MPopup ref={popupRef} />
    </>
  )
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1

  },
  title: {
    fontSize: 24,
    marginVertical: 8,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: -20
  },
  sheetContent: {
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  buttonStyle: {
    height: 38,
    marginVertical: 11,
    backgroundColor: '#818195',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: '#A347FF',
  },
  nextButtonText: {
    color: '#fff',
  },
});
