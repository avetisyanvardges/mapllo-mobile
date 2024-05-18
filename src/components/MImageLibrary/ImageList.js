import {Dimensions, Pressable, StyleSheet, View} from 'react-native'
import React, {useState} from 'react'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-snap-carousel'

const PAGE_HEIGHT = 120
const PAGE_WIDTH = 420

export default function ImageList({innerRef, data, setActive}) {
  const [currentActive, setCurrentActive] = useState(0)

  const onSnapToItem = itemIndex => {
    if (currentActive !== itemIndex) {
      setActive(itemIndex)
      setCurrentActive(itemIndex)
    }
  }
  const width = Dimensions.get('window').width - 70
  return (
    <View>
      {
        <Carousel
          ref={innerRef}
          loop={false}
          autoPlay={false}
          layout={'stack'}
          style={[styles.carousel, {width: width}]}
          sliderHeight={PAGE_HEIGHT}
          sliderWidth={PAGE_WIDTH}
          itemWidth={60}
          data={data}
          onSnapToItem={onSnapToItem}
          // onProgressChange={onSnapToItem}
          renderItem={({item, animationValue}) => {
            return <Item animationValue={animationValue} img={item} />
          }}
        />
      }
    </View>
  )
}

const Item = props => {
  const {img, onPress} = props

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      // onPressIn={onPressIn}
      // onPressOut={onPressOut}
    >
      <View style={[styles.itemImageContainer]}>
        <FastImage
          style={[styles.itemImage]}
          source={{uri: img.uri}}
          resizeMode={'cover'}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  carousel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
})
