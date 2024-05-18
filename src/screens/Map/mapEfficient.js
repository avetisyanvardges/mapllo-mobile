import {useNavigation} from '@react-navigation/native'
import * as Location from 'expo-location'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View, Platform, Alert, Linking} from 'react-native'
import MapView, {MAP_TYPES, Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {useSelector} from 'react-redux'

import MapCluster from './cluster'
import MapEvent from './event'
import EventPreview from './eventPreview'
import MapPoster from './poster'
import PosterPreview from './posterPreview'
import MapProfile from './profile'
import SelfCompas from './selfCompas'
import {darkTheme, lightTheme} from '../../assets/mapTheme'
import MPopup from '../../components/MPopup'
import {
  getAggregatedOptions,
  getAggregatedTiles,
  getAllOnlineProfiles,
  getAllPosters,
} from '../../configs/api'

const MapEfficient = () => {
  const userId = useSelector(state => state.auth.id)
  const showOnlineOnMap = useSelector(state => state.auth.showOnlineOnMap)
  const nav = useNavigation()
  const {t} = useTranslation()

  const selfCompasRef = useRef()
  const mapRef = useRef()
  const popupRef = useRef()

  const [userSessions, setUserSessions] = useState([])
  const [posters, setPosters] = useState([])
  const [mapTheme, setMapTheme] = useState(lightTheme)
  const [currentZoom, setCurrentZoom] = useState(-1)
  const [preview, setPreview] = useState()
  const [clusters, setClusters] = useState({})
  const [events, setEvents] = useState([])

  const [aggregatedMapOptions, setAggregatedMapOptions] = useState({})

  const updateMapStyle = () => {
    const now = new Date()
    const hour = now.getHours()
    const isDayTime = hour >= 6 && hour < 19

    const mapStyle = isDayTime ? lightTheme : darkTheme

    setMapTheme(mapStyle)
  }

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      updateMapStyle()
      Location.requestForegroundPermissionsAsync().then(s => {
        if (s.status !== 'granted') {
          // popupRef.current.add({
          //   text: t('access.camera.not_granted'),
          //   type: 'error',
          // })
          Alert.alert('', t('access.camera.not_granted'), [
            {
              text: t('components.MDateInput.cancel'),
              style: 'cancel',
            },
            {
              text: t('open_settings'),
              onPress: () => Linking.openSettings(),
            },
          ])
        } else {
          Location.getLastKnownPositionAsync().then(p => {
            mapRef?.current?.animateToRegion({
              latitude: p?.coords?.latitude,
              longitude: p?.coords?.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            })
          })
        }
      })
    })

    getAggregatedOptions().then(r => {
      setAggregatedMapOptions(r.data.zoomToCellSizes)
    })
    mapRef?.current
      ?.getCamera()
      .then(c => {
        c.zoom && setCurrentZoom(c.zoom)
      })
      .catch(e => {})
    refresh()
    const refreshInterval = setInterval(refresh, 10000)
    return () => {
      clearInterval(refreshInterval)
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // reload()
  }, [aggregatedMapOptions])

  const reload = () => {
    mapRef.current.getMapBoundaries().then(boundaries => {
      const cellSizes = aggregatedMapOptions[currentZoom]
      if (cellSizes) {
        const latSize = cellSizes.latSize
        const lngSize = cellSizes.lngSize

        const leftLngCellNum = Math.floor(
          boundaries.southWest.longitude / lngSize,
        )
        const rightLngCellNum = Math.floor(
          boundaries.northEast.longitude / lngSize,
        )
        const topLatCellNum = Math.floor(
          boundaries.northEast.latitude / latSize,
        )
        const bottomLatCellNum = Math.floor(
          boundaries.southWest.latitude / latSize,
        )

        const tiles = []
        for (let i = leftLngCellNum; i <= rightLngCellNum; i++) {
          for (let j = bottomLatCellNum; j <= topLatCellNum; j++) {
            tiles.push({lngNum: i, latNum: j})
          }
        }
        reloadInternal(currentZoom, tiles, boundaries)
      }
    })
  }

  const reloadInternal = (zoom, tiles, boundaries) => {
    getAggregatedTiles({
      tiles,
      zoom,
      leftLongitude: boundaries.southWest.longitude,
      rightLongitude: boundaries.northEast.longitude,
      topLatitude: boundaries.northEast.latitude,
      bottomLatitude: boundaries.southWest.latitude,
    }).then(r => {
      setClusters(c => ({
        ...c,
        [zoom]: r.data.groups.map(g => ({
          amount: g.amount,
          lngCellNum: g.lngCellNum,
          latCellNum: g.latCellNum,
        })),
      }))
      setEvents(r.data.events)
    })
  }

  useEffect(() => {
    if (currentZoom > 0) {
      if (
        events.length > 0 &&
        aggregatedMapOptions[currentZoom] &&
        aggregatedMapOptions[currentZoom].showEvents
      ) {
        return
      }
      setEvents([])
      setClusters({})
      reload()
    }
  }, [currentZoom])

  const onRegionChangeComplete = () => {
    reload()
  }

  const refresh = () => {
    getAllOnlineProfiles().then(r => {
      const onlineUserSessions = []
      for (const userSession of r.data) {
        if (userSession.id !== userId) {
          onlineUserSessions.push(userSession)
        } else {
          onlineUserSessions.push(userSession)
        }
      }
      setUserSessions(onlineUserSessions)
    })
    getAllPosters().then(r => setPosters(r.data))
  }

  const calculateZoom = ({
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  }) => {
    const lat = latitude
    const lng = longitude
    const deltaLat = latitudeDelta
    const deltaLng = longitudeDelta
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

  const onRegionChanged = async (region, v) => {
    const zoom = calculateZoom(region)
    if (currentZoom !== zoom && zoom) {
      setCurrentZoom(zoom)
    }
    if (preview) {
      // setPreview(null)
    }
    selfCompasRef.current.updateRotateAnim(region)
  }

  const renderOnlineUserSessions = () =>
    userSessions.map(s => (
      <Marker
        coordinate={{latitude: s.lat, longitude: s.lng}}
        key={s.wsId}
        identifier={s.wsId}
        onPress={() => {
          setPreview(null)
          nav.push('ProfileView', {id: s.id})
        }}
        style={{
          opacity: aggregatedMapOptions?.[currentZoom]?.showUsers ? 1 : 0,
        }}
        tracksViewChanges={false}>
        <MapProfile event={s} />
      </Marker>
    ))

  const renderPosters = () =>
    posters.map(poster => {
      return (
        <MapPoster
          key={poster.id}
          onPress={() => setPreview(poster)}
          aggregatedMapOptions={aggregatedMapOptions}
          poster={poster}
          currentZoom={currentZoom}
        />
      )
    })

  const renderClusters = () =>
    !clusters[currentZoom] ? (
      <></>
    ) : (
      clusters[currentZoom].map(cluster => {
        const optLatSize = aggregatedMapOptions[currentZoom].latSize
        const optLngSize = aggregatedMapOptions[currentZoom].lngSize
        const latitude = optLatSize * cluster.latCellNum + optLatSize / 2
        const longitude = optLngSize * cluster.lngCellNum + optLngSize / 2
        return (
          <Marker
            coordinate={{latitude, longitude}}
            key={cluster.latCellNum + '.' + cluster.lngCellNum}
            identifier={cluster.latCellNum + '.' + cluster.lngCellNum}
            tracksViewChanges={false}>
            <MapCluster
              amount={cluster.amount}
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
      })
    )

  const renderEvents = () =>
    events.map(event => {
      return (
        <MapEvent
          key={event.id}
          event={event}
          onPress={() => setPreview(event)}
        />
      )
    })

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        mapType={
          Platform.OS === 'android'
            ? MAP_TYPES.STANDARD
            : MAP_TYPES.MUTEDSTANDARD
        }
        customMapStyle={mapTheme}
        maxZoomLevel={16}
        rotateEnabled={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsIndoorLevelPicker={false}
        showsUserLocation={
          !(
            showOnlineOnMap &&
            aggregatedMapOptions[currentZoom]?.showUsers &&
            userSessions.filter(u => u.id === userId).length > 0
          )
        }
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={false}
        onRegionChange={onRegionChanged}
        onRegionChangeComplete={onRegionChangeComplete}>
        {renderOnlineUserSessions()}
        {renderPosters()}
        {renderClusters()}
        {renderEvents()}
      </MapView>
      <View style={styles.selfCompas}>
        <SelfCompas mapRef={mapRef} ref={selfCompasRef} />
      </View>
      <EventPreview
        event={preview?.type && preview}
        updateEvent={e => setPreview(e)}
        deselect={() => setPreview(null)}
      />
      <PosterPreview
        poster={!preview?.type && preview}
        updatePoster={e => setPreview(e)}
        popup={popupRef}
        deselect={() => setPreview(null)}
      />
      <MPopup ref={popupRef} onlyOne />
    </View>
  )
}
export default MapEfficient

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '110%',
  },
  map: {
    flex: 1,
  },
  selfCompas: {
    position: 'absolute',
    bottom: '15%',
    right: 40,
  },
})
