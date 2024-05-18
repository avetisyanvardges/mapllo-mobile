import React, {useEffect, useRef, useState} from 'react'
import MapView, {MAP_TYPES, Marker} from 'react-native-maps'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import MText from '../MText'
import {useTranslation} from 'react-i18next'
import * as Location from 'expo-location'
import PinIcon from '../../icons/PinIcon'

export default function MMapBlock({setLocation}) {
  const [active, setActive] = useState(false)
  const [loc, setLoc] = useState()
  const [defaultLoc, setDefaultLoc] = useState()
  const mapRef = useRef()
  const markerRef = useRef()

  const {t} = useTranslation()

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(s => {
      if (s.status !== 'granted') {
        alert('Permission to access location was ' + status)
      } else {
        Location.getLastKnownPositionAsync().then(p =>
          setDefaultLoc({
            ...p.coords,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          }),
        )
      }
    })
  }, [])

  const updateLocation = r => {
    setLoc(r)
    setLocation(r)
  }

  return (
    <View style={styles.container}>
      {active ? (
        <View>
          <MapView
            ref={mapRef}
            region={defaultLoc}
            mapType={MAP_TYPES.STANDARD}
            trackViewChanges={false}
            maxZoomLevel={16}
            minZoomLevel={1}
            rotateEnabled={false}
            style={styles.map}
            onRegionChange={updateLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={false}
            showsCompass={false}>
            <Marker
              coordinate={loc}
              ref={markerRef}
              centerOffset={{y: -13}}
              tracksViewChanges={false}>
              <PinIcon />
            </Marker>
          </MapView>
          <TouchableOpacity
            style={styles.clearLocationButton}
            onPress={() => setActive(false)}>
            <MText style={styles.clearLocationButtonText}>
              {t('components.MMapBlock.clear')}
            </MText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => {
            setActive(true)
            setLocation(null)
          }}>
          <MText style={styles.placeholder}>
            {t('components.MMapBlock.set')}
          </MText>
          <MText style={styles.textInput}></MText>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  clearLocationButton: {
    backgroundColor: '#A347FF',
    height: 25,
    marginVertical: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  clearLocationButtonText: {
    color: '#fff',
  },
  container: {
    maxHeight: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    height: 275,
  },
  inputContainer: {
    height: 35,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  placeholder: {
    color: '#818195',
  },
  textInput: {
    flex: 1,
  },
})
