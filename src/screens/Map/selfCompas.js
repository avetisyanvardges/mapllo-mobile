import * as Location from 'expo-location'
import React from 'react'
import {Animated, TouchableOpacity} from 'react-native'

import LocationIcon from '../../icons/LocationIcon'

export default class SelfCompas extends React.Component {
  constructor(props) {
    super(props)
    this.mapRef = props.mapRef
    this.rotateAnim = new Animated.Value(0)
    this.state = {
      location: null,
    }
  }

  async updateLocation() {
    const perms = await Location.getForegroundPermissionsAsync()
    if (perms.granted) {
      const location = await Location.getLastKnownPositionAsync()
      this.setState(s => ({...s, location}))
    }
  }

  componentDidMount() {
    this.updateLocation()
    this.refreshLocationInterval = setInterval(
      this.updateLocation.bind(this),
      10000,
    )
  }

  componentWillUnmount() {
    clearInterval(this.refreshLocationInterval)
  }

  updateRotateAnim(region) {
    const r = this.state.location
    const rr = region
    if (!r || !rr) {
      return
    }

    const x1 = rr.latitude - (rr.latitudeDelta / 2) * 0.8
    const y1 = rr.longitude + (rr.longitudeDelta / 2) * 0.75
    const x2 = r?.coords?.latitude
    const y2 = r?.coords?.longitude
    const deltaX = x2 - x1
    const deltaY = y2 - y1
    const angle = Math.atan2(deltaY, deltaX)

    let rotate = angle * (180 / Math.PI)
    if (rotate > 0 && this.rotateAnim < 0) {
      rotate = rotate - 360
    }
    if (rotate < 0 && this.rotateAnim > 0) {
      rotate = 360 - rotate
    }
    Animated.spring(this.rotateAnim, {
      toValue: Math.round(rotate),
      duration: 80,
      useNativeDriver: true,
    }).start()
  }

  render() {
    if (!this.state.location) {
      return <></>
    }
    return (
      <TouchableOpacity
        onPress={() => {
          Location.getLastKnownPositionAsync().then(r => {
            this.mapRef.current.animateToRegion({
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
                rotate: this.rotateAnim.interpolate({
                  inputRange: [-179, 0, 179],
                  outputRange: ['-179deg', '0deg', '179deg'],
                }),
              },
            ],
          }}>
          <LocationIcon />
        </Animated.View>
      </TouchableOpacity>
    )
  }
}
