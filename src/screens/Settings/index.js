import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation} from '@react-navigation/native'
import {Button, Divider} from '@rneui/base'
import * as Haptics from 'expo-haptics'
import * as React from 'react'
import {useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Keyboard,
  Linking,
  Pressable,
  SafeAreaView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useDispatch, useSelector} from 'react-redux'

import SettingsBlock from './SettingsBlock'
import {normalize} from '../../assets/normalize'
import MBack from '../../components/MBack'
import MInput from '../../components/MInput'
import MPopup from '../../components/MPopup'
import MRadio from '../../components/MRadio'
import MText from '../../components/MText'
import {complain, deleteOwnAccount, updateLanguage} from '../../configs/api'
import {fsUrl, shareUserUrl} from '../../configs/constants'
import ArrowRightIcon from '../../icons/ArrowRightIcon'
import MaplloTextIconNormal from '../../icons/MaplloTextIconNomral'
import {logout} from '../../slices/authReducer'

export default function Settings() {
  const profileId = useSelector(state => state.auth.id)
  const insets = useSafeAreaInsets()
  const [activeBlock, setActiveBlock] = useState('none')
  const nav = useNavigation()
  const [complainText, setComplainText] = useState('')
  const {i18n, t} = useTranslation()
  const popupRef = useRef()
  const dispatch = useDispatch()

  const privacyUrl = `https://mapllo.com/privacy-policy?lang=${i18n.language}`
  const termsUrl = `${fsUrl}/docs/terms_${i18n.language}.pdf`
  const settingsList = () => (
    <View>
      {/*<TouchableOpacity*/}
      {/*  onPress={() => setActiveBlock('account')}*/}
      {/*  style={{marginBottom: 30, justifyContent: 'space-between', flexDirection: 'row'}}>*/}
      {/*  <View style={{flexDirection: 'row', alignItems: 'center'}}><MText style={{fontSize: 10}}>●   </MText>*/}
      {/*    <MText style={{fontSize: 18}}>{t('account')}</MText>*/}
      {/*  </View>*/}
      {/*  <ArrowRightIcon color={'#818195'}/>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity
        onPress={() => setActiveBlock('language')}
        style={{
          marginBottom: 30,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MText style={{fontSize: 10}}>● </MText>
          <MText style={{fontSize: 14}}>{t('language')}</MText>
        </View>
        <ArrowRightIcon color="#818195" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveBlock('report')}
        style={{
          marginBottom: 30,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MText style={{fontSize: 10}}>● </MText>
          <MText style={{fontSize: 14}}>{t('report_problem')}</MText>
        </View>
        <ArrowRightIcon color="#818195" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => nav.navigate('WebViewScreen', {uri: termsUrl})}
        style={{
          marginBottom: 30,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MText style={{fontSize: 10}}>● </MText>
          <MText style={{fontSize: 14}}>{t('tos')}</MText>
        </View>
        <ArrowRightIcon color="#818195" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => nav.navigate('WebViewScreen', {uri: privacyUrl})}
        style={{
          marginBottom: 30,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MText style={{fontSize: 10}}>● </MText>
          <MText style={{fontSize: 14}}>{t('pp')}</MText>
        </View>
        <ArrowRightIcon color="#818195" />
      </TouchableOpacity>
      {/*<TouchableOpacity*/}
      {/*  onPress={() => setActiveBlock('info')}*/}
      {/*  style={{marginBottom: 30, justifyContent: 'space-between', flexDirection: 'row'}}>*/}
      {/*  <View style={{flexDirection: 'row', alignItems: 'center'}}><MText style={{fontSize: 10}}>●   </MText>*/}
      {/*    <MText style={{fontSize: 18}}>{t('information')}</MText>*/}
      {/*  </View>*/}
      {/*  <ArrowRightIcon color={'#818195'}/>*/}
      {/*</TouchableOpacity>*/}
      <Divider style={{marginVertical: 20}} />
    </View>
  )

  const report = () => {
    complain(complainText).then(r => {
      setComplainText('')
      popupRef.current.add({text: t('complain_accepted'), type: 'normal'})
      setActiveBlock('none')
    })
  }

  const changeLanguage = lang => {
    updateLanguage(lang).then(r => {
      i18n.changeLanguage(lang)
      AsyncStorage.setItem('lang', lang)
      // SecureStore.setItemAsync('lang', lang)
    })
  }

  const deleteAccount = () => {
    deleteOwnAccount()
      .then(() => AsyncStorage.removeItem('token'))
      .then(() => dispatch(logout()))
  }

  const renderContent = () => {
    switch (activeBlock) {
      case 'none': {
        return settingsList()
      }
      case 'account': {
        return <SettingsBlock title={t('account')} />
      }
      case 'language': {
        return (
          <SettingsBlock title={t('language')}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => changeLanguage('ru')}>
              <MText>{t('russian')}</MText>
              <MRadio
                current={i18n.language}
                value="ru"
                activate={() => changeLanguage('ru')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => changeLanguage('en')}>
              <MText>{t('english')}</MText>
              <MRadio
                current={i18n.language}
                value="en"
                activate={() => changeLanguage('en')}
              />
            </TouchableOpacity>
          </SettingsBlock>
        )
      }
      case 'report': {
        return (
          <SettingsBlock title={t('report_problem')}>
            <MInput value={complainText} setValue={setComplainText} multiline />
            <TouchableOpacity
              disabled={complainText.length < 5}
              onPress={report}
              style={{
                borderRadius: 20,
                backgroundColor:
                  complainText.length < 5 ? '#818195' : '#A347FF',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <MText boldbold style={{color: '#fff'}}>
                {t('send')}
              </MText>
            </TouchableOpacity>
          </SettingsBlock>
        )
      }
      case 'delete_account': {
        return (
          <SettingsBlock title={t('delete_account_confirmation')}>
            <View>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#F3267D'}]}
                onPress={() => deleteAccount()}>
                <MText style={[styles.buttonText, {color: 'white'}]}>
                  {t('yes')}
                </MText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setActiveBlock('none')}>
                <MText style={[styles.buttonText, {}]}>{t('no')}</MText>
              </TouchableOpacity>
            </View>
          </SettingsBlock>
        )
      }
      case 'info': {
        return <SettingsBlock title={t('information')} />
      }
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 20,
        flex: 1,
        marginTop: insets.top ? insets.top : 12,
      }}
      onTouchStart={Keyboard.dismiss}>
      <Pressable
        onPress={() => {
          if (activeBlock !== 'none') {
            setActiveBlock('none')
          }
        }}
        style={{flex: 1}}>
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <MBack
              absolute={false}
              onPress={() =>
                activeBlock !== 'none' ? setActiveBlock('none') : nav.goBack()
              }
            />
            <MText bold style={{fontSize: 16}}>
              {t('settings')}
            </MText>
          </View>
        </View>

        {renderContent()}

        <TouchableOpacity
          onPress={() => Linking.openURL('https://mapllo.com')}
          style={{
            marginBottom: 30,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <MText style={{color: '#A347FF', fontSize: 14}}>
            {t('support_center')}
          </MText>
          <ArrowRightIcon color="#818195" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveBlock('delete_account')}
          style={{
            marginBottom: 30,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MText style={{fontSize: 14, color: '#F3267D'}}>
              {t('delete_account')}
            </MText>
          </View>
          <ArrowRightIcon color="#818195" />
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const url = shareUserUrl + profileId
              const message = t('here_am_id') + '\n' + url
              Share.share({message}, {dialogTitle: message, subject: message})
            }}>
            <MText style={styles.buttonText}>{t('share_account')}</MText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Haptics.selectionAsync()
                .then(() => AsyncStorage.removeItem('token'))
                .then(() => dispatch(logout()))
            }>
            <MText style={styles.buttonText}>{t('logout')}</MText>
          </TouchableOpacity>
        </View>
        <MPopup ref={popupRef} onlyOne />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: insets.bottom || normalize(20),
          }}>
          <MaplloTextIconNormal
            color="rgba(0,0,0,0.2)"
            width={105}
            height={30}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingVertical: 13,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 14,
  },
})
