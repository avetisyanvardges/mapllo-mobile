import React, {useState} from 'react'
import {Keyboard, StyleSheet, TouchableWithoutFeedback, View,} from 'react-native'
import {useTranslation} from 'react-i18next'
import * as Haptics from 'expo-haptics'
import MText from '../../components/MText'
import FastImage from 'react-native-fast-image'
import {useNavigation} from '@react-navigation/native'
import CreateDatingNested from './create'

const minDate = new Date()

const photo1 = require('../../../assets/datings/background_1.png')
const photo2 = require('../../../assets/datings/background_2.png')
const photo3 = require('../../../assets/datings/background_3.png')
const photo4 = require('../../../assets/datings/background_4.png')
const photo5 = require('../../../assets/datings/background_5.png')
const photos = [photo1, photo2, photo3, photo4, photo5]
export default function CreateDating({route}) {
  const [backgroundPhoto] = useState(
    photos[Math.floor(Math.random() * photos.length)],
  )
  const nav = useNavigation()
  const {t} = useTranslation()

  const createEvent = data => {
    Haptics.selectionAsync()
    nav.push('MediaSelector', {...data, lastScreen: 'Create_Dating'})
  }

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        <View style={{flex: 1}}>
          <FastImage
            source={backgroundPhoto}
            resizeMode={'cover'}
            style={styles.backgroundImage}>
            <MText
              bold
              style={{
                color: '#fff',
                marginBottom: 35,
                marginLeft: 40,
                fontSize: 34,
              }}>
              {t('date')}
            </MText>
          </FastImage>
          <CreateDatingNested
            route={route}
            onFinish={createEvent}
            button={'next'}
            currentScreen={'Create_Dating'}
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
    backgroundColor: '#F3267D',
  },
  nextButtonText: {
    color: '#fff',
  },
})
