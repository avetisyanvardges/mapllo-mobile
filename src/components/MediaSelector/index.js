import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import MText from '../MText'
import * as React from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import CameraIcon from '../../icons/CameraIcon'
import {useNavigation} from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video'
import {createEvent, updateEventAvatar} from '../../configs/api'
import MCheckbox from '../MCheckbox'
import {useSelector} from 'react-redux'
import MBack from '../MBack'
import TrashBinIcon from '../../icons/TrashBinIcon'

export default function MediaSelector({route}) {
  const d = {
    ...route.params?.data,
    date: route.params?.data?.date ? new Date(route.params?.data?.date) : null,
  }
  const [data, setData] = useState(d)
  const {t} = useTranslation()
  const nav = useNavigation()
  const avatar = useSelector(state => state.auth.photos)[0]
  const preview = data.usePhotoProfile
    ? {path: avatar.uri}
    : route.params?.preview
  const [inCreation, setInCreation] = useState(false)

  const create = () => {
    const file = {fileName: 's', uri: preview.path, type: preview.type}
    const photo = data.usePhotoProfile ? null : preview.duration ? null : file
    const video = data.usePhotoProfile ? null : preview.duration ? file : null
    if (data.id) {
      updateEventAvatar(data.id, photo, video, !!data.usePhotoProfile).then(
        () => {
          nav.navigate('Feed', {updateTime: new Date().getTime()})
        },
      )
    } else {
      if (!inCreation) {
        setInCreation(true)
        createEvent(data, photo, video).then(() => {
          nav.navigate('Map')
        })
      }
    }
  }

  const enabledColor = data.type === 'DATING' ? '#F3267D' : '#A347FF'

  const text = data.id
    ? data.type === 'EVENT'
      ? 'update_the_event'
      : 'update_the_date'
    : data.type === 'EVENT'
    ? 'create_an_event'
    : 'create_a_date'

  if (preview) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
        <MBack top={70} left={20} />

        <TouchableOpacity
          onPress={() =>
            nav.push('Camera', {
              screen: 'MediaSelector',
              screenKey: route.key,
              media: preview,
            })
          }
          style={[
            styles.backArrowContainer,
            {
              paddingVertical: 7,
              paddingLeft: 8,
              paddingRight: 8,
              top: 70,
              right: 20,
            },
          ]}>
          <TrashBinIcon />
        </TouchableOpacity>

        <FastImage
          source={{uri: preview.path}}
          style={[
            styles.cameraFull,
            {
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            },
          ]}
          resizeMode={'cover'}
          priority={'high'}
        />

        <View style={styles.cancelContainer}>
          <TouchableOpacity
            style={[
              styles.acceptBox,
              preview ? {backgroundColor: enabledColor} : {},
            ]}
            disabled={!preview}
            onPress={create}>
            <MText style={styles.acceptText}>{t(text)}</MText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <LinearGradient
      colors={['#75A0CA', '#EDEEF1']}
      pointerEvents={'box-none'}
      style={styles.background}>
      <MBack top={70} left={20} />
      <View style={styles.centerBlockContainer}>
        {preview && preview.duration ? (
          <Video
            volume={0}
            muted={true}
            paused={true}
            source={{
              uri: preview.path,
            }}
            style={styles.centerBlock}
            posterResizeMode="cover"
            resizeMode={'cover'}
          />
        ) : preview ? (
          <TouchableOpacity
            onPress={() =>
              nav.push('Camera', {
                screen: 'MediaSelector',
                screenKey: route.key,
                media: preview,
              })
            }
            disabled={data.usePhotoProfile}>
            <FastImage
              source={{uri: preview.path}}
              style={styles.centerBlock}
              resizeMode={'cover'}
              priority={'high'}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.centerBlock}
            onPress={() =>
              nav.push('Camera', {
                screen: 'MediaSelector',
                screenKey: route.key,
              })
            }>
            <CameraIcon />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cancelContainer}>
        {data.type === 'DATING' && (
          <View style={styles.profilePhoto}>
            <MCheckbox
              style={{margin: 10}}
              checked={data.usePhotoProfile}
              setChecked={c => setData({...data, usePhotoProfile: c})}
            />
            <MText>{t('use_profile_photo')}</MText>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.acceptBox,
            preview ? {backgroundColor: enabledColor} : {},
          ]}
          disabled={!preview}
          onPress={create}>
          <MText style={styles.acceptText}>{t(text)}</MText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  profilePhoto: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBlockContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  centerBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 85,
    width: 85,
  },
  cameraFull: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  acceptText: {
    color: '#fff',
  },
  acceptBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 15,
    height: 40,
  },
  boxEnabled: {
    backgroundColor: '#A347FF',
  },
  cancelContainer: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 50,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    top: 70,
    width: 32,
    height: 32,
    zIndex: 1,
  },
})
