import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {Image, StyleSheet} from 'react-native'
import FastImage from 'react-native-fast-image'
import {Marker} from 'react-native-maps'

import {deviceInfo} from '../../assets/deviceInfo'
import MImage from '../../components/MImage'

function MapPoster({
  poster,
  onPress,
  aggregatedMapOptions,
  currentZoom,
}) {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return (
      <Marker
        key={poster.id + '_loading'}
        coordinate={{latitude: poster.latitude, longitude: poster.longitude}}
        identifier={poster.id}
        tracksViewChanges={false}
        style={{opacity: 0}}>
        <MImage
          onLoad={() => setLoaded(true)}
          source={{uri: poster.avatarUrl}}
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
      coordinate={{latitude: poster.latitude, longitude: poster.longitude}}
      key={poster.id}
      identifier={poster.id}
      style={{
        opacity: !aggregatedMapOptions
          ? 1
          : aggregatedMapOptions?.[currentZoom]?.showPosters
            ? 1
            : 0,
      }}
      tracksViewChanges={false}>
      <LinearGradient
        colors={['#71EEFB', '#A679FF', '#A433A6']}
        style={styles.container}>
        <MImage
          onLoad={() => setLoaded(true)}
          source={{uri: poster.avatarUrl}}
          style={styles.image}
          resizeMode="cover"
          img="m"
        />
      </LinearGradient>
    </Marker>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 66,
    width: 66,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 17,
    margin: 5,
  },
})

export default MapPoster = React.memo(MapPoster)
