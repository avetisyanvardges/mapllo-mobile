import {useNavigation} from '@react-navigation/native'
import {Divider} from '@rneui/base'
import {isEmpty} from 'lodash'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {
  FlatList,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import GestureRecognizer from 'react-native-swipe-gestures'

import {deviceInfo, fullScreen} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MPopup from '../../components/MPopup'
import MText from '../../components/MText'
import {getFavourites} from '../../configs/api'
import ArrowTopIcon from '../../icons/ArrowTopIcon'
import StarIcon from '../../icons/StarIcon'
import GeneralEvent from '../Event'
import User from '../Event/user'
import Poster from '../Poster'

const config = {waitForInteraction: true, viewAreaCoveragePercentThreshold: 51}

export default function Favourites() {
  const listRef = useRef()
  const [activeTitle, setActiveTitle] = useState('EVENT')
  const [items, setItems] = useState([])
  const [activeItem, setActiveItem] = useState()
  const [loader, setLoader] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const popupRef = useRef()
  const isDate = activeTitle === 'DATE'
  const navigation = useNavigation()
  const isPoster = activeTitle === 'POSTER'

  const itemHeight = deviceInfo?.android
    ? fullScreen.height + insets.top
    : fullScreen.height

  useEffect(() => {
    update()
  }, [activeTitle])

  const update = async () => {
    if (!loader) {
      setLoader(true)
    }
    getFavourites(isDate ? 'EVENT' : activeTitle)
      .then(r => {
        setItems(r.data.favourites)
        if (r.data.favourites.length > 0) {
          setActiveItem(r.data.favourites[0])
        }
      })
      .then(() => setLoader(false))
      .catch(() => setLoader(false))
  }

  const onViewChange = useCallback(({changed, viewableItems}) => {
    setActiveItem(viewableItems[0]?.item)
  }, [])

  const render = useCallback(
    ({item, index}) => {
      switch (activeTitle) {
        case 'DATE':
        case 'EVENT': {
          return (
            <GeneralEvent
              event={item}
              height={
                deviceInfo?.android
                  ? fullScreen.height + insets.top
                  : fullScreen.height
              }
              popup={popupRef}
              fullscreen
              active={item.id === activeItem?.id}
            />
          )
        }
        case 'USER': {
          return (
            <User
              userInitial={item}
              height={
                deviceInfo?.android
                  ? fullScreen.height + insets.top
                  : fullScreen.height
              }
              popup={popupRef}
              fullscreen
            />
          )
        }
        case 'POSTER': {
          return (
            <Poster
              poster={item}
              height={
                deviceInfo?.android
                  ? fullScreen.height + insets.top
                  : fullScreen.height
              }
              popup={popupRef}
              topPadding={30}
              active={item.id === activeItem?.id}
            />
          )
        }
      }
    },
    [activeTitle, activeItem],
  )
  const switchTo = type => {
    if (type !== activeTitle) {
      setItems([])
    }
    setActiveTitle(type)
  }

  const switchToNext = () => {
    if (activeTitle === 'EVENT') {
      switchTo('USER')
      return
    }
    if (activeTitle === 'USER') {
      switchTo('POSTER')
      return
    }

    if (activeTitle === 'POSTER') {
    }
  }

  const switchToPrevious = type => {
    if (activeTitle === 'EVENT') {
      navigation.goBack()
    }
    if (activeTitle === 'USER') {
      switchTo('EVENT')
      return
    }

    if (activeTitle === 'POSTER') {
      switchTo('USER')
    }
  }

  const filteredItems = loader
    ? []
    : activeTitle === 'DATE'
      ? items.filter(e => e.type === 'DATING')
      : activeTitle === 'EVENT'
        ? items.filter(e => e.type === 'EVENT')
        : items

  const panGesture = Gesture.Pan().onEnd(e => {
    if (e.translationX > 50) {
      switchToPrevious()
      return
    }

    if (e.translationX < -50) {
      switchToNext()
    }
  })
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.container]}>
          <View style={[styles.top, {paddingTop: insets.top}]}>
            <TouchableOpacity
              onPress={() => switchTo('EVENT')}
              style={{padding: 10}}>
              <MText
                style={[
                  styles.titleFont,
                  activeTitle === 'EVENT' ? styles.activeFont : {},
                ]}>
                {t('events')}
              </MText>
              {activeTitle === 'EVENT' && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Divider style={{width: 30}} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => switchTo('USER')}
              style={{padding: 10}}>
              <MText
                style={[
                  styles.titleFont,
                  activeTitle === 'USER' ? styles.activeFont : {},
                ]}>
                {t('people')}
              </MText>
              {activeTitle === 'USER' && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Divider style={{width: 30}} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => switchTo('DATE')} style={{padding: 10}}>
          <MText style={[styles.titleFont, activeTitle === 'DATE' ? styles.activeFont : {}]}>{t('dates')}</MText>
          {activeTitle === 'DATE' && (
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
              <Divider style={{width: 30}} color={'#fff'} />
            </View>
          )}
        </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => switchTo('POSTER')}
              style={{padding: 10}}>
              <MText
                style={[
                  styles.titleFont,
                  activeTitle === 'POSTER' ? styles.activeFont : {},
                ]}>
                {t('posters')}
              </MText>
              {activeTitle === 'POSTER' && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Divider style={{width: 30}} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: insets.top + (isPoster ? normalize(80) : normalize(30)),
              right: insets.right || normalize(20),
              zIndex: 999,
            }}>
            {showScrollToTop && (
              <TouchableOpacity
                style={[{height: 10, marginTop: 20}]}
                onPress={() => {
                  listRef?.current?.scrollToOffset({animated: true, offset: 0})
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
          <FlatList
            ref={listRef}
            data={filteredItems}
            keyExtractor={(item, index) => `${index}-${item?.id}`}
            renderItem={render}
            style={{height: '100%'}}
            showsVerticalScrollIndicator={false}
            viewabilityConfig={config}
            onViewableItemsChanged={onViewChange}
            contentContainerStyle={
              isEmpty(filteredItems) ? {height: '100%'} : null
            }
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#999999',
                  }}>
                  <View
                    style={[
                      styles.fav,
                      {
                        backgroundColor: 'rgba(16,16,34,0.4)',
                      },
                    ]}>
                    {loader ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <StarIcon size={33} />
                    )}
                  </View>
                  <MText
                    style={{
                      color: '#fff',
                      paddingTop: 13,
                      fontSize: 16,
                      textAlign: 'center',
                      width: 120,
                    }}>
                    {t('nothing_saved')}
                  </MText>
                </View>
              )
            }}
            onScroll={e => {
              if (
                e?.nativeEvent?.contentOffset?.y >
                (deviceInfo.android ? itemHeight * 2 : itemHeight)
              ) {
                setShowScrollToTop(true)
              } else {
                setShowScrollToTop(false)
              }
            }}
            pagingEnabled
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={update}
                tintColor="#A347FF"
              />
            }
          />
          <MPopup ref={popupRef} onlyOne />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555555',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
    zIndex: 5,
  },
  titleFont: {
    fontSize: 14,
    color: '#D9D9D9',
  },
  activeFont: {
    color: '#fff',
  },
  fav: {
    height: 60,
    width: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
