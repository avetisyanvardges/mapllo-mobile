import * as Haptics from 'expo-haptics'
import React from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated'

import {normalize} from '../../assets/normalize'

export const PickerItem = ({
  label,
  index,
  itemHeight,
  scrollY,
  itemStyle,
  onIndexChange,
  selectedIndex,
}) => {
  const inputRange = [
    (index - 2) * itemHeight,
    (index - 1) * itemHeight,
    index * itemHeight,
  ]

  const AnimatedText = Animated.createAnimatedComponent(Text)
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8])
    const opacity = interpolate(scrollY.value, inputRange, [0.6, 1, 0.6])
    const color = interpolateColor(scrollY.value, inputRange, [
      '#000',
      '#fff',
      '#000',
    ])

    return {
      opacity,
      transform: [{scale}],
      color,
    }
  })

  return (
    <TouchableOpacity activeOpacity={1}>
      <View style={[{height: itemHeight}, styles.animatedContainer, itemStyle]}>
        <AnimatedText style={[styles.pickerItem, animatedStyle]}>
          {label}
        </AnimatedText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pickerItem: {
    fontSize: normalize(18),
    fontWeight: '400',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  animatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(10),
  },
})
