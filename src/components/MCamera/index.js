import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {Divider} from '@rneui/base'
import * as ImagePicker from 'expo-image-picker'
import i18n from 'i18next'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import FastImage from 'react-native-fast-image'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Video from 'react-native-video'
import {Camera, useCameraDevices} from 'react-native-vision-camera'

import {deviceInfo} from '../../assets/deviceInfo'
import {createEvent, updateEventAvatar} from '../../configs/api'
import FlipCameraIcon from '../../icons/FlipCameraIcon'
import PhotoLibraryIcon from '../../icons/PhotoLibraryIcon'
import TrashBinIcon from '../../icons/TrashBinIcon'
import MBack from '../MBack'
import MLoader from '../MLoader'
import MPopup from '../MPopup'
import MText from '../MText'

export default function MCamera({route, navigation, update}) {
  // const screen = route.params?.screen
  // const screenKey = route.params?.screenKey
  // const media = route.params?.media
  // const camera = useRef()
  // const videoTimeout = useRef()
  // const progress = useRef()
  // const insets = useSafeAreaInsets()
  // const [focusLeft, setFocusLeft] = useState(-100)
  // const [focusTop, setFocusTop] = useState(-100)
  // const [muted, setMuted] = useState()
  // const [paused, setPaused] = useState(false)
  // const [preview, setPreview] = useState(media)
  // const [anim, setAnim] = useState()
  // const [snapshotTimeout, setSnapshotTimeout] = useState()
  // const [cameraFlip, setCameraFlip] = useState('back')
  // const cameras = useCameraDevices('wide-angle-camera')
  // const [loading, setLoading] = useState(false)
  // const [inCreation, setInCreation] = useState(false)
  // const nav = useNavigation()
  // const {t} = useTranslation()
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  // const nextText = route.params?.next ? route.params?.next : 'apply'
  // const popupRef = useRef()
  //
  // Camera.getCameraPermissionStatus().then(cp => {
  //   if (cp === 'not-determined' || cp === 'denied') {
  //     Camera.requestCameraPermission()
  //   }
  // })
  // Camera.getMicrophonePermissionStatus().then(m => {
  //   if (m === 'not-determined' || m === 'denied') {
  //     return Camera.requestMicrophonePermission()
  //   }
  // })
  // const device = cameraFlip === 'back' ? cameras.back : cameras.front
  // const flipCamera = () => {
  //   setCameraFlip(cameraFlip === 'back' ? 'front' : 'back')
  // }
  // const takePhoto = () => {
  //   camera.current.takePhoto().then(p => {
  //     const mutatedPath = deviceInfo.android ? `file://${p.path}` : p.path
  //     setPreview({...p, path: mutatedPath, type: 'image/jpeg'})
  //   })
  // }
  //
  // const create = () => {
  //   setDeleteModalVisible(false)
  //   if (route.params?.eventData) {
  //     const data = route.params?.eventData
  //     const file = {fileName: 's', uri: preview.path, type: preview.type}
  //     const photo = data.usePhotoProfile ? null : preview.duration ? null : file
  //     const video = data.usePhotoProfile ? null : preview.duration ? file : null
  //     if (data.id) {
  //       updateEventAvatar(data.id, photo, video, !!data.usePhotoProfile).then(
  //         () => {
  //           nav.navigate('Feed', {updateTime: new Date().getTime()})
  //         },
  //       )
  //     } else {
  //       if (!inCreation) {
  //         setInCreation(true)
  //         createEvent(data, photo, video).then(r => {
  //           nav.navigate('Map', {event: r.data?.event, refresh: uuidv4()})
  //         })
  //       }
  //     }
  //   } else {
  //     nav.navigate({key: screenKey, params: {preview}})
  //   }
  // }
  // function uuidv4() {
  //   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  //     (
  //       c ^
  //       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
  //     ).toString(16),
  //   )
  // }
  //
  // const deletePreview = confirmed => {
  //   if (!confirmed) {
  //     setDeleteModalVisible(true)
  //   } else {
  //     setPreview(null)
  //   }
  // }
  //
  // const startVideo = () => {
  //   clearTimeout(snapshotTimeout)
  //   setSnapshotTimeout(null)
  //   videoTimeout.current = setTimeout(() => stopVideo(), 15000)
  //   const anim = progress.current.animate(100, 15000, Easing.linear)
  //   setAnim(anim)
  //   camera.current.startRecording({
  //     fileType: 'mp4',
  //     onRecordingFinished: video => setPreview({...video, type: 'video/mp4'}),
  //     onRecordingError: error => {},
  //   })
  // }
  //
  // useFocusEffect(() => {
  //   setPaused(false)
  //   return () => {
  //     setPaused(true)
  //   }
  // })
  //
  // useEffect(() => {
  //   const removeFocus = setTimeout(() => {
  //     setFocusTop(-100)
  //     setFocusLeft(-100)
  //   }, 2500)
  //   return () => clearTimeout(removeFocus)
  // }, [focusTop])
  //
  // const focus = e => {
  //   const x = e.nativeEvent.locationX
  //   const y = e.nativeEvent.locationY
  //   camera.current
  //     .focus({x, y})
  //     .then(() => {
  //       setFocusTop(y)
  //       setFocusLeft(x)
  //     })
  //     .catch(e => {})
  // }
  // const stopVideo = () => {
  //   if (videoTimeout.current) {
  //     clearTimeout(videoTimeout.current)
  //     anim.reset()
  //     setAnim(null)
  //     progress.current.animate(0, 0, Easing.linear)
  //     videoTimeout.current = null
  //     camera.current.stopRecording()
  //   } else {
  //   }
  // }
  //
  // const startPress = () => {
  //   setSnapshotTimeout(setTimeout(() => startVideo(), 300))
  // }
  //
  // const endPress = () => {
  //   if (snapshotTimeout) {
  //     clearTimeout(snapshotTimeout)
  //     takePhoto()
  //   } else {
  //     stopVideo()
  //   }
  // }
  //
  // const fromGallery = () => {
  //   ImagePicker.requestMediaLibraryPermissionsAsync()
  //     .then(p => {
  //       if (p.granted || deviceInfo.android) {
  //         setLoading(true)
  //         return ImagePicker.launchImageLibraryAsync({
  //           mediaTypes: ImagePicker.MediaTypeOptions.All,
  //           videoMaxDuration: 15,
  //           quality: deviceInfo.ios ? 0 : 0.7,
  //         })
  //       } else {
  //         popupRef.current.add({
  //           text: t('no_gallery_permission'),
  //           type: 'error',
  //         })
  //       }
  //     })
  //     .then(r => {
  //       if (r.assets?.length && r.assets.length > 0) {
  //         const file = r.assets[0]
  //         if (file.duration) {
  //           if (file.duration > 15000) {
  //             popupRef.current.add({text: t('video_too_long'), type: 'error'})
  //             return
  //           }
  //           setPreview({
  //             path: file.uri,
  //             duration: file.duration,
  //             type: 'video/mp4',
  //           })
  //         } else {
  //           setPreview({path: file.uri, type: 'image/jpeg'})
  //         }
  //       }
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }

  return (
      <></>
    // <View style={{flex: 1}}>
    //   <SafeAreaView style={{position: 'absolute', zIndex: 9999, width: '100%'}}>
    //     <View
    //       style={{
    //         margin: 20,
    //         marginTop: insets.top ? insets.top : 16,
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //       }}>
    //       {!deleteModalVisible && <MBack />}
    //
    //       {anim && (
    //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //           <View
    //             style={{
    //               width: 14,
    //               height: 14,
    //               borderRadius: 7,
    //             }}
    //           />
    //           <Text
    //             style={{
    //               color: 'red',
    //               fontWeight: '800',
    //               fontSize: 14,
    //               marginLeft: 5,
    //             }}>
    //             REC
    //           </Text>
    //         </View>
    //       )}
    //       {preview && (
    //         <View
    //           style={{
    //             flex: 1,
    //             justifyContent: 'flex-end',
    //             flexDirection: 'row',
    //           }}>
    //           <TouchableOpacity
    //             onPress={() => deletePreview(false)}
    //             style={{
    //               backgroundColor: 'rgba(10,10,10,0.1)',
    //               padding: 7,
    //               borderRadius: 30,
    //             }}>
    //             <TrashBinIcon />
    //           </TouchableOpacity>
    //           {deleteModalVisible && (
    //             <View style={styles.deleteModal}>
    //               <TouchableOpacity
    //                 style={styles.deleteModalButton}
    //                 onPress={() => {
    //                   setDeleteModalVisible(false)
    //                   deletePreview(true)
    //                 }}>
    //                 <MText style={{color: '#818195'}}>{t('yes')}</MText>
    //               </TouchableOpacity>
    //               <Divider orientation="vertical" />
    //               <TouchableOpacity
    //                 style={styles.deleteModalButton}
    //                 onPress={() => {
    //                   setDeleteModalVisible(false)
    //                 }}>
    //                 <MText style={{color: '#818195'}}>{t('no')}</MText>
    //               </TouchableOpacity>
    //             </View>
    //           )}
    //         </View>
    //       )}
    //     </View>
    //   </SafeAreaView>
    //   {loading && (
    //     <View
    //       style={[
    //         StyleSheet.absoluteFill,
    //         {
    //           backgroundColor: 'rgba(0,0,0,0.6)',
    //           zIndex: 10000,
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         },
    //       ]}>
    //       <MLoader color="#fff" />
    //     </View>
    //   )}
    //   {preview && preview.duration && (
    //     <View
    //       style={[StyleSheet.absoluteFill, {zIndex: 10}]}
    //       onTouchEnd={() => setDeleteModalVisible(false)}>
    //       <TouchableWithoutFeedback onPress={() => setMuted(!muted)}>
    //         <Video
    //           volume={1}
    //           muted={muted}
    //           repeat
    //           paused={paused}
    //           automaticallyWaitsToMinimizeStalling
    //           source={{
    //             uri: preview.path,
    //           }}
    //           style={{
    //             width: '100%',
    //             height: '100%',
    //           }}
    //           bufferConfig={{
    //             minBufferMs: 0,
    //             maxBufferMs: 15000,
    //             bufferForPlaybackMs: 2500,
    //             bufferForPlaybackAfterRebufferMs: 5000,
    //           }}
    //           posterResizeMode="cover"
    //           resizeMode="cover"
    //         />
    //       </TouchableWithoutFeedback>
    //     </View>
    //   )}
    //   {preview && !preview?.duration && (
    //     <View
    //       style={[StyleSheet.absoluteFill, {zIndex: 10}]}
    //       onTouchEnd={() => setDeleteModalVisible(false)}>
    //       <FastImage
    //         source={{uri: preview?.path}}
    //         resizeMode="cover"
    //         style={{flex: 1}}
    //       />
    //     </View>
    //   )}
    //   {device && (
    //     <>
    //       <Camera
    //         muted={false}
    //         ref={camera}
    //         style={StyleSheet.absoluteFill}
    //         device={device}
    //         isActive
    //         isMultiCam
    //         enableZoomGesture
    //         photo
    //         video
    //         audio
    //         orientation="portrait"
    //       />
    //       <SafeAreaView style={{flex: 1}}>
    //         <View style={{flex: 1, justifyContent: 'space-between'}}>
    //           <TouchableWithoutFeedback style={{flex: 1}} onPress={focus}>
    //             <View style={{flex: 1}}>
    //               <View
    //                 style={[
    //                   {
    //                     borderColor: 'yellow',
    //                     borderWidth: 1,
    //                     height: 75,
    //                     width: 75,
    //                     position: 'relative',
    //                     top: focusTop - 32,
    //                     left: focusLeft - 32,
    //                   },
    //                 ]}
    //               />
    //             </View>
    //           </TouchableWithoutFeedback>
    //           <View style={{marginBottom: 50}}>
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'center',
    //                 marginBottom: 14,
    //               }}>
    //               <View
    //                 style={{
    //                   backgroundColor: 'rgba(164,164,164, 0.3)',
    //                   padding: 3,
    //                   borderRadius: 4,
    //                 }}>
    //                 <Text style={{color: 'white', fontSize: 10}}>
    //                   15 {i18n.t('texts.seconds')}
    //                 </Text>
    //               </View>
    //             </View>
    //             <View
    //               style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-around',
    //                 alignItems: 'center',
    //                 marginHorizontal: 30,
    //               }}>
    //               <TouchableOpacity
    //                 onPress={fromGallery}
    //                 style={{alignItems: 'center', width: 70}}>
    //                 <View
    //                   style={{
    //                     backgroundColor: 'rgba(16, 16, 34, 0.4)',
    //                     padding: 8,
    //                     borderRadius: 20,
    //                   }}>
    //                   <PhotoLibraryIcon />
    //                 </View>
    //                 {/*<MText style={{color: 'white', marginTop: 5, fontSize: 10}}>*/}
    //                 {/*  {i18n.t('upload')}*/}
    //                 {/*</MText>*/}
    //               </TouchableOpacity>
    //               <View onTouchStart={startPress} onTouchEnd={endPress}>
    //                 {/*<LinearGradient*/}
    //                 {/*  start={{x: 0.5, y: 1.0}}*/}
    //                 {/*  end={{x: 0.5, y: 0.0}}*/}
    //                 {/*  colors={['#A347FF', 'transparent']}*/}
    //                 {/*  style={{*/}
    //                 {/*    width: 74,*/}
    //                 {/*    height: 74,*/}
    //                 {/*    borderRadius: 37,*/}
    //                 {/*    justifyContent: 'center',*/}
    //                 {/*    alignItems: 'center',*/}
    //                 {/*  }}>*/}
    //                 <View
    //                   style={{
    //                     backgroundColor: 'rgba(16, 16, 34, 0.4)',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     borderRadius: 60,
    //                   }}>
    //                   <View
    //                     style={{
    //                       width: 58,
    //                       height: 58,
    //                       borderRadius: 50,
    //                       backgroundColor: '#A347FF',
    //                       position: 'absolute',
    //                     }}
    //                   />
    //                   <AnimatedCircularProgress
    //                     ref={progress}
    //                     size={74}
    //                     width={4}
    //                     fill={0}
    //                     rotation={180}
    //                     tintColor="red"
    //                   />
    //                 </View>
    //                 {/*</LinearGradient>*/}
    //               </View>
    //               <TouchableOpacity
    //                 onPress={flipCamera}
    //                 style={{alignItems: 'center', width: 70}}>
    //                 <View
    //                   style={{
    //                     backgroundColor: 'rgba(16, 16, 34, 0.4)',
    //                     padding: 8,
    //                     borderRadius: 20,
    //                   }}>
    //                   <FlipCameraIcon />
    //                 </View>
    //                 {/*<Text*/}
    //                 {/*  style={{color: 'white', marginTop: 5, fontSize: 10}}>*/}
    //                 {/*  {i18n.t('flip_camera')}*/}
    //                 {/*</Text>*/}
    //               </TouchableOpacity>
    //             </View>
    //           </View>
    //         </View>
    //       </SafeAreaView>
    //     </>
    //   )}
    //   <SafeAreaView
    //     style={{
    //       position: 'absolute',
    //       bottom: insets.bottom ? insets.bottom : deviceInfo.android ? 24 : 0,
    //       left: 0,
    //       width: '100%',
    //       alignItems: 'center',
    //       zIndex: 9999,
    //     }}>
    //     {/* {(!media || media !== preview) && ( */}
    //     {preview && (
    //       <TouchableOpacity onPress={() => create()} style={{width: '100%'}}>
    //         {/*<LinearGradient*/}
    //         {/*  start={{x: 0.0, y: 0.0}}*/}
    //         {/*  end={{x: 1.0, y: 1.0}}*/}
    //         {/*  colors={['#71EEFB', '#A679FF', '#8E0090']}*/}
    //         {/*  style={{*/}
    //         {/*    height: 30,*/}
    //         {/*    width: 220,*/}
    //         {/*    alignItems: 'center',*/}
    //         {/*    justifyContent: 'center',*/}
    //         {/*    borderRadius: 7,*/}
    //         {/*  }}>*/}
    //         <View
    //           style={{
    //             marginHorizontal: 25,
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             borderRadius: 10,
    //             backgroundColor: '#a347ff',
    //             paddingVertical: 10,
    //           }}>
    //           <MText style={{color: 'white', fontSize: 14}}>
    //             {t(nextText)}
    //           </MText>
    //         </View>
    //         {/*</LinearGradient>*/}
    //       </TouchableOpacity>
    //     )}
    //   </SafeAreaView>
    //   <MPopup ref={popupRef} length={4000} />
    // </View>
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
})
