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
import ViewMoreText from 'react-native-view-more-text'
import {useSelector} from 'react-redux'

import ActionButton from './actionButton'
import MFavourite from '../../components/MFavourite'
import MImage from '../../components/MImage'
import MParticipants from '../../components/MParticipants'
import MReaction from '../../components/MReaction'
import MText from '../../components/MText'
import {addToFav} from '../../configs/api'
import {shareEventUrl} from '../../configs/constants'
import CompasSimpleIcon from '../../icons/CompasSimpleIcon'
import DeletedAva from '../../icons/DeletedAva'
import PlayIcon from '../../icons/PlayIcon'
import SendMessageIcon from '../../icons/SendMessageIcon'
import ShareIcon from '../../icons/ShareIcon'

export default function Event({
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
    if (event !== eventInitial) {
      setEvent(eventInitial)
    }
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

  const share = () => {
    const url = shareEventUrl + event.id
    const message = t('join') + '\n' + url
    Share.share({message}, {dialogTitle: t('join'), subject: t('join')})
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
            volume={1}
            repeat={false}
            onEnd={() => {
              videoRef.current.seek(0)
            }}
            onLoad={() => setShowVideoPlay(false)}
            paused={!active || paused || !isFocused}
            poster={event.avatarUrl}
            automaticallyWaitsToMinimizeStalling
            source={{uri: event.videoUrl}}
            style={{flex: 1}}
            posterResizeMode="cover"
            resizeMode="cover"
          />
        ) : (
          <MImage
            source={{uri: event.avatarUrl}}
            style={{flex: 1}}
            resizeMode="cover"
            img="m"
            small
          />
        )}
      </Pressable>
    )
  }

  const heightStyle = height ? {height} : {flex: 1}

  if (event.deleted) {
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
          {t('deleted_event')}
        </MText>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            margin: 20,
          }}>
          <MFavourite fav={event.favourite} toggleFav={toggleFav} />
        </View>
      </View>
    )
  }

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
          <View />
        </LinearGradient>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.29)',
            'rgba(0, 0, 0, 0.00)',
          ]}
          end={{x: 0.5, y: 0}}
          start={{x: 0.5, y: 1.5}}
          locations={[-0.0754, 0.1666, 0.873]}
          style={{justifyContent: 'flex-end', paddingBottom: 17, flex: 1}}
          pointerEvents="box-none">
          <View
            style={[styles.bottom, fullscreen ? {bottom: insets.bottom} : {}]}
            pointerEvents="box-none">
            <View style={styles.info} pointerEvents="box-none">
              <View style={styles.infoWrapper}>
                {reactions()}
                <View style={{marginTop: 15}}>
                  <ActionButton
                    event={event}
                    updateStatus={s =>
                      setEvent(e => ({...e, participantStatus: s}))
                    }
                  />
                </View>
                {event.participants && event.participants.length > 0 && (
                  <View style={{marginTop: 17}}>
                    <MParticipants
                      event={event}
                      applications={event.participants.filter(
                        p => p.status === 'APPLICATION',
                      )}
                      participants={event.participants.filter(
                        p => p.status === 'ACCEPTED',
                      )}
                      removeUser={userId =>
                        setEvent(e => ({
                          ...e,
                          participants: e.participants.filter(
                            p => p.id !== userId,
                          ),
                        }))
                      }
                      acceptUser={user =>
                        setEvent(e => ({
                          ...e,
                          participants: [user, ...e.participants],
                        }))
                      }
                    />
                  </View>
                )}
                <View style={styles.description}>
                  <ViewMoreText
                    numberOfLines={2}
                    renderViewMore={_renderTruncatedFooter}
                    renderViewLess={_renderRevealedFooter}>
                    <MText bold style={[styles.descriptionText]}>
                      {event.description}
                    </MText>
                  </ViewMoreText>
                  {/*<ReadMore*/}
                  {/*  renderTruncatedFooter={_renderTruncatedFooter}*/}
                  {/*  renderRevealedFooter={_renderRevealedFooter}*/}
                  {/*  numberOfLines={2}>*/}
                  {/*  <MText bold style={[styles.descriptionText]}>*/}
                  {/*    {event.description}*/}
                  {/*  </MText>*/}
                  {/*</ReadMore>*/}
                </View>
              </View>
            </View>
            <View style={styles.buttons}>
              {event.ownerId !== profileId &&
                (event.ownerAvatarUrl ? (
                  <TouchableOpacity
                    onPress={() =>
                      nav.push('ProfileView', {id: event.ownerId})
                    }>
                    <MImage
                      source={{uri: event.ownerAvatarUrl}}
                      style={styles.ownerAvatar}
                      resizeMode="cover"
                      img="ava"
                    />
                  </TouchableOpacity>
                ) : (
                  <DeletedAva size={38} style={styles.ownerAvatar} />
                ))}
              <MFavourite
                fav={event.favourite}
                toggleFav={toggleFav}
                style={styles.fav}
              />
              {event.ownerId !== profileId && (
                <TouchableOpacity
                  style={styles.sendMessage}
                  onPress={() => nav.push('ChatView', {id: event.ownerId})}>
                  <SendMessageIcon alt />
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
      </View>
      {background()}
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    marginTop: 15,
  },
  descriptionText: {
    color: '#fff',
  },
  reactions: {
    flexDirection: 'row',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  buttons: {
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'flex-end',
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
  },
  ownerAvatar: {
    height: 38,
    width: 38,
    borderRadius: 8,
    marginBottom: 20,
  },
  overlay: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
})
