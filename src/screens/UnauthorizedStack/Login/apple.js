import * as AppleAuthentication from 'expo-apple-authentication'
import {StyleSheet, TouchableOpacity} from 'react-native'
import * as React from 'react'
import AppleIcon from '../../../icons/AppleIcon'
import {useTranslation} from 'react-i18next'
import MText from '../../../components/MText'
import {appleAuth, getProfile} from '../../../configs/api'

export default function AppleAuth({auth}) {
  const {t, i18n} = useTranslation()

  const authWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      let authApiResponse = await appleAuth({
        firstName: credential.fullName.givenName,
        lastName: credential.fullName.familyName,
        identityToken: credential.identityToken,
        language: i18n.language,
      })
      const profileApiResponse = await getProfile(authApiResponse.data.id)
      const data = {...profileApiResponse.data, token: authApiResponse.data.jwt}
      auth(data)
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={() => authWithApple()}>
      <AppleIcon />
      <MText style={styles.text}>{t('UnauthorizedStack.Login.apple')}</MText>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    height: 38,
    borderRadius: 12,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#818195',
    paddingLeft: 12,
  },
})
