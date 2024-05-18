import {useIsFocused, useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as Location from 'expo-location'
import _ from 'lodash'
import React, {useEffect, useRef, useState} from 'react'
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native'
import MapView, {MAP_TYPES, Marker} from 'react-native-maps'
import {useSelector} from 'react-redux'

import MapCluster from './cluster'
import MapEvent from './event'
import EventPreview from './eventPreview'
import MapPoster from './poster'
import PosterPreview from './posterPreview'
import MapProfile from './profile'
import MPopup from '../../components/MPopup'
import {
  getAggregatedOptions,
  getAggregatedTiles,
  getAllOnlineProfiles,
  getAllPosters,
} from '../../configs/api'
import LocationIcon from '../../icons/LocationIcon'

const deb = _.debounce(
  (setState, updateState) => {
    let oldTiles
    setState(t => {
      oldTiles = t
      return new Set()
    })
    updateState(oldTiles)
  },
  1000,
  {
    maxWait: 1000,
  },
)

export default function Map({route}) {
  const mapRef = useRef()
  const [aggregatedMapOptions, setAggregatedMapOptions] = useState({})
  const [activeEvent, setActiveEvent] = useState()
  const [activePoster, setActivePoster] = useState()
  const [forceLoad, setForceLoad] = useState(false)
  const [loadTiles, setLoadTiles] = useState(new Set())
  const [currentZoom, setCurrentZoom] = useState(12)
  const [downloadedTiles, setDownloadedTiles] = useState(new Set())

  const [mapClusters, setMapClusters] = useState({})
  const [mapEvents, setMapEvents] = useState({})
  const [mapProfiles, setMapProfiles] = useState({})
  const [mapPosters, setMapPosters] = useState({})
  const userId = useSelector(state => state.auth.id)
  const rotateAnim = createRef(new Animated.Value(0)).current

  const popupRef = useRef()
  const nav = useNavigation()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (route.params?.refresh) {
      setDownloadedTiles(new Set())
    }
  }, [route.params?.refresh])

  useEffect(() => {
    if (downloadedTiles.size === 0) {
      reload()
    }
  }, [downloadedTiles])

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(s => {
      if (s.status !== 'granted') {
        alert('Permission to access location was ' + status)
      } else {
        Location.getLastKnownPositionAsync().then(p => {
          mapRef.current.animateToRegion({
            latitude: p?.coords?.latitude,
            longitude: p?.coords?.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          })
        })
      }
    })
    getAggregatedOptions().then(r => {
      setAggregatedMapOptions(r.data.zoomToCellSizes)
    })
  }, [])

  const updateAllProfiles = () => {
    getAllOnlineProfiles().then(r => {
      const obj = {}
      for (const res of r.data) {
        if (res.id !== userId) {
          obj[res.wsId] = res
        }
      }
      setMapProfiles(obj)
    })
  }

  const updateAllPosters = () => {
    getAllPosters().then(r => {
      const obj = {}
      for (const res of r.data) {
        obj[res.id] = res
      }
      setMapPosters(obj)
    })
  }

  useEffect(() => {
    if (isFocused) {
      updateData()
      const interval = setInterval(updateData, 10000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [isFocused])

  const updateData = () => {
    updateAllProfiles()
    updateAllPosters()
  }

  const updateTiles = tiles => {
    if (!tiles) {
      return
    }
    const requestTiles = []
    tiles.forEach(t => {
      const coords = t.split('.')
      requestTiles.push({
        lngNum: parseInt(coords[0]),
        latNum: parseInt(coords[1]),
      })
    })
    const chunks = _.chunk(requestTiles, 500)
    chunks.forEach(c => downloadTiles(c))
    setDownloadedTiles(
      new Set([
        ...downloadedTiles,
        ...[...tiles].map(t => currentZoom + '.' + t),
      ]),
    )
  }

  useEffect(() => {
    if (loadTiles.size > 0) {
      if (forceLoad) {
        updateTiles(loadTiles)
        setLoadTiles(new Set())
        setForceLoad(false)
      } else {
        deb(setLoadTiles, updateTiles)
      }
    }
  }, [loadTiles])

  const downloadTiles = async tiles => {
    const v = await mapRef.current.getMapBoundaries()
    getAggregatedTiles({
      tiles,
      zoom: currentZoom,
      leftLongitude: v.southWest.longitude,
      rightLongitude: v.northEast.longitude,
      topLatitude: v.northEast.latitude,
      bottomLatitude: v.southWest.latitude,
    }).then(r => {
      for (const res of r.data.groups) {
        const key = res.zoom + '.' + res.lngCellNum + '.' + res.latCellNum
        setMapClusters(e => ({...e, [key]: res}))
      }
      for (const res of r.data.events) {
        setMapEvents(e => ({...e, [res.id]: res}))
      }
    })
  }
  const updateTilesToLoad = (top, bottom, left, right) => {
    const tiles = []
    for (let i = left; i < right; i++) {
      for (let j = bottom; j < top; j++) {
        tiles.push(i + '.' + j)
      }
    }
    let shouldUpdate = false
    tiles.forEach(t => {
      if (!loadTiles.has(t) && !downloadedTiles.has(currentZoom + '.' + t)) {
        shouldUpdate = true
        loadTiles.add(t)
      }
    })
    if (shouldUpdate) {
      setLoadTiles(new Set(loadTiles))
    } else {
    }
  }
  const reload = async () => {
    const cellSizes = aggregatedMapOptions[currentZoom]
    if (cellSizes) {
      const latSize = cellSizes.latSize
      const lngSize = cellSizes.lngSize
      const v = await mapRef.current.getMapBoundaries()
      const leftLngCellNum = Math.floor(v.southWest.longitude / lngSize)
      const rightLngCellNum = Math.floor(v.northEast.longitude / lngSize)
      const topLatCellNum = Math.floor(v.northEast.latitude / latSize)
      const bottomLatCellNum = Math.floor(v.southWest.latitude / latSize)
      setForceLoad(true)
      updateTilesToLoad(
        topLatCellNum,
        bottomLatCellNum,
        leftLngCellNum,
        rightLngCellNum,
      )
    }
  }

  useEffect(() => {
    deb.cancel()
    reload()
  }, [currentZoom])

  const onRegionChangeComplete = (rr, t) => {
    Location.getLastKnownPositionAsync().then(r => {
      const x1 = rr.latitude - (rr.latitudeDelta / 2) * 0.8
      const y1 = rr.longitude + (rr.longitudeDelta / 2) * 0.75
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

  const onRegionChange = (r, t) => {
    if (activeEvent) {
      setActiveEvent(null)
    }
    if (activePoster) {
      setActivePoster(null)
    }
    const zoom = calculateZoom(
      r.latitude,
      r.longitude,
      r.latitudeDelta,
      r.longitudeDelta,
    )
    const cellSizes = aggregatedMapOptions[zoom]
    if (cellSizes) {
      const latSize = cellSizes.latSize
      const lngSize = cellSizes.lngSize

      const leftLngCellNum = Math.floor(
        (r.longitude - r.longitudeDelta / 2) / lngSize,
      )
      const rightLngCellNum = Math.floor(
        (r.longitude + r.longitudeDelta / 2) / lngSize,
      )
      const topLatCellNum = Math.floor(
        (r.latitude + r.latitudeDelta / 2) / latSize,
      )
      const bottomLatCellNum = Math.floor(
        (r.latitude - r.latitudeDelta / 2) / latSize,
      )
      updateTilesToLoad(
        topLatCellNum,
        bottomLatCellNum,
        leftLngCellNum,
        rightLngCellNum,
      )
      if (zoom !== currentZoom) {
        setCurrentZoom(zoom)
      }
    }
  }

  function calculateZoom(lat, lng, deltaLat, deltaLng) {
    const GLOBE_WIDTH = 256 // a constant in Google's map projection
    const west = lng - deltaLng / 2
    const east = lng + deltaLng / 2
    let angle = east - west
    if (angle < 0) {
      angle += 360
    }
    const zoom = Math.round(Math.log(360 / angle) / Math.LN2)
    const pixelsPerLonDegree = GLOBE_WIDTH / 360
    const pixelsPerLatRadian = GLOBE_WIDTH / (2 * Math.PI)
    let finalZoom =
      zoom +
      Math.round(Math.log(pixelsPerLatRadian / pixelsPerLonDegree) / Math.LN2)
    const latZoom = Math.log(Math.cos((lat * Math.PI) / 180) + 1) / Math.LN2
    finalZoom = finalZoom - latZoom
    return Math.floor(finalZoom) - 5
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        mapType={MAP_TYPES.MUTEDSTANDARD}
        maxZoomLevel={16}
        minZoomLevel={3}
        rotateEnabled={false}
        style={styles.map}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={false}>
        <LinearGradient
          style={styles.mapGradient}
          colors={[
            'rgba(0,0,0,0.3)',
            'transparent',
            'transparent',
            'transparent',
          ]}
          pointerEvents="box-none"
        />
        {Object.keys(mapClusters).map((ee, i) => {
          const e = mapClusters[ee]
          const optLatSize = aggregatedMapOptions[e.zoom].latSize
          const optLngSize = aggregatedMapOptions[e.zoom].lngSize
          const latitude = optLatSize * e.latCellNum + optLatSize / 2
          const longitude = optLngSize * e.lngCellNum + optLngSize / 2
          return (
            <Marker
              coordinate={{latitude, longitude}}
              style={{opacity: e.zoom === currentZoom ? 1 : 0}}
              key={ee}
              identifier={ee}
              tracksViewChanges={false}>
              <MapCluster
                amount={e.amount}
                zoomIn={async () => {
                  const v = await mapRef.current.getMapBoundaries()
                  const longitudeDelta =
                    (v.northEast.longitude - v.southWest.longitude) / 2
                  const latitudeDelta =
                    (v.northEast.latitude - v.southWest.latitude) / 2
                  mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta,
                  })
                }}
              />
            </Marker>
          )
        })}
        {Object.values(mapEvents).map(e => {
          return (
            <Marker
              coordinate={{latitude: e.latitude, longitude: e.longitude}}
              key={e.id}
              identifier={e.id}
              style={{opacity: currentZoom >= 13 ? 1 : 0}}
              tracksViewChanges={false}>
              <TouchableOpacity
                onPress={() => {
                  setActiveEvent(e)
                  setActivePoster(null)
                }}>
                <MapEvent event={e} />
              </TouchableOpacity>
            </Marker>
          )
        })}
        {Object.values(mapProfiles).map(e => {
          return (
            <Marker
              coordinate={{latitude: e.lat, longitude: e.lng}}
              key={e.wsId}
              identifier={e.wsId}
              onPress={() => {
                setActiveEvent(null)
                setActivePoster(null)
                nav.push('ProfileView', {id: e.id})
              }}
              style={{opacity: currentZoom >= 13 ? 1 : 0}}
              tracksViewChanges={false}>
              <MapProfile event={e} />
            </Marker>
          )
        })}
        {Object.values(mapPosters).map(poster => {
          return (
            <Marker
              coordinate={{
                latitude: poster.latitude,
                longitude: poster.longitude,
              }}
              key={poster.id}
              identifier={poster.id}
              style={{opacity: currentZoom >= 11 ? 1 : 0}}
              tracksViewChanges={false}>
              <TouchableOpacity
                onPress={() => {
                  setActivePoster(poster)
                  setActiveEvent(null)
                }}>
                <MapPoster poster={poster} />
              </TouchableOpacity>
            </Marker>
          )
        })}
        <EventPreview
          event={activeEvent}
          updateEvent={e => setMapEvents(m => ({...m, [e.id]: e}))}
          deselect={() => setActiveEvent(null)}
        />
        <PosterPreview
          poster={activePoster}
          updatePoster={e => {
            setMapPosters(m => ({...m, [e.id]: e}))
            setActivePoster(e)
          }}
          popup={popupRef}
        />
      </MapView>
      <TouchableOpacity
        style={{
          bottom: 50,
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
      <MPopup ref={popupRef} onlyOne />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    top: 0,
    bottom: 0,
  },
  mapGradient: {
    height: '100%',
    width: '100%',
    zIndex: 999999,
  },
  map: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
})
