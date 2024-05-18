import {TouchableOpacity} from 'react-native'
import MText from '../../components/MText'
import React from 'react'

export default function MapCluster({amount, zoomIn}) {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        borderColor: '#A347FF',
        backgroundColor: 'white',
        shadowOpacity: 0.5,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowRadius: 2,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={zoomIn ? zoomIn : {}}>
      <MText
        style={{
          color: '#A347FF',
          fontSize: amount > 999 ? 12 : amount > 99 ? 20 : 24,
        }}>
        {amount}
      </MText>
    </TouchableOpacity>
  )
}
