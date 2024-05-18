import * as Haptics from 'expo-haptics'
import {useState} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'

import {deviceInfo} from '../../assets/deviceInfo'
import {toggleReaction} from '../../configs/api'
import MText from '../MText'

export default function MReaction({
  icon,
  id,
  type,
  reactions,
  userReactions,
  style,
  innerStyle,
}) {
  const [activeReaction, setActiveReaction] = useState(userReactions[type])
  const [amountReaction, setAmountReaction] = useState(reactions[type])

  const toggle = () => {
    Haptics.selectionAsync()
    toggleReaction(id, type).then(r => {
      setActiveReaction(r.data.active)
      setAmountReaction(r.data.amount)
    })
  }
  const activeStyle = {} //activeReaction ? {shadowColor:'#f00'}: {}

  return (
    <TouchableOpacity
      style={[
        styles.container,
        deviceInfo.ios
          ? {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 6,
            }
          : null,
        style,
        activeStyle,
      ]}
      onPress={toggle}>
      <MText style={[{fontSize: 18}, innerStyle]}>{icon}</MText>
      {amountReaction > 0 && (
        <MText
          boldbold
          style={{
            marginTop: 2,
            marginLeft: 5,
            fontSize: 14,
            color: activeReaction ? '#F3267D' : '#fff',
          }}>
          {amountReaction}
        </MText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'rgba(0,0,0,0.3)',
    // borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
})
