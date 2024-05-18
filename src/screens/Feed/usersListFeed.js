import * as Location from 'expo-location'
import LottieView from 'lottie-react-native'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import AbstractList from './list'
import UserFilter from './userFilter'
import UserMenu from './userMenu'
import MPopup from '../../components/MPopup'
import MProgressBar from '../../components/MProgressBar'
import MText from '../../components/MText'
import {getFeedUsers} from '../../configs/api'
import ArrowTopIcon from '../../icons/ArrowTopIcon'
import User from '../Event/user'

export default function UserListFeed({onLoad}) {
  const [users, setUsers] = useState([])
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [genderFilter, setGenderFilter] = useState('ANY')
  const [ageFilterLeft, setAgeFilterLeft] = useState(18)
  const [ageFilterRight, setAgeFilterRight] = useState(70)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [placeId, setPlaceId] = useState()
  const [city, setCity] = useState()
  const {t} = useTranslation()
  const [motivationFilter, setMotivationFilter] = useState({
    text: t('any_motivation'),
    val: 'ANY',
  })
  const [activeUser, setActiveUser] = useState(null)
  const insets = useSafeAreaInsets()
  const popupRef = useRef()
  const listRef = useRef()

  const closeAll = () => {
    setFilterExpanded(false)
    setMenuExpanded(false)
  }

  const getUsers = async (off, limit) => {
    const perms = await Location.getForegroundPermissionsAsync()
    const loc = perms.granted
      ? await Location.getLastKnownPositionAsync()
      : null
    const body = {
      lat: loc?.coords?.latitude,
      lng: loc?.coords?.longitude,
      ageLeft: ageFilterLeft,
      ageRight: ageFilterRight,
      gender: genderFilter,
      motivation: motivationFilter.val,
      placeId,
    }
    const response = await getFeedUsers(body, limit, off)
    onLoad()
    return response.data.profiles
  }

  useEffect(() => {
    listRef.current.toTop(true)
    listRef.current.refresh()
  }, [ageFilterRight, ageFilterLeft, genderFilter, motivationFilter, placeId])

  return (
    <View style={{flex: 1}}>
      <MPopup onlyOne ref={popupRef} />
      <View
        style={[
          styles.settingsContainer,
          {top: insets.top + 17, right: insets.right},
        ]}>
        <View style={styles.settings}>
          {users.length > 0 && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {activeUser?.photos?.length > 1 && !menuExpanded ? (
                <MProgressBar
                  maxStep={activeUser?.photos?.length}
                  stepNumber={photoIndex}
                  style={{paddingBottom: 10}}
                  dotted
                />
              ) : null}
              <View>
                <UserMenu
                  expanded={menuExpanded}
                  setExpanded={setMenuExpanded}
                  user={activeUser}
                  popupRef={popupRef}
                  hideElement={() => listRef.current.hide()}
                />
                <View style={{height: 10}} />
              </View>
            </View>
          )}
          <UserFilter
            expanded={filterExpanded}
            setExpanded={setFilterExpanded}
            ageFilterLeft={ageFilterLeft}
            setAgeFilterLeft={setAgeFilterLeft}
            ageFilterRight={ageFilterRight}
            setAgeFilterRight={setAgeFilterRight}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            motivationFilter={motivationFilter}
            setMotivationFilter={setMotivationFilter}
            city={city}
            setCity={setCity}
            placeId={placeId}
            setPlaceId={setPlaceId}
          />
          {showScrollToTop && (
            <TouchableOpacity
              style={[{height: 10, marginTop: 20}]}
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
      <View style={{flex: 1}}>
        <AbstractList
          ref={listRef}
          data={users}
          setData={setUsers}
          activeData={activeUser}
          setActiveData={setActiveUser}
          download={getUsers}
          renderData={(item, itemHeight) => (
            <User
              key={item.id}
              active={item.id === activeUser?.id}
              userInitial={item}
              height={itemHeight}
              popup={popupRef}
              hoversExpanded={filterExpanded || menuExpanded}
              setPhotoIndex={setPhotoIndex}
            />
          )}
          onScroll={e => {
            if (e?.nativeEvent?.contentOffset?.y > 800) {
              setShowScrollToTop(true)
            } else {
              setShowScrollToTop(false)
            }
          }}
          renderEmptyItem={() => {
            return (
              <View style={styles.emptyContainer}>
                <MText style={styles.emptyText}>
                  {t('feed.empty.profile')}
                </MText>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsContainer: {
    position: 'absolute',
    zIndex: 1,
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
    marginRight: 30,
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
