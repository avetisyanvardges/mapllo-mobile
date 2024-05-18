import LensIcon from '../../icons/LensIcon'
import {useState} from 'react'
import {TextInput, View} from 'react-native'
import {useTranslation} from 'react-i18next'

export default function SearchBar({setChatResults, setMessageResults}) {
  const [text, setText] = useState()
  const {t} = useTranslation()

  return (
    <View
      style={{
        borderColor: '#E3E3E3',
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
      }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LensIcon />
      </View>
      <TextInput
        autoCapitalize={false}
        style={{
          height: '100%',
          padding: 10,
          paddingLeft: 40,
          fontWeight: '300',
        }}
        placeholder={t('search')}
        value={text}
        onChangeText={setText}
      />
    </View>
  )
}
