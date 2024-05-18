import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNetInfo} from '@react-native-community/netinfo'
import messaging from '@react-native-firebase/messaging'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {useSelector} from 'react-redux'

import {ChatUpdater} from './chatUpdater'
import Camera from '../../components/MCamera'
import MImageLibrary from '../../components/MImageLibrary'
import MNotification from '../../components/MNotification'
import MediaSelector from '../../components/MediaSelector'
import {registerDevice, updateLanguage} from '../../configs/api'
import Socket from '../../configs/socket'
import AddressSelector from '../AddressSelector'
import ChatView from '../Chat/chatView'
import CreateEvent from '../CreateEvent'
import EventView from '../EventView'
import Locator from '../Locator'
import Menu from '../Menu'
import {PosterView} from '../Poster/view'
import ProfileView from '../Profile/view'
import Favourites from '../Favourites'
import FailingConnection from '../FailingConnection'
import Settings from '../Settings'
import WebViewScreen from '../WebView'
import crashlytics from '@react-native-firebase/crashlytics';
import { Button } from '@rneui/base'

const Stack = createNativeStackNavigator()

export default function AuthorizedStack() {
  const [netDelay, setNetDelay] = useState(true)
  const username = useSelector(state => state.auth.userName)
  const userId = useSelector(state => state.auth.id)
  const notificationRef = useRef()

  const netInfo = useNetInfo()
  const {i18n, t} = useTranslation()

  useEffect(() => {
    AsyncStorage.getItem('lang')
    .then(i => i18n.changeLanguage(i))
    .then(l => updateLanguage(lang))
    .catch(e => {})

    registerForPushNotificationsAsync().then(token => {
      DeviceInfo.getUniqueId().then(id => {
        registerDevice(id, token)
      })
    })
    setInterval(() => setNetDelay(false), 1000)
    crashlytics().log('User signed in.');
    crashlytics().setUserId(userId)
  }, [])

  const registerForPushNotificationsAsync = async () => {
    const result = await messaging().requestPermission()
    if (result > 0) {
      return await messaging().getToken()
    }
  }

  const authStack = (
    <View style={{flex: 1}}>
      <ChatUpdater notification={notificationRef.current} />
      <MNotification ref={notificationRef} t={t} username={username} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
          contentStyle: {backgroundColor: '#fff'},
        }}>
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Create_Event" component={CreateEvent} />
        <Stack.Screen name="ImageLibrary" component={MImageLibrary} />
        {/*<Stack.Screen name={'CreateEvent'} component={CreateEvent} />*/}
        {/*<Stack.Screen name={'CreateDating'} component={CreateDating} />*/}
        <Stack.Screen name="AddressSelector" component={AddressSelector} />
        <Stack.Screen name="Locator" component={Locator} />
        <Stack.Screen name="EventView" component={EventView} />
        <Stack.Screen
          name="ProfileView"
          component={ProfileView}
          initialParams={{parentRoute: ''}}
        />
        <Stack.Screen name="PosterView" component={PosterView} />
        <Stack.Screen name="MediaSelector" component={MediaSelector} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen
          name="ChatView"
          component={ChatView}
          initialParams={{parentRoute: ''}}
        />
        <Stack.Screen name="Favourites" component={Favourites} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      </Stack.Navigator>
    </View>
  )
  if (netDelay) {
    return authStack
  }

  return netInfo.isConnected ? authStack : <FailingConnection />
}
