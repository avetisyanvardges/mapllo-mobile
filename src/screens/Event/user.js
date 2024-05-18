import {useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Linking,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import ReadMore from 'react-native-read-more-text'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import GestureRecognizer from 'react-native-swipe-gestures'
import ViewMoreText from 'react-native-view-more-text'
import {useSelector} from 'react-redux'

import ActionButton from './actionButton'
import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MFavourite from '../../components/MFavourite'
import MImage from '../../components/MImage'
import MProgressBar from '../../components/MProgressBar'
import MText from '../../components/MText'
import {addToFav} from '../../configs/api'
import {shareUserUrl} from '../../configs/constants'
import InstagramIcon from '../../icons/InstagramIcon'
import SendMessageIcon from '../../icons/SendMessageIcon'
import ShareIcon from '../../icons/ShareIcon'
import VkIcon from '../../icons/VkIcon'
import {getSignByDate} from '../../utils/getZodiacName'

function User({
  active,
  userInitial,
  height,
  popup,
  fullscreen = false,
  setPhotoIndex,
  parentRoute,
}) {
  const chatView = parentRoute === 'ChatView'
  const own = useSelector(state => (user ? user.id === state.auth.id : true))
  const [user, setUser] = useState(userInitial)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const {t, i18n} = useTranslation()
  const nav = useNavigation()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    setUser(userInitial)
  }, [userInitial])

  const toggleFav = () => {
    addToFav('USER', user.id).then(r => {
      const isFav = r.data
      setUser(e => ({...e, favourite: isFav}))
      if (isFav) {
        popup.current.add({text: t('added_to_fav'), type: 'normal'})
      } else {
        popup.current.add({text: t('removed_from_fav'), type: 'normal'})
      }
    })
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
  const personal = () => {
    let nameStr = ''
    if (user.name) {
      nameStr += user.name + ', '
    }
    nameStr += calculateAge(user.birthday)
    const city = (i18n.language === 'ru' ? 'г. ' : '') + user.city
    return (
      <View>
        <MText boldbold style={styles.username}>
          {user.userName}
        </MText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MText bold style={styles.fio}>
            {nameStr}
          </MText>
          <View
            style={{
              marginTop: 8,
            }}>
            {user?.birthday ? getSignByDate(user?.birthday) : null}
          </View>
        </View>
        <MText style={styles.city}>{city}</MText>
      </View>
    )
  }

  function calculateAge(dateString) {
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age}, `
  }

  const share = () => {
    const url = shareUserUrl + user.id
    const message = t('found') + '\n' + url
    Share.share({message}, {dialogTitle: message, subject: message})
  }

  const goPrevious = () => {
    setCurrentPhotoIndex(i => {
      if (i !== 0) {
        return i - 1
      } else {
        return i
      }
    })

    if (setPhotoIndex) {
      setPhotoIndex(i => {
        if (i !== 0) {
          return i - 1
        } else {
          return i
        }
      })
    }
  }

  const goNext = () => {
    setCurrentPhotoIndex(i => {
      if (i !== user?.photos?.length - 1) {
        return i + 1
      } else {
        return i
      }
    })
    if (setPhotoIndex) {
      setPhotoIndex(i => {
        if (i !== user?.photos?.length - 1) {
          return i + 1
        } else {
          return i
        }
      })
    }
  }
  const heightStyle = height ? {height} : {flex: 1}
  if (user?.deleted) {
    return (
      <View
        style={[
          heightStyle,
          {
            backgroundColor: '#999999',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <MText bold style={{color: '#fff', fontSize: 16}}>
          {t('deleted_user')}
        </MText>
        <View
          style={{
            position: 'absolute',
            bottom: deviceInfo?.small_screen ? normalize(20) : 0,
            right: 0,
            left: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            margin: 20,
          }}>
          <MText boldbold style={styles.username}>
            {user.userName}
          </MText>
          <MFavourite fav={user.favourite} toggleFav={toggleFav} />
        </View>
      </View>
    )
  }

  const panGesture = Gesture.Pan().onEnd(e => {
    if (e.translationX > 50) {
      goPrevious()
      return
    }

    if (e.translationX < -50) {
      goNext()
    }
  })

  console.log(user.favourite)

  return (
    <View style={[{width: '100%'}, heightStyle]}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          justifyContent: 'space-between',
        }}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.29)',
            'rgba(0, 0, 0, 0.00)',
          ]}
          end={{x: 0.5, y: 1}}
          start={{x: 0.5, y: 0}}
          locations={[-0.0754, 0.1666, 0.873]}
          style={{height: '28%'}}>
          {user?.photos?.length > 1 && !setPhotoIndex ? (
            <MProgressBar
              maxStep={user?.photos?.length}
              stepNumber={currentPhotoIndex}
              style={{paddingHorizontal: 20, marginTop: insets.top}}
            />
          ) : (
            <View />
          )}
        </LinearGradient>
        {setPhotoIndex ? (
          <GestureRecognizer
            style={{flex: 1, zIndex: 99}}
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
          <View
            style={[
              styles.changePhotoWrapper,
              deviceInfo.android ? {zIndex: 997} : null,
            ]}>
            <Pressable
              style={styles.changePhotoWrapperLeft}
              onPress={goPrevious}
            />
            <Pressable
              style={styles.changePhotoWrapperRight}
              onPress={goNext}
            />
          </View>
        )}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.29)',
            'rgba(0, 0, 0, 0.00)',
          ]}
          end={{x: 0.5, y: 0}}
          start={{x: 0.5, y: 1}}
          locations={[-0.0754, 0.1666, 0.873]}
          style={{justifyContent: 'flex-end', paddingBottom: 17, flex: 1}}
          pointerEvents="box-none">
          <View
            style={[styles.bottom, fullscreen ? {bottom: insets.bottom} : {}]}
            pointerEvents="box-none">
            <View style={styles.info} pointerEvents="box-none">
              <View style={styles.socials} pointerEvents="box-none">
                {user.instagram && (
                  <TouchableOpacity
                    style={styles.instagram}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.instagram.com/' + user.instagram,
                      )
                    }>
                    <InstagramIcon />
                  </TouchableOpacity>
                )}
                {user.vk && (
                  <TouchableOpacity
                    style={styles.vk}
                    onPress={() =>
                      Linking.openURL('https://vk.com/' + user.vk)
                    }>
                    <VkIcon />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.infoWrapper}>
                <ActionButton
                  event={user}
                  updateStatus={s =>
                    setEvent(e => ({...e, participantStatus: s}))
                  }
                />
                {personal()}
                {user.motivations.length > 0 && (
                  <View style={styles.motivations}>
                    {user.motivations.includes('FIND_PEOPLE') ? (
                      <MText bold style={{color: '#fff', fontSize: 14}}>
                        {t('motivations.FIND_PEOPLE')}
                      </MText>
                    ) : (
                      <></>
                    )}
                    {user.motivations.includes('FIND_PEOPLE') &&
                    user.motivations.includes('FIND_ENTERTAINMENT') ? (
                      <MText bold style={{color: '#fff', fontSize: 14}}>
                        {' '}
                        /{' '}
                      </MText>
                    ) : (
                      <></>
                    )}
                    {user.motivations.includes('FIND_ENTERTAINMENT') ? (
                      <MText bold style={{color: '#fff', fontSize: 14}}>
                        {t('motivations.FIND_ENTERTAINMENT')}
                      </MText>
                    ) : (
                      <></>
                    )}
                    {/* {user.motivations.map((m,i) => (
                            <View style={[styles.motivation, styles['motivation_' + m]]} key={i}>
                              <MText style={styles.motivationText}>{t('motivations.' + m)}</MText>
                            </View>
                          ))} */}
                  </View>
                )}
                {user?.about && (
                  <View style={styles.description}>
                    <ViewMoreText
                      numberOfLines={2}
                      renderViewMore={_renderTruncatedFooter}
                      renderViewLess={_renderRevealedFooter}>
                      <MText bold style={[styles.descriptionText]}>
                        {user.about}
                      </MText>
                    </ViewMoreText>
                    {/*<ReadMore*/}
                    {/*  renderTruncatedFooter={_renderTruncatedFooter}*/}
                    {/*  renderRevealedFooter={_renderRevealedFooter}*/}
                    {/*  numberOfLines={2}>*/}
                    {/*  <MText bold style={[styles.descriptionText]}>*/}
                    {/*    {user.about}*/}
                    {/*  </MText>*/}
                    {/*</ReadMore>*/}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.buttons}>
              <MFavourite
                fav={user.favourite}
                toggleFav={toggleFav}
                style={styles.fav}
              />
              {!chatView ? (
                <TouchableOpacity
                  style={styles.sendMessage}
                  onPress={() =>
                    nav.push('ChatView', {user, parentRoute: 'ProfileView'})
                  }>
                  <SendMessageIcon alt />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={styles.share} onPress={share}>
                <ShareIcon />
              </TouchableOpacity>
              {/*{event.latitude && (*/}
              {/*  <TouchableOpacity style={styles.compas} onPress={() => nav.push('Locator', {event: event})}>*/}
              {/*    <CompasSimpleIcon size={45}/>*/}
              {/*  </TouchableOpacity>*/}
              {/*)}*/}
            </View>
          </View>
        </LinearGradient>
      </View>
      <MImage
        source={{uri: user.photos[currentPhotoIndex].uri}}
        style={{flex: 1}}
        resizeMode="cover"
        img="m"
        small
      />
    </View>
  )
}

export default React.memo(User)

const styles = StyleSheet.create({
  changePhotoWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  changePhotoWrapperLeft: {
    flex: 1,
  },
  changePhotoWrapperRight: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },
  fio: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  city: {
    color: '#fff',
    fontSize: 14,
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 14,
  },
  reactions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
    fontSize: 14,
  },
  buttons: {
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'flex-end',
    zIndex: 998,
  },
  info: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  infoWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  compas: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  share: {
    paddingHorizontal: 8,
    paddingBottom: 9,
    paddingTop: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,16,34,0.4)',
    zIndex: 9999,
  },
  sendMessage: {
    paddingHorizontal: 9,
    paddingBottom: 8,
    paddingTop: 11,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,16,34,0.4)',
    marginBottom: 10,
  },
  fav: {
    marginBottom: 10,
    zIndex: 999,
  },
  socials: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  instagram: {
    marginRight: 10,
    zIndex: 999,
  },
  vk: {
    marginRight: 10,
  },
  ownerAvatar: {
    height: 50,
    width: 50,
    borderRadius: 15,
    marginBottom: 20,
  },
  overlay: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    justifyContent: 'flex-end',
  },
  settingsContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 0,
  },
  settings: {
    marginRight: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})
