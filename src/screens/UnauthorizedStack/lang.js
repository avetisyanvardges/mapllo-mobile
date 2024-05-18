import {StyleSheet, TouchableOpacity, View} from 'react-native'
import i18n from 'i18next'
import MText from '../../components/MText'
import {updateLanguage} from '../../configs/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LangSwitch({style, auth}) {
  const changeLang = lang => {
    if (auth) {
      updateLanguage(lang).then(r => {
        i18n.changeLanguage(lang)
        AsyncStorage.setItem('lang', lang)
      })
    } else {
      i18n.changeLanguage(lang)
      AsyncStorage.setItem('lang', lang)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.langContainer}>
        <TouchableOpacity onPress={() => changeLang('en')}>
          <MText
            style={[styles.text, i18n.language === 'en' && styles.activeLang]}>
            ENG
          </MText>
        </TouchableOpacity>
        <View style={styles.spacer}></View>
        <TouchableOpacity onPress={() => changeLang('ru')}>
          <MText
            style={[styles.text, i18n.language === 'ru' && styles.activeLang]}>
            RU
          </MText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  langContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 12,
    color: '#818195',
  },
  spacer: {
    width: 16,
  },
  activeLang: {
    color: '#a347ff',
  },
})
