import {Platform, SafeAreaView, StyleSheet, View,} from 'react-native'
import AppleAuth from './apple'
import GoogleAuth from './google'
import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {authenticate} from '../../../slices/authReducer'
import {useDispatch} from 'react-redux'
import LangSwitch from '../lang'
import MText from '../../../components/MText'
import {LinearGradient} from 'expo-linear-gradient'
import MaplloTextIconNormal from '../../../icons/MaplloTextIconNomral'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login() {
  let {t} = useTranslation()
  let dispatch = useDispatch()

  const auth = async data => {
    await AsyncStorage.setItem('token', data.token)
    await dispatch(authenticate(data))
  }
  return (
    <LinearGradient
      colors={['#75A0CA', '#EDEEF1', '#F6E3DF']}
      style={styles.background}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <MaplloTextIconNormal />
      </View>
      <SafeAreaView style={styles.sheet}>
        <View style={styles.sheetContent}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginBottom: 20}}>
              <LangSwitch style={{marginBottom: 20}} auth={false} />
              <MText style={styles.title}>
                {t('UnauthorizedStack.Login.title')}
              </MText>
              {Platform.OS !== 'android' && <AppleAuth auth={auth} />}
              <GoogleAuth auth={auth} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginVertical: 17,
  },
  background: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 16,
  },
})
