import React, {useEffect, useRef} from 'react'
import {Animated, View} from 'react-native'

import {normalize} from '../../../assets/normalize'

const Dots = ({item, focused}) => {
  const width = useRef(new Animated.Value(1)).current
  const widthInterpolate = width.interpolate({
    inputRange: [1, 2],
    outputRange: [normalize(6), normalize(12)],
  })

  useEffect(() => {
    if (focused) {
      Animated.spring(width, {
        toValue: 2,
        friction: 6,
        tension: 120,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.spring(width, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: false,
      }).start()
    }
  }, [focused])

  return (
    <Animated.View
      key={item}
      style={{
        width: widthInterpolate,
        height: normalize(6),
        backgroundColor: focused ? '#fff' : '#D9D9D9',
        borderRadius: normalize(12),
        marginRight: normalize(10),
      }}
    />
  )
}

export default Dots
