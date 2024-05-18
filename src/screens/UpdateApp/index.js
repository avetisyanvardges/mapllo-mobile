import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native'
import MText from '../../components/MText'
import {useTranslation} from 'react-i18next'
import MaplloNewIcon from '../../icons/MaplloNewIcon'

export default function UpdateApp() {
  const {t} = useTranslation()

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../../../assets/iphone_update.png')} />
        <View style={styles.imageCenter}>
          <View></View>
          <MaplloNewIcon />
          {/*<Image source={require('../../../assets/MaplloIcon.png')} style={styles.mapllo}/>*/}
          <Image
            source={require('../../../assets/DownloadIcon.png')}
            style={styles.download}
          />
        </View>
      </View>
      <MText
        boldbold
        style={{
          fontSize: 30,
          marginTop: 40,
          marginBottom: 30,
          width: 250,
          textAlign: 'center',
        }}>
        {t('update_app')}
      </MText>
      <MText
        style={{
          marginBottom: 20,
          fontSize: 14,
          color: '#818195',
          paddingHorizontal: 20,
          textAlign: 'center',
        }}>
        {t('update_app_description')}
      </MText>
      <TouchableOpacity
        style={{
          backgroundColor: '#A347FF',
          borderRadius: 20,
          paddingHorizontal: 50,
          paddingVertical: 10,
          marginTop: 20,
        }}
        onPress={() =>
          Linking.openURL(
            'https://apps.apple.com/app/mapllo-%D0%B7%D0%BD%D0%B0%D0%BA%D0%BE%D0%BC%D1%81%D1%82%D0%B2%D0%B0-%D0%B8-%D0%B4%D0%BE%D1%81%D1%83%D0%B3/id1579691867',
          )
        }>
        <MText bold style={{color: '#fff', fontSize: 14}}>
          {t('update')}
        </MText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
})
