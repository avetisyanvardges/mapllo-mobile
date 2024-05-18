import { Animated, StyleSheet, TouchableOpacity, View, } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import MText from '../../components/MText'
import ReadMore from 'react-native-read-more-text'
import { useTranslation } from 'react-i18next'
import { useIsFocused, useNavigation, } from '@react-navigation/native'
import ActionButton from '../Event/actionButton'
import Video from 'react-native-video'
import DeletedAva from '../../icons/DeletedAva'
import MImage from '../../components/MImage'

export default function EventPreview({ event, updateEvent, deselect }) {
  const { t } = useTranslation()
  const scaleAnim = useRef(new Animated.Value(0)).current

  const [show, setShow] = useState(false)
  const focused = useIsFocused()
  const [eventNested, setEventNested] = useState(event)
  const nav = useNavigation()
  const isDating = eventNested?.type === 'DATING'
  const typeBackground = isDating
    ? { backgroundColor: '#F3267D' }
    : { backgroundColor: '#F3267D' }

  useEffect(() => {
    if (event) {
      setEventNested(event)
    }
  }, [event])

  useEffect(() => {
    if (eventNested && event) {
      setShow(true)
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else if (show) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShow(false)
      })
    }
  }, [eventNested, event])

  const _renderTruncatedFooter = handlePress => (
    <MText style={{ color: '#fff', marginTop: 5 }} onPress={handlePress}>
      {t('more')}
    </MText>
  )
  const _renderRevealedFooter = handlePress => (
    <MText style={{ color: '#fff', marginTop: 5 }} onPress={handlePress}>
      {t('Profile.about.hide')}
    </MText>
  )

  const dateStr = () => {
    if (event && event.date) {
      const date = new Date(event.date)
      const yyyy = date.getFullYear()
      let mm = date.getMonth() + 1 // Months start at 0!
      let dd = date.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm

      return dd + '.' + mm + '.' + yyyy
    }
  }

  const background = () => {
    if (eventNested.videoUrl) {
      return (
        <Video
          volume={1}
          repeat
          paused={!focused}
          poster={eventNested.avatarUrl}
          automaticallyWaitsToMinimizeStalling
          source={{ uri: eventNested.videoUrl }}
          style={styles.backgroundImage}
          posterResizeMode="cover"
          resizeMode={'cover'}
        />
      )
    } else {
      return (
        <MImage
          source={{ uri: eventNested.avatarUrl }}
          style={styles.backgroundImage}
          resizeMode={'cover'}
          img={'m'}
        />
      )
    }
  }

  return (
    <View style={styles.container}
      onTouchStart={() => event && deselect()}
      pointerEvents={event ? 'auto' : 'none'}>
      {show ? (
        <Animated.View
          style={[styles.previewContainer, { transform: [{ scale: scaleAnim }] }]}>
          {background()}
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.6)',
              'transparent',
              'transparent',
              'transparent',
              'rgba(0,0,0,0.6)',
            ]}
            pointerEvents={'box-none'}
            style={styles.overlay}>
            <View style={styles.topBar}>
              <View style={styles.ownerInfo}>
                {eventNested.ownerAvatarUrl ? (
                  <TouchableOpacity
                    onPress={() =>
                      nav.push('ProfileView', { id: eventNested.ownerId })
                    }>
                    <FastImage
                      source={{ uri: eventNested.ownerAvatarUrl }}
                      style={styles.ownerAvatar}
                      resizeMode={'cover'}
                    />
                  </TouchableOpacity>
                ) : (
                  <DeletedAva size={40} style={styles.ownerAvatar} />
                )}
                <MText bold style={styles.ownerName}>
                  {eventNested.ownerUsername}
                </MText>
              </View>
              <View style={styles.dateContainer}>
                <View style={[styles.dateBox, typeBackground]}>
                  <MText bold style={styles.dateText}>
                    {dateStr()}
                  </MText>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                nav.push('EventView', { event: eventNested })
              }}
            />
            <View style={styles.bottomBar}>
              <View style={{ flexDirection: 'row' }}>
                <ActionButton
                  event={eventNested}
                  updateStatus={s => {
                    updateEvent({ ...eventNested, participantStatus: s })
                    setEventNested({ ...eventNested, participantStatus: s })
                  }}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <ReadMore
                  renderTruncatedFooter={_renderTruncatedFooter}
                  renderRevealedFooter={_renderRevealedFooter}
                  numberOfLines={2}>
                  <MText bold style={[styles.descriptionText]}>
                    {eventNested.description}
                  </MText>
                </ReadMore>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      ) : (
        <></>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  descriptionText: {
    color: '#fff',
  },
  applyText: {
    color: '#fff',
    fontSize: 18,
  },
  applyButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateBox: {
    padding: 5,
    borderRadius: 5,
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
  },
  ownerAvatar: {
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  ownerInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ownerName: {
    color: '#fff',
    marginLeft: 7,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  bottomBar: {
    margin: 20,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    flex: 1,
    borderRadius: 30,
  },
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewContainer: {
    height: 520,
    width: 250,
    borderRadius: 30,
  },
})
