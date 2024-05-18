import React, {memo, useState} from 'react'
import {Image, StyleSheet, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import {Marker} from 'react-native-maps'

import {deviceInfo} from '../../assets/deviceInfo'
import MImage from '../../components/MImage'
import MText from '../../components/MText'
import SmallHeartIcon from '../../icons/SmallHeartIcon'

function MapEvent({event, onPress}) {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return (
      <Marker
        key={event.id + '_loading'}
        coordinate={{latitude: event.latitude, longitude: event.longitude}}
        tracksViewChanges={false}
        identifier={event.id}
        style={{opacity: 0}}>
        <MImage
          onLoad={() => setLoaded(true)}
          source={{uri: event.avatarUrl}}
          style={styles.image}
          resizeMode="cover"
          img="m"
        />
      </Marker>
    )
  }

  return (
    <Marker
      onPress={onPress}
      coordinate={{latitude: event.latitude, longitude: event.longitude}}
      key={event.id}
      identifier={event.id}
      tracksViewChanges={false}>
      <View style={styles.bigContainer}>
        <View style={styles.container}>
          {event.type === 'DATING' && (
            <View style={styles.symbol}>
              <SmallHeartIcon />
            </View>
          )}
          {event.type === 'EVENT' && isToday(new Date(event.date)) && (
            <View style={styles.bottomTextContainer}>
              <MText bold style={styles.bottomText}>
                LIVE
              </MText>
            </View>
          )}
          <MImage
            source={{uri: event.avatarUrl}}
            style={styles.image}
            resizeMode="cover"
            img="m"
          />
        </View>
      </View>
    </Marker>
  )
}
const isToday = someDate => {
  const today = new Date()
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  )
}

const styles = StyleSheet.create({
  bottomText: {
    color: '#fff',
    fontSize: 12,
  },
  bottomTextContainer: {
    backgroundColor: '#A347FF',
    position: 'absolute',
    bottom: -5,
    zIndex: 1,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,
  },
  symbol: {
    position: 'absolute',
    top: -3,
    right: -5,
    zIndex: 1,
    overflow: 'visible',
  },
  bigContainer: {
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 60,
    width: 60,
    overflow: 'visible',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 17,
  },
})

export default memo(MapEvent)
