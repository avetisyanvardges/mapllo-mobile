import {Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import CameraIcon from '../../../icons/CameraIcon'
import * as ImagePicker from 'expo-image-picker'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/native'
import PenIcon from '../../../icons/PenIcon'
import {useEffect} from 'react'
import {deviceInfo} from "../../../assets/deviceInfo";

export default function RegistrationPhotoStep({route, photos, setPhotos}) {
  const {t} = useTranslation()
  const nav = useNavigation()

  const pickPhoto = async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(p => {
        if (p.granted || deviceInfo.android) {
          return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: deviceInfo.ios ? 0 : 0.7,
          })
        } else {
          alert(t('alerts.MediaLibraryPermissionsNotGiven'))
        }
      })
      .then(r => {
        if (r?.assets?.length && r.assets.length > 0) {
          const img = r.assets[0]
          nav.push('Preview', {img: img, register: true})
        }
      })
  }

  useEffect(() => {
    if (route.params?.photos) {
      setPhotos(route.params?.photos)
    }
  }, [route.params?.photos])

  return (
    <View style={styles.previewContainer}>
      {photos.length === 0 ? (
        <TouchableOpacity style={styles.preview} onPress={pickPhoto}>
          <CameraIcon />
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity style={styles.penContainer} onPress={pickPhoto}>
            <PenIcon size={16} />
          </TouchableOpacity>
          <Image source={{uri: photos[0].uri}} style={styles.preview} />
          {/*<View style={styles.croppedPreviewContainer}>*/}
          {/*  <Image source={{uri: croppedPhoto.uri}} style={styles.croppedPreview}/>*/}
          {/*</View>*/}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  penContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    padding: 11,
    position: 'absolute',
    zIndex: 1,
    right: -10,
    top: -10,
    borderRadius: 20,
  },
  previewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 60,
  },
  preview: {
    height: 167,
    width: 167,
    borderRadius: 30,
    borderColor: '#E3E3E3',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  croppedPreviewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -30,
    bottom: 0,
  },
  croppedPreview: {
    height: 100,
    width: 47,
    borderRadius: 10,
    borderColor: '#E3E3E3',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
