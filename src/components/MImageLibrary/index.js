import {useNavigation} from '@react-navigation/native'
import {Divider} from '@rneui/base'
import * as ImagePicker from 'expo-image-picker'
import {LinearGradient} from 'expo-linear-gradient'
import {isEmpty} from 'lodash'
import LottieView from 'lottie-react-native'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import GestureRecognizer from 'react-native-swipe-gestures'
import {useDispatch} from 'react-redux'

import ImageList from './ImageList'
import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import {
  addNewPhoto,
  deleteProfilePhoto,
  getOwnProfile,
  setNewAvatar,
} from '../../configs/api'
import PlusIcon from '../../icons/PlusIcon'
import TrashIcon from '../../icons/TrashIcon'
import {updatePhotos} from '../../slices/authReducer'
import MBack from '../MBack'
import MPopup from '../MPopup'
import MText from '../MText'

export default function MImageLibrary({route}) {
  const register = route.params?.register
  const insets = useSafeAreaInsets()
  const [avatar, setAvatar] = useState(
    route.params?.img ? route.params?.img : route.params?.imgs[0],
  )
  const [photos, setPhotos] = useState(
    route.params?.img ? [route.params?.img] : route.params?.imgs,
  )
  const [active, setActive] = useState(0)
  const [loader, setLoader] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const nav = useNavigation()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const popupRef = useRef()
  const carouselRef = useRef()

  useEffect(() => {
    if (!isEmpty(photos)) {
      setLoader(false)
    }
  }, [photos])

  const goPrevious = () => {
    if (active === 0) {
      nav.goBack()
      return
    }

    if (active > 0) {
      carouselRef.current.snapToPrev()
      // carouselRef.current.scrollTo({index: active - 1, animated: true})
    }
  }

  const goNext = () => {
    if (active < photos.length - 1) {
      carouselRef.current.snapToNext()
      // carouselRef.current.scrollTo({index: active + 1, animated: true})
    }
  }

  const next = async () => {
    if (register) {
      nav.navigate('Register', {photos})
    } else {
      nav.goBack()
    }
  }

  const deletePhoto = async () => {
    if (photos.length === 1 && register) {
      nav.navigate('Register')
      return
    }
    if (photos.length > 1) {
      if (active === photos.length - 1) {
        setActive(active - 1)
      }
      if (photos[active] === avatar && active === photos.length - 1) {
        setAvatar(photos[active - 1])
      } else if (photos[active] === avatar && active !== photos.length) {
        setAvatar(photos[active + 1])
      }
      setPhotos(photos.filter(item => photos[active] !== item))
      if (!register) {
        deleteProfilePhoto(photos[active].id)
          .then(() => getOwnProfile())
          .then(p => dispatch(updatePhotos(p.data)))
      }
    } else {
      popupRef.current.add({
        text: t('components.MPopup.onePhoto'),
        type: 'error',
      })
    }
  }

  const addPhoto = async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(p => {
        if (p.granted || deviceInfo.android) {
          setLoader(true)
          return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: deviceInfo.ios ? 0 : 0.7,
          })
        } else {
          alert(t('alerts.MediaLibraryPermissionsNotGiven'))
        }
      })
      .then(r => {
        if (r.assets?.length && r.assets.length > 0) {
          const img = r.assets[0]
          if (!register) {
            addNewPhoto(img)
              .then(r => setPhotos([...photos, {...img, id: r.data}]))
              .then(() => getOwnProfile())
              .then(p => dispatch(updatePhotos(p.data)))
              .then(() => carouselRef.current.snapToItem(photos.length))
          } else {
            setPhotos([...photos, img])
          }
        }
        if (r?.canceled) {
          setLoader(false)
        }
      })
  }

  const makeAvatar = () => {
    setAvatar(photos[active])
    if (!register) {
      setNewAvatar(photos[active].id)
        .then(() => getOwnProfile())
        .then(p => dispatch(updatePhotos(p.data)))
    }
  }

  const panGesture = Gesture.Pan().onUpdate(e => {
    if (e.translationX > 50) {
      goPrevious()
      return
    }

    if (e.translationX < -50) {
      goNext()
    }
  })

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector style={{flex: 1, zIndex: 99}} gesture={panGesture}>
        <FastImage
          source={photos[active]}
          resizeMode="cover"
          style={[styles.container]}>
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.5)',
              'rgba(0,0,0,0.3)',
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0)',
              'rgba(0,0,0,0.3)',
              'rgba(0,0,0,0.9)',
            ]}
            style={styles.container}>
            {loader ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 999,
                  backgroundColor: 'rgba(0,0,0,.5)',
                }}>
                <LottieView
                  style={{width: normalize(100), height: normalize(100)}}
                  source={require('../../../assets/lottie/M.json')}
                  autoPlay
                  loop
                  speed={1.5}
                />
              </View>
            ) : null}
            <MPopup ref={popupRef} />
            <View
              style={styles.changePhotoWrapper}
              onTouchEnd={() => setDeleteModalVisible(false)}>
              <Pressable
                style={styles.changePhotoWrapperLeft}
                onPress={goPrevious}
              />
              <Pressable
                style={styles.changePhotoWrapperRight}
                onPress={goNext}
              />
            </View>
            <View style={styles.overlay} pointerEvents="box-none">
              <SafeAreaView style={{paddingTop: insets.top}}>
                <View style={styles.iconContainer}>
                  {register ? (
                    <MBack absolute={false} />
                  ) : (
                    <View style={{width: 32}} />
                  )}
                  {avatar === photos[active] ? (
                    <View style={styles.mainContainer}>
                      <MText boldbold style={styles.mainText}>
                        {t('components.MImageLibrary.main')}
                      </MText>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.makeMainContainer}
                      onPress={() => {
                        makeAvatar()
                        setDeleteModalVisible(false)
                      }}>
                      <MText boldbold style={styles.makeMainText}>
                        {t('components.MImageLibrary.makeMain')}
                      </MText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.backArrowContainer}
                    onPress={() => setDeleteModalVisible(true)}>
                    <TrashIcon />
                  </TouchableOpacity>
                  {deleteModalVisible && (
                    <View style={styles.deleteModal}>
                      <TouchableOpacity
                        style={styles.deleteModalButton}
                        onPress={() => {
                          setDeleteModalVisible(false)
                          deletePhoto()
                        }}>
                        <MText style={{color: '#818195'}}>{t('yes')}</MText>
                      </TouchableOpacity>
                      <Divider orientation="vertical" />
                      <TouchableOpacity
                        style={styles.deleteModalButton}
                        onPress={() => {
                          setDeleteModalVisible(false)
                        }}>
                        <MText style={{color: '#818195'}}>{t('no')}</MText>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </SafeAreaView>
              <View>
                <View
                  style={styles.carouselAlign}
                  onTouchEnd={() => setDeleteModalVisible(false)}>
                  <ImageList
                    innerRef={carouselRef}
                    data={photos}
                    setActive={i => setActive(i)}
                    addPhoto={addPhoto}
                  />
                  <View style={styles.plusContainerWrapper}>
                    <TouchableOpacity
                      style={styles.plusContainer}
                      onPress={addPhoto}>
                      <PlusIcon size={14} />
                    </TouchableOpacity>
                  </View>
                </View>
                <SafeAreaView>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => next()}>
                    <MText style={styles.nextButtonText}>
                      {t(
                        register ? 'UnauthorizedStack.Register.next' : 'apply',
                      )}
                    </MText>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </LinearGradient>
        </FastImage>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  deleteModalButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  deleteModal: {
    position: 'absolute',
    left: 0,
    width: 300,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10000,
  },
  changePhotoWrapper: {
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  carouselAlign: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  plusContainerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 40,
  },
  plusContainer: {
    padding: 10,
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 50,
  },
  mainText: {
    color: '#fff',
  },
  mainContainer: {
    backgroundColor: '#FFA012',
    shadowOpacity: 1,
    shadowColor: '#FFA012',
    shadowRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  makeMainText: {
    color: '#818195',
  },
  makeMainContainer: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nextButton: {
    height: 38,
    marginBottom: 10,
    backgroundColor: '#A347FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  nextButtonText: {
    color: '#fff',
  },
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    width: 32,
    height: 32,
    zIndex: 1,
  },
  iconContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
  },
})
