import {useNavigation} from '@react-navigation/native'
import * as React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'

import ArrowLeftIcon from '../../icons/ArrowLeftIcon'

export default function MBack({top = 0, left = 0, absolute = true, onPress}) {
  const nav = useNavigation()
  if (onPress == null) {
    onPress = () => nav.goBack()
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.backArrowContainer,
        absolute ? {position: 'absolute'} : {},
        {
          paddingVertical: 8,
          paddingLeft: 10.5,
          paddingRight: 12.5,
          top,
          left,
          zIndex: 9999,
        },
      ]}>
      <ArrowLeftIcon />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 16,
    zIndex: 1,
  },
})
