import {useIsFocused, useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import ReadMore from 'react-native-read-more-text'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Video from 'react-native-video'
import {useSelector} from 'react-redux'

import ActionButton from './actionButton'
import MFavourite from '../../components/MFavourite'
import MReaction from '../../components/MReaction'
import MText from '../../components/MText'
import {addToFav} from '../../configs/api'


import {shareEventUrl} from '../../configs/constants'
import CompasSimpleIcon from '../../icons/CompasSimpleIcon'
import PlayIcon from '../../icons/PlayIcon'
import SendMessageIcon from '../../icons/SendMessageIcon'
import ShareIcon from '../../icons/ShareIcon'


export default function Dating({
  active,
  eventInitial,
  height,
  popup,
  fullscreen = false,
}) {
  const profileId = useSelector(state => state.auth.id)
  const [event, setEvent] = useState(eventInitial)
  const [paused, setPaused] = useState(false)
  const [showVideoPlay, setShowVideoPlay] = useState(!!eventInitial.videoUrl)
  const videoRef = useRef()
  const isFocused = useIsFocused()

  const {t, i18n} = useTranslation()
  const nav = useNavigation()

  const insets = useSafeAreaInsets()

  useEffect(() => {
    setEvent(eventInitial)
  }, [eventInitial])

  const toggleFav = () => {
    addToFav('EVENT', event.id).then(r => {
      const isFav = r.data
      setEvent(e => ({...e, favourite: isFav}))
      if (isFav) {
        popup.current.add({text: t('added_to_fav'), type: 'normal'})
      } else {
        popup.current.add({text: t('removed_from_fav'), type: 'normal'})
      }
    })
  }

  const reactions = () => {
    return (
      <View style={styles.reactions}>
        <MReaction
          id={event.id}
          type="THUMB"
          reactions={event.reactions}
          userReactions={event.userReactions}
          icon="👍"
          style={{marginRight: 5}}
        />
        <MReaction
          id={event.id}
          type="FIRE"
          reactions={event.reactions}
          userReactions={event.userReactions}
          icon="🔥"
          style={{marginRight: 5}}
        />
        <MReaction
          id={event.id}
          type="HEART"
          reactions={event.reactions}
          userReactions={event.userReactions}
          icon="❤️"
          style={{marginRight: 5}}
        />
        <MReaction
          id={event.id}
          type="EYE_STARS"
          reactions={event.reactions}
          userReactions={event.userReactions}
          icon="🤩"
          style={{marginRight: 5}}
        />
        <MReaction
          id={event.id}
          type="WOMAN_NO"
          reactions={event.reactions}
          userReactions={event.userReactions}
          icon="🙅‍♀️"
          style={{marginRight: 5}}
        />
      </View>
    )
  }

  const _renderTruncatedFooter = handlePress => (
    <MText style={{color: '#fff', marginTop: 5}} onPress={handlePress}>
      {t('more')}
    </MText>
  )
  const _renderRevealedFooter = handlePress => (
    <MText style={{color: '#fff', marginTop: 5}} onPress={handlePress}>
      {t('Profile.about.hide')}
    </MText>
  )
  const personal = () => {
    let nameStr = ''
    if (event.ownerFullname) {
      nameStr += event.ownerFullname + ', '
    }
    nameStr += calculateAge(event.ownerBirthday)
    const city = (i18n.language === 'ru' && 'г. ') + event.ownerCity
    return (
      <View>
        <MText boldbold style={styles.username}>
          {'@' + event.ownerUsername}
        </MText>
        <MText bold style={styles.fio}>
          {nameStr}
        </MText>
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
    return age
  }

  const share = () => {
    const url = shareEventUrl + event.id
    const message = t('join') + '\n' + url
    Share.share({message}, {dialogTitle: message, subject: message})
  }

  const background = () => {
    return (
      <Pressable onPress={() => setPaused(p => !p)} style={{flex: 1}}>
        {event.videoUrl && (!active || paused || showVideoPlay) && (
          <View
            style={{
              position: 'absolute',
              zIndex: 5555,
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              shadowOpacity: 0.3,
              shadowColor: '#000',
              shadowRadius: 10,
            }}>
            <PlayIcon />
          </View>
        )}
        {event.videoUrl ? (
          <Video
            ref={videoRef}
            preferredForwardBufferDuration={20}
            repeat={false}
            onEnd={() => {
              videoRef.current.seek(0)
            }}
            onLoad={() => setShowVideoPlay(false)}
            volume={1}
            paused={!active || paused || !isFocused}
            poster={event.avatarUrl}
            automaticallyWaitsToMinimizeStalling
            source={{uri: event.videoUrl}}
            style={{flex: 1}}
            posterResizeMode="cover"
            resizeMode="cover"
          />
        ) : (
          <FastImage
            source={{uri: event.avatarUrl}}
            style={{flex: 1}}
            resizeMode="cover"
          />
        )}
      </Pressable>
    )
  }

  const heightStyle = height ? {height} : {flex: 1}
  return (
    <View style={[{width: '100%'}, heightStyle]}>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.30)',
          'rgba(0, 0, 0, 0.29)',
          'rgba(0, 0, 0, 0.00)',
        ]}
        end={{x: 0.5, y: 0}}
        start={{x: 0.5, y: 1}}
        locations={[-0.0754, 0.1666, 0.873]}
        pointerEvents="box-none"
        style={[styles.overlay, {height: '100%'}]}>
        <View
          style={[styles.bottom, fullscreen ? {bottom: insets.bottom} : {}]}
          pointerEvents="box-none">
          <View style={styles.info} pointerEvents="box-none">
            <View style={styles.infoWrapper}>
              <ActionButton
                event={event}
                updateStatus={s =>
                  setEvent(e => ({...e, participantStatus: s}))
                }
              />
              {personal()}
              <View style={styles.description}>
                <ReadMore
                  renderTruncatedFooter={_renderTruncatedFooter}
                  renderRevealedFooter={_renderRevealedFooter}
                  numberOfLines={2}>
                  <MText bold style={[styles.descriptionText]}>
                    {event.description}
                  </MText>
                </ReadMore>
              </View>
            </View>
          </View>
          <View style={styles.buttons}>
            {event.ownerId !== profileId && (
              <TouchableOpacity
                onPress={() => nav.push('ProfileView', {id: event.ownerId})}>
                <FastImage
                  source={{uri: event.ownerAvatarUrl}}
                  style={styles.ownerAvatar}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            <MFavourite
              fav={event.favourite}
              toggleFav={toggleFav}
              style={styles.fav}
            />
            {event.ownerId !== profileId && (
              <TouchableOpacity
                style={styles.sendMessage}
                onPress={() => nav.push('ChatView', {id: event.ownerId})}>
                <SendMessageIcon />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.share} onPress={share}>
              <ShareIcon />
            </TouchableOpacity>
            {event.latitude && (
              <TouchableOpacity
                style={styles.compas}
                onPress={() => nav.push('Locator', {event})}>
                <CompasSimpleIcon size={36} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
      {background()}
    </View>
  )
}

const styles = StyleSheet.create({
  username: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 2,
  },
  fio: {
    color: '#fff',
    fontSize: 12,
  },
  city: {
    color: '#fff',
    fontSize: 12,
  },
  description: {
    marginTop: 10,
  },
  descriptionText: {
    color: '#fff',
  },
  reactions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  buttons: {
    alignItems: 'center',
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
    marginBottom: 10,
  },
  sendMessage: {
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,16,34,0.4)',
    marginBottom: 10,
  },
  fav: {
    marginBottom: 10,
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
