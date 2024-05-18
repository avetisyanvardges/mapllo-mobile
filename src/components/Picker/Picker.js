import * as Haptics from 'expo-haptics'
import React, {useEffect, useRef} from 'react'
import {View, FlatList} from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'

import {PickerItem} from './PickerItem'
import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'

const WheelPicker = ({
  values,
  onIndexChange,
  selected,
  itemHeight = normalize(38),
  itemStyle,
}) => {
  const pickerRef = useRef(null)
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
    onMomentumEnd: event => {
      const y = event.contentOffset.y
      const index = Math.round(y / itemHeight)
      runOnJS(Haptics.selectionAsync)()
      runOnJS(onIndexChange)(index)
    },
  })

  useEffect(() => {
    if (selected && selected >= 0) {
      console.log(selected, 'selected')
      setTimeout(() => {
        pickerRef.current.scrollToIndex({
          animated: true,
          index: selected,
        })
      }, 500)
    }
  }, [selected])

  const renderItem = ({item, index}) => (
    <PickerItem
      itemHeight={itemHeight}
      scrollY={scrollY}
      index={index}
      itemStyle={itemStyle}
      label={item.label}
      onIndexChange={onIndexChange}
    />
  )

  return (
    <View style={{height: itemHeight * 3, zIndex: 999}}>
      <Animated.FlatList
        ref={pickerRef}
        data={['', ...values, '']}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
      />
    </View>
  )
}

export default WheelPicker
