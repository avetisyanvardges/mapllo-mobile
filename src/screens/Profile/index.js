import {useIsFocused, useNavigation} from '@react-navigation/native'
import * as Haptics from 'expo-haptics'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import FastImage from 'react-native-fast-image'
import {
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler'
import ReadMore from 'react-native-read-more-text'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import GestureRecognizer from 'react-native-swipe-gestures'
import {useDispatch, useSelector} from 'react-redux'

import EditProfile from './editProfile'
import ProfileMenu from './profileMenu'
import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MFavourite from '../../components/MFavourite'
import MPopup from '../../components/MPopup'
import MProgressBar from '../../components/MProgressBar'
import MText from '../../components/MText'
import {getOwnProfile, switchShowOnline} from '../../configs/api'
import Socket from '../../configs/socket'
import CompasSimpleIcon from '../../icons/CompasSimpleIcon'
import InstagramIcon from '../../icons/InstagramIcon'
import SettingsIcon from '../../icons/SettingsIcon'
import VkIcon from '../../icons/VkIcon'
import {
  updatePhotos,
  updateProfile,
  updateShowOnlineOnMap,
} from '../../slices/authReducer'
import {getSignByDate} from '../../utils/getZodiacName'

export default gestureHandlerRootHOC(function Profile({
  id,
  fullscreen = false,
}) {
  const {
    userName,
    name,
    birthday,
    gender,
    photos,
    city,
    motivations,
    about,
    instagram,
    vk,
    showOnlineOnMap,
  } = useSelector(({auth}) => auth)

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [progressIndex, setProgressIndex] = useState(0)
  const [editActive, setEditActive] = useState(false)

  const popupRef = useRef()
  const editSheetRef = useRef()

  const dispatch = useDispatch()
  const {t, i18n} = useTranslation()
  const nav = useNavigation()

  const focused = useIsFocused()
  useEffect(() => {
    if (focused) {
      getOwnProfile().then(p => {
        dispatch(updateProfile(p.data))
        dispatch(updatePhotos(p.data))
      })
    }
  }, [focused])

  const goPrevious = () => {
    if (editActive) {
      setEditActive(false)
      return
    }
    setCurrentPhotoIndex(i => {
      if (i !== 0) {
        return i - 1
      } else {
        return i
      }
    })
  }

  const goNext = () => {
    if (editActive) {
      setEditActive(false)
      return
    }
    setCurrentPhotoIndex(i => {
      if (i !== photos.length - 1) {
        return i + 1
      } else {
        return i
      }
    })
  }

  const showOnlineSwitch = () => {
    Haptics.selectionAsync()
      .then(() => switchShowOnline())
      .then(r => {
        Socket.setShare(r.data)
        dispatch(updateShowOnlineOnMap({showOnlineOnMap: r.data}))
        popupRef.current.add({
          text: t(
            r.data
              ? 'components.MPopup.showOnMap'
              : 'components.MPopup.dontShowOnMap',
          ),
          type: 'normal',
        })
      })
  }

  function calculateAge(dateString) {
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const nameLine = () => {
    let str = name ? name + ', ' : ''
    const age = calculateAge(birthday)
    str += t('Profile.age', {age, count: age})
    return `${str}, `
  }

  const editPhoto = () => {
    setCurrentPhotoIndex(0)
    setEditActive(false)
    nav.push('ImageLibrary', {imgs: [...photos]})
  }
  const _renderTruncatedFooter = handlePress => (
    <MText
      style={{color: '#fff', marginTop: 5, zIndex: 999}}
      onPress={handlePress}>
      {t('more')}
    </MText>
  )
  const _renderRevealedFooter = handlePress => (
    <MText
      style={{color: '#fff', marginTop: 5, zIndex: 999}}
      onPress={handlePress}>
      {t('Profile.about.hide')}
    </MText>
  )
  const insets = useSafeAreaInsets()
  const panGesture = Gesture.Pan().onEnd(e => {
    if (e.translationX > 0) {
      goPrevious()
      return
    }

    if (e.translationX < 0) {
      goNext()
    }
  })
  return (
    <View style={styles.background}>
      <FastImage
        source={{uri: photos[currentPhotoIndex].uri}}
        cacheKey={photos[currentPhotoIndex].id}
        style={[styles.backgroundImage]}
        resizeMode="cover"
        onLoadEnd={() => {
          setProgressIndex(currentPhotoIndex)
        }}
      />
      <MPopup onlyOne ref={popupRef} />
      <View
        style={[styles.overlay, {paddingTop: insets.top}]}
        pointerEvents="box-none">
        <View style={[styles.overlayFake]}>
          {deviceInfo.ios ? (
            <GestureRecognizer
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              onSwipeLeft={() => goNext()}
              onSwipeRight={() => goPrevious()}>
              <View style={styles.changePhotoWrapper}>
                <Pressable
                  style={styles.changePhotoWrapperLeft}
                  onPress={goPrevious}
                />
                <Pressable
                  style={styles.changePhotoWrapperRight}
                  onPress={goNext}
                />
              </View>
            </GestureRecognizer>
          ) : (
            <GestureDetector
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              gesture={panGesture}>
              <View style={styles.changePhotoWrapper}>
                <Pressable
                  style={styles.changePhotoWrapperLeft}
                  onPress={goPrevious}
                />
                <Pressable
                  style={styles.changePhotoWrapperRight}
                  onPress={goNext}
                />
              </View>
            </GestureDetector>
          )}

          <View style={styles.topButtons} pointerEvents="box-none">
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {photos.length > 1 && (
                <MProgressBar
                  maxStep={photos.length}
                  stepNumber={progressIndex}
                  dotted
                />
              )}
              <ProfileMenu
                expanded={editActive}
                setExpanded={setEditActive}
                show={editSheetRef.current?.show}
                editPhoto={editPhoto}
              />
            </View>
            <TouchableOpacity
              style={styles.settings}
              onPress={() => nav.push('Settings')}>
              <SettingsIcon color="#fff" />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
            pointerEvents="box-none">
            <View style={styles.bottom} pointerEvents="box-none">
              <View styles={styles.info} pointerEvents="box-none">
                <View style={styles.socials} pointerEvents="box-none">
                  {instagram && (
                    <TouchableOpacity
                      style={styles.instagram}
                      onPress={() =>
                        Linking.openURL(
                          'https://www.instagram.com/' + instagram,
                        )
                      }>
                      <InstagramIcon />
                    </TouchableOpacity>
                  )}
                  {vk && (
                    <TouchableOpacity
                      style={styles.vk}
                      onPress={() => Linking.openURL('https://vk.com/' + vk)}>
                      <VkIcon />
                    </TouchableOpacity>
                  )}
                </View>
                <MText bold style={styles.username}>
                  {userName}
                </MText>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MText bold style={styles.name}>
                    {nameLine()}
                  </MText>
                  <View
                    style={{
                      marginTop: 8,
                    }}>
                    {getSignByDate(birthday)}
                  </View>
                </View>
                <MText bold style={styles.city}>
                  {(i18n.language === 'ru' ? 'г. ' : '') + city}
                </MText>
                <View style={styles.motivations}>
                  {motivations.includes('FIND_PEOPLE') ? (
                    <MText bold style={{color: '#fff', fontSize: 14}}>
                      {t('motivations.FIND_PEOPLE')}
                    </MText>
                  ) : (
                    <></>
                  )}
                  {motivations.includes('FIND_PEOPLE') &&
                  motivations.includes('FIND_ENTERTAINMENT') ? (
                    <MText bold style={{color: '#fff', fontSize: 14}}>
                      {' '}
                      /{' '}
                    </MText>
                  ) : (
                    <></>
                  )}
                  {motivations.includes('FIND_ENTERTAINMENT') ? (
                    <MText bold style={{color: '#fff', fontSize: 14}}>
                      {t('motivations.FIND_ENTERTAINMENT')}
                    </MText>
                  ) : (
                    <></>
                  )}
                  {/* {motivations.map((m,i) => (
                      <View style={[styles.motivation, styles['motivation_' + m]]} key={i}>
                        <MText style={styles.motivationText}>{t('motivations.' + m)}</MText>
                      </View>
                    ))} */}
                </View>
                {about && (
                  <View style={styles.aboutContainer} pointerEvents="box-none">
                    <ReadMore
                      renderTruncatedFooter={_renderTruncatedFooter}
                      renderRevealedFooter={_renderRevealedFooter}
                      numberOfLines={2}>
                      <MText bold style={[styles.about]}>
                        {about}
                      </MText>
                    </ReadMore>
                  </View>
                )}
              </View>
              <View styles={styles.buttons}>
                <MFavourite
                  fav
                  toggleFav={() => nav.push('Favourites')}
                  style={{marginBottom: 10, zIndex: 999}}
                />
                <TouchableOpacity
                  onPress={showOnlineSwitch}
                  style={{marginTop: 30, zIndex: 999}}>
                  <CompasSimpleIcon
                    size={36}
                    active={showOnlineOnMap}
                    style={showOnlineOnMap && styles.compasActive}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
      <ActionSheet
        ref={editSheetRef}
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        useBottomSafeAreaPadding={
          deviceInfo?.small_screen && deviceInfo.android
        }
        backdrop>
        <EditProfile
          username={userName}
          name={name}
          birthday={birthday}
          about={about}
          gender={gender}
          sheetRef={editSheetRef}
          motivations={motivations}
          instagram={instagram}
          vk={vk}
          onUpdate={() => editSheetRef.current.hide()}
        />
      </ActionSheet>
    </View>
  )
})
const styles = StyleSheet.create({
  settings: {
    borderRadius: 40,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(16,16,34,0.4)',
    zIndex: 999,
  },
  editListItem: {
    fontSize: 12,
    paddingVertical: 4,
    color: '#2c2c2c',
  },
  instagram: {
    marginRight: 10,
  },
  vk: {
    marginRight: 10,
  },
  socials: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  compasActive: {
    shadowOpacity: 1,
    shadowColor: '#A347FF',
    shadowRadius: 10,
  },
  motivations: {
    marginTop: 8,
    flexDirection: 'row',
  },
  motivation: {
    marginRight: 10,
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  motivation_FIND_ENTERTAINMENT: {
    backgroundColor: '#A347FF',
  },
  motivation_FIND_PEOPLE: {
    backgroundColor: '#F3267D',
  },
  motivationText: {
    color: '#fff',
    fontSize: 12,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  city: {
    color: '#fff',
    fontSize: 14,
  },
  background: {
    flex: 1,
    // position: 'absolute',
    top: 0,
    // bottom: -85,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    flex: 1,
  },
  changePhotoWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    zIndex: 999,
  },
  changePhotoWrapperLeft: {
    flex: 1,
  },
  changePhotoWrapperRight: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlayFake: {
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  topButtons: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    zIndex: 999,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  aboutContainer: {
    marginTop: 8,
    maxWidth: 300,
  },
  about: {
    color: '#fff',
    fontSize: 14,
  },
  info: {},
  buttons: {},
  circleButton: {
    backgroundColor: 'rgba(16,16,34,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
})
