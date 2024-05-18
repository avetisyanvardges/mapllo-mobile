import {useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import MapView, {MAP_TYPES, Marker} from 'react-native-maps'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import MBack from '../../components/MBack'
import MText from '../../components/MText'
import MapEvent from '../Map/event'
import MapPoster from '../Map/poster'

export default function Locator({route}) {
  const event = route.params.event
  const poster = route.params.poster
  const nav = useNavigation()
  const mapRef = useRef()
  const insets = useSafeAreaInsets()
  const {t} = useTranslation()

  useEffect(() => {
    setTimeout(() => {
      mapRef.current.animateToRegion({
        latitude: event ? event.latitude : poster.latitude,
        longitude: event ? event.longitude : poster.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
    }, 500)
  }, [])

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.6)',
          'transparent',
          'transparent',
          'transparent',
          'transparent',
        ]}
        pointerEvents="box-none"
        style={styles.overlay}>
        <View
          style={[
            styles.buttons,
            {top: insets.top + 20, left: insets.left + 20},
          ]}>
          {/*<TouchableOpacity onPress={() => nav.goBack()} style={styles.backArrowContainer}>*/}
          {/*  <ArrowLeftIcon/>*/}
          {/*</TouchableOpacity>*/}
          <MBack absolute={false} />
          {event && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
              onPress={() => nav.push('ProfileView', {id: event.ownerId})}>
              <FastImage
                source={{uri: event.ownerAvatarUrl}}
                style={styles.ownerAvatar}
                resizeMode="cover"
              />
              <View style={styles.info}>
                <MText bold style={styles.infoText}>
                  {event.ownerUsername}
                </MText>
                {event.ownerOnline && (
                  <MText bold style={styles.infoText}>
                    {t('online')}
                  </MText>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
      <MapView
        ref={mapRef}
        mapType={MAP_TYPES.STANDARD}
        trackViewChanges={false}
        maxZoomLevel={16}
        minZoomLevel={1}
        rotateEnabled={false}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        followsUserLocation={false}
        showsCompass={false}>
        {poster ? <MapPoster poster={poster} /> : <MapEvent event={event} />}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  infoText: {
    color: '#fff',
  },
  info: {
    marginLeft: 10,
  },
  overlay: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
  ownerAvatar: {
    height: 50,
    width: 50,
    borderRadius: 15,
    marginLeft: 20,
  },
  acceptBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A347FF',
    borderRadius: 15,
    height: 40,
  },
  acceptText: {
    color: '#fff',
  },
  cancelBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 15,
    height: 40,
  },
  cancelContainer: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 50,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  acceptContainer: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  map: {
    height: '107%',
  },
  suggestionContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 100,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  suggestionBox: {
    width: '100%',
  },
  buttons: {
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    width: 32,
    height: 32,
  },
})
