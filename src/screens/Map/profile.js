import { StyleSheet, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import DeletedAva from '../../icons/DeletedAva'
import MImage from '../../components/MImage'

function MapProfile({ event }) {
  return (
    <View style={styles.container}>
      {<View style={styles.symbol}></View>}
      {event.avatarUrl ? (
        <MImage
          source={{ uri: event.avatarUrl }}
          style={styles.image}
          resizeMode={'cover'}
          img={'ava'}
        />
      ) : (
        <DeletedAva size={60} style={{ borderRadius: 17 }} />
      )}
    </View>
  )
}

export default React.memo(MapProfile)

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
    top: 0,
    right: 0,
    zIndex: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#35D055',
  },
  container: {
    height: 60,
    width: 60,
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
