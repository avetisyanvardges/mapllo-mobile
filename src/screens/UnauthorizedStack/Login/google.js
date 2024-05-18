import {StyleSheet, TouchableOpacity} from 'react-native'
import * as React from 'react'
import {useEffect} from 'react'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import {getProfile, googleAuth} from '../../../configs/api'
import GoogleIcon from '../../../icons/GoogleIcon'
import {useTranslation} from 'react-i18next'
import MText from '../../../components/MText'

WebBrowser.maybeCompleteAuthSession()

export default function GoogleAuth({auth}) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    shouldAutoExchangeCode: true,
    // expoClientId: expoClientId,
    iosClientId:
      '599064016739-hfev1cp756317lcd2e7skgmicak800nu.apps.googleusercontent.com',
    androidClientId:
      '599064016739-92jlcqppspilk8blqebe4eq25ea3rneb.apps.googleusercontent.com',
    // webClientId: '599064016739-rpn0uaj8aviiei733qa6co5jn8v6e1tc.apps.googleusercontent.com',
  })

  const {t} = useTranslation()
  useEffect(() => {
    if (response) {
      authWithGoogle()
    }
  }, [response])

  const authWithGoogle = async () => {
    if (response.authentication) {
      let authApiResponse = await googleAuth(response.authentication.idToken)
      const profileApiResponse = await getProfile(authApiResponse.data.id)
      const data = {token: authApiResponse.data.jwt, ...profileApiResponse.data}
      auth(data)
    }
  }

  return (
    <TouchableOpacity
      disabled={!request}
      style={styles.button}
      onPress={() => promptAsync()}>
      <GoogleIcon />
      <MText style={styles.text}>{t('UnauthorizedStack.Login.google')}</MText>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    height: 38,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#818195',
    marginVertical: 13,
  },
  text: {
    fontSize: 14,
    color: '#818195',
    paddingLeft: 12,
  },
})
