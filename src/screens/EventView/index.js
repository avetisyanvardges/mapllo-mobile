import {useIsFocused, useNavigation} from '@react-navigation/native'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View} from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {normalize} from '../../assets/normalize'
import MBack from '../../components/MBack'
import MPopup from '../../components/MPopup'
import {getEvent, updateEvent} from '../../configs/api'
import CreateEventNested from '../CreateEvent/create'
import GeneralEvent from '../Event'
import EventMenu from '../Feed/eventMenu'

export default function EventView({route}) {
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [event, setEvent] = useState(route.params.event)
  const popupRef = useRef()
  const nav = useNavigation()
  const insets = useSafeAreaInsets()
  const focused = useIsFocused()
  const editSheetRef = useRef()
  const [editEvent, setEditEvent] = useState(null)
  const {t} = useTranslation()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    setEditEvent(event)
  }, [event])

  useEffect(() => {
    if (focused) {
      getEvent(route.params.id).then(r => setEvent(r.data))
    }
  }, [focused])

  if (event == null) {
    return <></>
  }
  if (route.params?.address) {
    const latitude = route.params.address.latitude
      ? route.params.address.latitude
      : editEvent.latitude
    const longitude = route.params.address.longitude
      ? route.params.address.longitude
      : editEvent.longitude
    setEditEvent({...editEvent, latitude, longitude})
    editSheetRef.current.show()
    route.params.address = null
  }

  const sheet = (
    <ActionSheet
      ref={editSheetRef}
      containerStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
      }}>
      <CreateEventNested
        currentScreen="EventView"
        route={route}
        onFinish={() => {
          updateEvent(editEvent.id, {
            date: editEvent.date,
            description: editEvent?.description,
            latitude: editEvent?.latitude,
            longitude: editEvent?.longitude,
          })
          setEvent(editEvent)
          editSheetRef.current.hide()
          popupRef.current.add({text: t('event_edited'), type: 'normal'})
        }}
        button="apply"
        onChange={data => {
          setEditEvent(e => ({
            ...e,
            date: data.date,
            latitude: data.location?.latitude,
            longitude: data.location?.longitude,
            description: data.description,
          }))
        }}
        data={{
          date: editEvent?.date ? new Date(editEvent.date) : null,
          description: editEvent?.description,
          latitude: editEvent?.latitude,
          longitude: editEvent?.longitude,
        }}
        onMapOpen={() => {
          editSheetRef.current.hide()
        }}
      />
    </ActionSheet>
  )

  return (
    <View style={styles.container}>
      <MBack top={normalize(50)} left={20} />
      <View style={[styles.buttons, {top: insets.top, right: insets.right}]}>
        <EventMenu
          route={route}
          expanded={menuExpanded}
          setExpanded={setMenuExpanded}
          editSheetRef={editSheetRef}
          event={event}
          popupRef={popupRef}
          hideElement={() => nav.goBack()}
          deleteModalVisible={deleteModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
        />
      </View>
      <MPopup ref={popupRef} />
      {sheet}
      <View style={{flex: 1}} onTouchStart={() => setMenuExpanded(false)}>
        <GeneralEvent event={event} popup={popupRef} fullscreen active />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    zIndex: 5,
    margin: 20,
  },
})
