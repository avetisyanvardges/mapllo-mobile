import {useNavigation} from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import React, {useEffect, useRef, useState} from 'react'
import {View} from 'react-native'
import WebView from 'react-native-webview'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'

let canGoBack = false

const WebViewScreen = ({route}) => {
  const navigation = useNavigation()
  const {uri} = route?.params
  const webViewRef = useRef(null)
  const [load, setLoad] = useState(true)
  const [url, setUrl] = useState()

  useEffect(() => {
    if (uri) {
      if (deviceInfo?.android && uri.includes('.pdf')) {
        setUrl(`https://docs.google.com/viewer?url=${uri}`)
      } else {
        setUrl(uri)
      }
    }
  }, [uri, load])

  const handleNavigationStateChange = navState => {
    canGoBack = navState.canGoBack
  }

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{
          uri: url,
        }}
        onLoad={() => {
          setLoad(false)
        }}
        onLoadEnd={() => {
          setLoad(false)
        }}
        onError={error => console.error('WebView Error:', error)}
        onHttpError={e => {
          navigation.goBack()
        }}
        onNavigationStateChange={handleNavigationStateChange}
        setSupportMultipleWindows
        javaScriptEnabled // Enable JavaScript if needed
        originWhitelist={['*']} // Allow all origins (be cautious with this in a production app)
      />
      {load ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 999,
            backgroundColor: '#fff',
          }}>
          <LottieView
            style={{width: normalize(100), height: normalize(100)}}
            source={require('../../../assets/lottie/M_Emoj.json')}
            autoPlay
            loop
            speed={0.7}
          />
        </View>
      ) : null}
    </View>
  )
}

export default WebViewScreen
