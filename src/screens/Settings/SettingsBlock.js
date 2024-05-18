import {View} from 'react-native'
import MText from '../../components/MText'
import {Divider} from '@rneui/base'

export default function SettingsBlock({title, children}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        paddingHorizontal: 20,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.2)',
        marginVertical: 20,
        shadowRadius: 10,
        borderWidth: 1,
        borderRadius: 15,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <MText style={{paddingVertical: 15, color: '#818195'}}>{title}</MText>
      </View>
      <Divider style={{marginBottom: 10}} />
      {children}
    </View>
  )
}
