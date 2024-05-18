import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import StarIcon from '../../icons/StarIcon'
import * as React from 'react'

export default function MFavourite({fav, toggleFav, style}) {
  return (
    <TouchableOpacity onPress={toggleFav} style={style}>
      <Animated.View
        style={[
          styles.fav,
          {
            backgroundColor: !fav ? 'rgba(16,16,34,0.4)' : 'rgba(255,160,18,1)',
            shadowColor: fav ? 'rgba(255,160,18,1)' : 'rgba(255,160,18,0)',
          },
        ]}>
        <StarIcon />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    fav: {
        paddingTop: 7,
        paddingBottom: 9,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.54,
        shadowRadius: 10,

        elevation: 15,
        zIndex: 9999,
    },
})
