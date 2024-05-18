import {useNavigation} from '@react-navigation/native'
import * as Location from 'expo-location'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Animated,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import MapView, {MAP_TYPES} from 'react-native-maps'

import MAddressInput from '../../components/MAddressInput'
import MBack from '../../components/MBack'
import MText from '../../components/MText'
import {getAddressByCoords} from '../../configs/api'
import LocationIcon from '../../icons/LocationIcon'
import PinIcon from '../../icons/PinIcon'

export default function AddressSelector({route}) {
  const add = route.params?.address
  const [address, setAddress] = useState(add)
  const rotateAnim = useRef(new Animated.Value(0)).current

  const markerRef = useRef()
  const mapRef = useRef()
  const nav = useNavigation()
  const {i18n, t} = useTranslation()

  const onRegionChanged = rr => {
    getAddressByCoords(rr.longitude, rr.latitude, i18n.language).then(rr => {
      if (rr.data?.address) {
        setAddress(rr.data)
      }
    })
    Location.getLastKnownPositionAsync().then(r => {
      const x1 = rr.latitude - (rr.latitudeDelta / 2) * 0.6
      const y1 = rr.longitude + (rr.longitudeDelta / 2) * 0.7
      const x2 = r?.coords?.latitude
      const y2 = r?.coords?.longitude
      const deltaX = x2 - x1
      const deltaY = y2 - y1
      const angle = Math.atan2(deltaY, deltaX)

      let rotate = angle * (180 / Math.PI)
      if (rotate > 0 && rotateAnim < 0) {
        rotate = rotate - 360
      }
      if (rotate < 0 && rotateAnim > 0) {
        rotate = 360 - rotate
      }
      Animated.spring(rotateAnim, {
        toValue: Math.round(rotate),
        duration: 200,
        useNativeDriver: true,
      }).start()
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (add) {
        mapRef.current.animateToRegion({
          ...add,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <View style={styles.container}>
      <MBack top={70} left={20} />
      <View style={styles.suggestionContainer}>
        <MAddressInput
          style={styles.suggestionBox}
          auto={!add}
          value={address}
          setValue={setAddress}
          setLocation={l => {
            mapRef.current.animateToRegion(l, 300)
          }}
        />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <MapView
          ref={mapRef}
          // region={defaultLoc}
          mapType={MAP_TYPES.STANDARD}
          trackViewChanges={false}
          maxZoomLevel={16}
          minZoomLevel={1}
          rotateEnabled={false}
          style={styles.map}
          onRegionChangeComplete={onRegionChanged}
          showsUserLocation
          showsMyLocationButton={false}
          showsBuildings={false}
          showsPointsOfInterest={false}
          showsIndoorLevelPicker={false}
          followsUserLocation={false}
          showsCompass={false}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pointerEvents="none">
        <PinIcon />
      </View>
      <TouchableOpacity
        style={styles.acceptContainer}
        onPress={() => {
          nav.navigate(route.params.currentScreen, {address})
        }}>
        <View style={styles.acceptBox}>
          <MText style={styles.acceptText}>{t('apply')}</MText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelContainer}
        onPress={() => {
          nav.navigate(route.params.currentScreen, {address: null})
        }}>
        {/*<View style={styles.cancelBox}>*/}
        {/*  <MText style={styles.acceptText}>{t('clear')}</MText>*/}
        {/*</View>*/}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          bottom: 120,
          right: 40,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          Location.getLastKnownPositionAsync().then(r => {
            mapRef.current.animateToRegion({
              latitude: r?.coords?.latitude,
              longitude: r?.coords?.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            })
          })
        }}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [-180, 0, 180],
                  outputRange: ['-179deg', '0deg', '179deg'],
                }),
              },
            ],
          }}>
          <LocationIcon />
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
    bottom: 50,
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
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    position: 'absolute',
    borderRadius: 16,
    top: 70,
    left: 20,
    zIndex: 1,
  },
})
