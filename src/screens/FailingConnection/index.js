import DeadGhost from '../../icons/DeadGhost'
import {StyleSheet, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import MText from '../../components/MText'

export default function FailingConnection() {
  const {t} = useTranslation()

  return (
    <View style={styles.container}>
      <DeadGhost />
      <View style={{width: 250, textAlign: 'center'}}>
        <MText
          boldbold
          style={{
            fontSize: 30,
            marginTop: 40,
            marginBottom: 30,
            textAlign: 'center',
          }}>
          {t('oops')}
        </MText>
        <MText
          style={{
            marginBottom: 20,
            fontSize: 20,
            color: '#818195',
            textAlign: 'center',
          }}>
          {t('no_internet')}
        </MText>
        <MText style={{fontSize: 20, color: '#818195', textAlign: 'center'}}>
          {t('check_internet')}
        </MText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
