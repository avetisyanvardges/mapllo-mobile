import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Haptics from 'expo-haptics'
import * as SecureStore from 'expo-secure-store'
import {useState} from 'react'
import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useDispatch, useSelector} from 'react-redux'

import RegistrationCityStep from './city'
import RegistrationGeneralInfoStep from './general'
import StepHeader from './header'
import RegistrationPhotoStep from './photo'
import MBack from '../../../components/MBack'
import MProgressBar from '../../../components/MProgressBar'
import MText from '../../../components/MText'
import {createProfile} from '../../../configs/api'
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon'
import {authenticate, logout} from '../../../slices/authReducer'

export default function Register({route}) {
  const [username, setUsername] = useState()
  const [birthday, setBirthday] = useState()
  const [visible, setVisible] = useState(false)
  const [gender, setGender] = useState()
  const [photos, setPhotos] = useState([])
  const [placeId, setPlaceId] = useState()
  const [city, setCity] = useState()
  const [accepted, setAccepted] = useState(false)
  const [showLocation, setShowLocation] = useState(true)
  const [motivations, setMotivations] = useState([
    'FIND_PEOPLE',
    'FIND_ENTERTAINMENT',
  ])
  const insets = useSafeAreaInsets()
  const token = useSelector(state => state.auth.token)
  const [stepNumber, setStepNumber] = useState(0)
  const dispatch = useDispatch()
  const {t, i18n} = useTranslation()

  const goBack = () => {
    if (stepNumber === 0) {
      Haptics.selectionAsync()
        .then(() => AsyncStorage.removeItem('token'))
        .then(() => dispatch(logout()))
    } else {
      setStepNumber(stepNumber - 1)
    }
  }

  const step = () => {
    switch (stepNumber) {
      case 0:
        return (
          <RegistrationGeneralInfoStep
            username={username}
            setUsername={setUsername}
            birthday={birthday}
            setBirthday={setBirthday}
            gender={gender}
            setGender={setGender}
            visible={visible}
            setVisible={setVisible}
          />
        )
      case 1:
        return (
          <RegistrationPhotoStep
            route={route}
            photos={photos}
            setPhotos={setPhotos}
          />
        )
      case 2:
        return (
          <RegistrationCityStep
            motivations={motivations}
            setMotivations={setMotivations}
            showLocation={showLocation}
            setShowLocation={setShowLocation}
            accepted={accepted}
            setAccepted={setAccepted}
            city={city}
            setCity={setCity}
            placeId={placeId}
            setPlaceId={setPlaceId}
          />
        )
    }
  }

  const stepHeader = () => {
    switch (stepNumber) {
      case 0:
        return (
          <StepHeader
            stepNumber={1}
            title={t('UnauthorizedStack.Register.01.title')}
            subtitle={t('UnauthorizedStack.Register.01.subtitle')}
          />
        )
      case 1:
        return (
          <StepHeader
            stepNumber={2}
            title={t('UnauthorizedStack.Register.02.title')}
            subtitle={t('UnauthorizedStack.Register.02.subtitle')}
          />
        )
      case 2:
        return (
          <StepHeader
            stepNumber={3}
            title={t('UnauthorizedStack.Register.03.title')}
            subtitle={t('UnauthorizedStack.Register.03.subtitle')}
          />
        )
    }
  }

  const nextButton = () => {
    const buttonStyles = [styles.nextButton]
    let active = false
    switch (stepNumber) {
      case 0: {
        if (username && birthday && gender) {
          buttonStyles.push(styles.nextButtonActive)
          active = true
        }

        if (visible) {
          buttonStyles.push(styles.nextButtonActive)
        }
        break
      }
      case 1: {
        if (photos && photos.length > 0) {
          buttonStyles.push(styles.nextButtonActive)
          active = true
        }
        break
      }
      case 2: {
        if (placeId && accepted) {
          buttonStyles.push(styles.nextButtonActive)
          active = true
        }
        break
      }
    }
    const register = async () => {
      const formData = new FormData()
      const json = JSON.stringify({
        username,
        birthday,
        gender,
        lang: i18n.language,
        placeId,
        showOnlineOnMap: showLocation,
        motivations,
      })
      formData.append('data', {
        string: json,
        type: 'application/json',
      })
      // formData.append("avatar",{
      //   name: photo.fileName,
      //   uri: photo.uri,
      //   type: photo.type,
      // });
      photos.map(photo => {
        let mutatedName
        if (!photo.fileName) {
          const [fileName] = photo.uri.split('/').reverse()
          mutatedName = fileName
        } else {
          mutatedName = photo.fileName
        }
        formData.append('photos', {
          name: mutatedName,
          uri: photo.uri,
          type: 'image/jpeg',
        })
      })

      const createProfileApiResponse = await createProfile(formData)
      dispatch(authenticate({...createProfileApiResponse?.data, token}))
    }

    const buttonText =
      stepNumber === 2
        ? t('UnauthorizedStack.Register.finish')
        : t('UnauthorizedStack.Register.next')
    return (
      <TouchableOpacity
        disabled={!active}
        style={buttonStyles}
        onPress={() => {
          Haptics.selectionAsync()
          if (stepNumber >= 2) {
            register()
          } else {
            setStepNumber(stepNumber + 1)
          }
        }}>
        <MText style={styles.nextButtonText}>{buttonText}</MText>
      </TouchableOpacity>
    )
  }
  const source =
    stepNumber === 0
      ? require('../../../../assets/register/register_1.png')
      : stepNumber === 1
        ? require('../../../../assets/register/register_2.jpg')
        : require('../../../../assets/register/register_3.jpg')
  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <ImageBackground source={source} resizeMode="cover" style={{flex: 1}}>
          <MBack top={70} left={20} onPress={goBack} />
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingTop: insets.top,
            }}>
            <View style={styles.backgroundView}>
              <MProgressBar maxStep={3} stepNumber={stepNumber} />
            </View>
            {stepHeader()}
          </SafeAreaView>
          <View style={styles.sheetCap} />
        </ImageBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? undefined : 'padding'}>
          <SafeAreaView style={styles.sheet}>
            <View style={styles.sheetContent}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  {step()}
                  {!visible && nextButton()}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  nextButton: {
    height: 38,
    marginBottom: 10,
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
  },
  nextButtonActive: {
    backgroundColor: '#A347FF',
  },
  step: {
    flex: 1,
    height: 7,
    backgroundColor: '#5C6E90',
    borderRadius: 3,
  },
  stepMargin: {
    marginHorizontal: 10,
  },
  stepActive: {
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    top: 70,
    left: 20,
    width: 32,
    height: 32,
    zIndex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  backgroundView: {
    paddingHorizontal: 20,
  },
  sheetCap: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 40,
    backgroundColor: '#fff',
  },
  sheet: {
    backgroundColor: '#fff',
  },
  sheetContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
})
