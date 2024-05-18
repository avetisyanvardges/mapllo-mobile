import * as Location from 'expo-location'
import LottieView from 'lottie-react-native'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Animated,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import EventFilter from './eventFilter'
import EventMenu from './eventMenu'
import AbstractList from './list'
import MPopup from '../../components/MPopup'
import MText from '../../components/MText'
import {getAllPosters, getFeedEvents, updateEvent} from '../../configs/api'
import ArrowTopIcon from '../../icons/ArrowTopIcon'
import CreateEventNested from '../CreateEvent/create'
import GeneralEvent from '../Event'

export default function EventListFeed({
  route,
  menuExpanded,
  setMenuExpanded,
  filterExpanded,
  setFilterExpanded,
  onLoad,
}) {
  const [events, setEvents] = useState([])
  const [posters, setPosters] = useState([])
  const [items, setItems] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [showEvents, setShowEvents] = useState(true)
  const [showPosters, setShowPosters] = useState(true)
  const [ownEvents, setOwnEvents] = useState(false)
  const [dateFilter, setDateFilter] = useState('any')
  const [activeEvent, setActiveEvent] = useState(null)
  const [editEvent, setEditEvent] = useState(null)
  const editSheetRef = useRef()
  const [placeId, setPlaceId] = useState()
  const [city, setCity] = useState()
  const insets = useSafeAreaInsets()
  const popupRef = useRef()
  const listRef = useRef()

  const {t} = useTranslation()

  useEffect(() => {
    setEditEvent(activeEvent)
  }, [activeEvent])

  useEffect(() => {
    if (route.params?.address) {
      const address = route.params.address
      editSheetRef.current.show()
      Keyboard.dismiss()
      setEditEvent(e => ({...e, ...address.address}))
    }
  }, [route.params?.address])

  useEffect(() => {
    if (route.params?.updateTime) {
      listRef.current.refresh()
    }
  }, [route.params?.updateTime])

  const closeAll = () => {
    setFilterExpanded(false)
    setMenuExpanded(false)
  }
  const dateStr = () => {
    if (activeEvent && activeEvent.date) {
      const date = new Date(activeEvent.date)
      const yyyy = date.getFullYear()
      let mm = date.getMonth() + 1 // Months start at 0!
      let dd = date.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      return dd + '.' + mm + '.' + yyyy
    }
  }

  const getEvents = async (off, limit) => {
    const perms = await Location.getForegroundPermissionsAsync()
    const loc = perms.granted
      ? await Location.getLastKnownPositionAsync()
      : null

    let postersDownloaded = posters
    let itemsToShow = []
    if (showPosters && off === 0) {
      const resp = await getAllPosters(placeId)
      postersDownloaded = resp.data
    }
    let eventsDownloaded = []
    if (showEvents || ownEvents) {
      const body = {
        lat: loc?.coords?.latitude,
        lng: loc?.coords?.longitude,
        withEvents: showEvents,
        withDates: false,
        dateFilter,
        own: ownEvents,
        placeId,
      }
      const response = await getFeedEvents(body, limit, off)
      const lat = perms.granted ? loc?.coords?.latitude : response.data.latitude
      const lng = perms.granted
        ? loc?.coords?.longitude
        : response.data.longitude
      eventsDownloaded = response.data.events
      for (let i = 0; i < eventsDownloaded.length; i++) {
        const event = eventsDownloaded[i]
        const distanceToEvent = dist(lat, lng, event.latitude, event.longitude)
        for (let j = 0; j < postersDownloaded.length; j++) {
          const poster = postersDownloaded[j]
          const distanceToPoster = dist(
            lat,
            lng,
            poster.latitude,
            poster.longitude,
          )
          if (distanceToPoster < distanceToEvent) {
            itemsToShow.push(poster)
            postersDownloaded = postersDownloaded.slice(1)
            j -= 1
          } else {
            break
          }
        }
        itemsToShow.push(event)
      }
    }
    if (eventsDownloaded.length < limit) {
      itemsToShow = [...itemsToShow, ...postersDownloaded]
      postersDownloaded = []
    }
    setPosters(postersDownloaded)
    onLoad()
    return itemsToShow
  }

  useEffect(() => {
    listRef.current.refresh()
  }, [showEvents, showPosters, dateFilter, ownEvents, placeId])

  const allItems = []

  const dist = (lat1, lng1, lat2, lng2) => {
    const lat1Rad = toRadians(lat1)
    const lon1Rad = toRadians(lng1)
    const lat2Rad = toRadians(lat2)
    const lon2Rad = toRadians(lng2)

    // Calculate the differences between coordinates
    const deltaLat = lat2Rad - lat1Rad
    const deltaLon = lon2Rad - lon1Rad

    // Apply Haversine formula
    const a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.pow(Math.sin(deltaLon / 2), 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = 6371 * c

    return distance
  }

  const toRadians = degrees => {
    return (degrees * Math.PI) / 180
  }

  const activeIsEvent = activeEvent && activeEvent.type === 'EVENT'
  const shouldShowGoToTop =
    activeEvent &&
    activeEvent?.id !== items[0]?.id &&
    activeEvent?.id !== items[1]?.id
  return (
    <View style={{flex: 1}}>
      <MPopup onlyOne ref={popupRef} />
      <View
        style={[
          styles.date,
          {
            top: insets.top + (activeIsEvent ? 18 : 12),
            right: insets.right + (activeIsEvent ? 60 : 45),
          },
        ]}>
        {activeEvent?.type === 'EVENT' && (
          <MText style={styles.dateText}>{dateStr()}</MText>
        )}
        {activeEvent && !activeEvent.type && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: '#F3267D',
              width: 90,
              height: 26,
            }}>
            <MText bold style={styles.dateText}>
              {dateStr()}
            </MText>
          </View>
        )}
      </View>
      <View
        style={[
          styles.settingsContainer,
          {top: insets.top + 17, right: insets.right},
        ]}
        pointerEvents="box-none">
        <View style={styles.settings}>
          {items.length > 0 && activeEvent?.type === 'EVENT' && (
            <>
              <EventMenu
                route={route}
                expanded={menuExpanded}
                setExpanded={setMenuExpanded}
                event={activeEvent}
                popupRef={popupRef}
                hideElement={() => listRef.current.hide()}
                editSheetRef={editSheetRef}
                filterExpanded={filterExpanded}
                deleteModalVisible={deleteModalVisible}
                setDeleteModalVisible={setDeleteModalVisible}
              />
              <View style={{height: 10}} />
            </>
          )}
          {!deleteModalVisible ? (
            <EventFilter
              expanded={filterExpanded}
              setExpanded={e => {
                setFilterExpanded(e)
              }}
              menuExpanded={menuExpanded}
              showEvents={showEvents}
              setShowEvents={val => {
                setShowEvents(val)
                if (ownEvents) {
                  setOwnEvents(false)
                  setDateFilter('any')
                }
              }}
              showPosters={showPosters}
              setShowPosters={val => {
                setShowPosters(val)
                if (ownEvents) {
                  setOwnEvents(false)
                  setDateFilter('any')
                }
              }}
              dateFilter={dateFilter}
              setDateFilter={val => {
                if (ownEvents) {
                  setOwnEvents(false)
                  setShowEvents(true)
                  setShowPosters(true)
                }
                setDateFilter(val)
              }}
              ownEvents={ownEvents}
              setOwnEvents={() => {
                setDateFilter(null)
                setShowEvents(false)
                setShowPosters(false)
                setOwnEvents(true)
              }}
              city={city}
              setCity={setCity}
              placeId={placeId}
              setPlaceId={setPlaceId}
            />
          ) : null}
          {shouldShowGoToTop && (
            <TouchableOpacity
              style={[
                {height: 10},
                activeEvent?.type === 'EVENT'
                  ? {marginTop: 10}
                  : {marginTop: 55},
              ]}
              onPress={() => {
                listRef.current.toTop()
              }}>
              <Animated.View
                style={{
                  height: 36,
                  width: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F3267D',
                  borderRadius: 50,
                }}>
                <ArrowTopIcon />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{flex: 1}} onTouchStart={closeAll}>
        <AbstractList
          ref={listRef}
          data={items}
          setData={setItems}
          activeData={activeEvent}
          setActiveData={setActiveEvent}
          download={getEvents}
          renderData={(item, itemHeight) => (
            <GeneralEvent
              key={item.id}
              active={item.id === activeEvent?.id}
              event={item}
              height={itemHeight}
              popup={popupRef}
              fullscreen={false}
            />
          )}
          renderEmptyItem={() => {
            return (
              <View style={styles.emptyContainer}>
                <MText style={styles.emptyText}>
                  {showEvents
                    ? t('feed.empty.event')
                    : showPosters
                      ? t('feed.empty.poster')
                      : t('feed.empty.event')}
                </MText>
              </View>
            )
          }}
        />
      </View>
      <ActionSheet
        ref={editSheetRef}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20,
        }}>
        <CreateEventNested
          currentScreen="Feed"
          route={route}
          onFinish={() => {
            updateEvent(editEvent.id, {
              date: editEvent.date,
              description: editEvent?.description,
              latitude: editEvent?.latitude,
              longitude: editEvent?.longitude,
            })
            setEvents({
              ...events.map(e => {
                if (e.id === editEvent.id) {
                  return editEvent
                } else {
                  return e
                }
              }),
            })
            setActiveEvent(editEvent)
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
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsContainer: {
    position: 'absolute',
    zIndex: 9999,
    right: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  date: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 10,
    marginRight: 45,
  },
  dateText: {
    color: '#fff',
  },
  settings: {
    marginRight: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C5C5C5',
  },
  emptyText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
})
