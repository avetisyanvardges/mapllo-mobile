import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useDispatch} from 'react-redux'

import CreateEventNested from './create'
import {normalize} from '../../assets/normalize'
import MBack from '../../components/MBack'
import MText from '../../components/MText'

const photo1 = require('../../../assets/events/background_1.jpg')
const photo2 = require('../../../assets/events/background_2.jpg')
const photo3 = require('../../../assets/events/background_3.jpg')
const photo4 = require('../../../assets/events/background_4.jpg')
const photo5 = require('../../../assets/events/background_5.jpg')
const photo6 = require('../../../assets/events/background_6.jpg')

const photos = [photo1, photo2, photo3, photo4, photo5, photo6]

export default function CreateEvent({route}) {
  const [backgroundPhoto] = useState(
    photos[Math.floor(Math.random() * photos.length)],
  )
  const insets = useSafeAreaInsets()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const nav = useNavigation()
  const [data, setData] = useState()
  const [preview, setPreview] = useState()

  const createEvent = data => {
    // nav.push('MediaSelector', {...data, lastScreen: 'Create_Event'})
    setData(data)
    const text = data.id
      ? data.data.type === 'EVENT'
        ? 'update_the_event'
        : 'update_the_date'
      : data.data.type === 'EVENT'
        ? 'create_an_event'
        : 'create_a_date'
    nav.push('Camera', {
      screen: 'CreateEvent',
      screenKey: route.key,
      media: preview,
      next: text,
      eventData: data?.data,
    })
  }

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <View style={{flex: 1}}>
          <FastImage
            source={backgroundPhoto}
            resizeMode="cover"
            style={styles.backgroundImage}>
            <MBack top={insets.top || normalize(20)} left={normalize(20)} />
            <MText
              bold
              style={{
                color: '#fff',
                marginBottom: 35,
                marginLeft: 40,
                fontSize: 34,
              }}>
              {t('event')}
            </MText>
          </FastImage>
          <CreateEventNested
            route={route}
            onFinish={createEvent}
            button="next"
            currentScreen="Create_Event"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    marginVertical: 8,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: -20,
  },
  sheetContent: {
    paddingHorizontal: 40,
    paddingTop: 16,
  },
  buttonStyle: {
    height: 38,
    marginVertical: 10,
    backgroundColor: '#818195',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#A347FF',
  },
  nextButtonText: {
    color: '#fff',
  },
})
