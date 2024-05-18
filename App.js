import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Provider} from 'react-redux'

import Main from './Main'
import {deviceInfo} from './src/assets/deviceInfo'
import store from './src/configs/store';
import './src/configs/i18n'
import React, {useEffect, useState} from 'react'

import {getSupportedVersions} from './src/configs/api'
import UpdateApp from './src/screens/UpdateApp'

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  useFonts,
} from '@expo-google-fonts/montserrat'
import * as SplashScreen from 'expo-splash-screen'
import * as Linking from 'expo-linking'

import {navigationRef} from './src/services/NavigationService'

const prefix = Linking.createURL('')

const pkg = require('./package.json')

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [updateApp, setUpdateApp] = useState(null)
  const [fonts] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  })
  const linking = {
    prefixes: [prefix],
  }

  useEffect(() => {
    if (fonts && updateApp) {
      SplashScreen.hideAsync()
    }
  }, [fonts, updateApp])

  useEffect(() => {
    getSupportedVersions().then(r => {
      const version = 3
      const majorVersion = parseInt(version)
      const majorVersionShouldBeHigher =
          r.data.majorVersion && r.data.majorVersion > majorVersion
      if (
          majorVersionShouldBeHigher
      ) {
        setUpdateApp(true)
      } else {
        setUpdateApp(false)
      }
    })
  }, [])

  return (
      <SafeAreaProvider>
        {deviceInfo.android ? (
            <StatusBar backgroundColor="transparent" translucent />
        ) : null}
        <Provider store={store}>
          <NavigationContainer ref={navigationRef} linking={linking}>
            {fonts && (
                <View style={styles.container}>
                  {/*{updateApp === true && <UpdateApp />}*/}
                  {/*{updateApp === false && <Main />}*/}
                  {/*{updateApp === null && <View />}*/}
                </View>
            )}
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
