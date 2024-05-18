import * as Location from 'expo-location'
import {AppState} from 'react-native'
import DeviceInfo from 'react-native-device-info'

import {wsUrl} from './constants'

let socketToken
let shareLocation
let connecting = false
let connected = false

class Socket {
  static nav
  static notificationRef
  static callbacks = []
  static reconnectCallback = []
  static ws

  static addCallback({execute, supports}) {
    Socket.callbacks.push({execute, supports})
  }

  static addReconnectCallback(callback) {
    Socket.reconnectCallback.push(callback)
  }

  static removeLastCallback() {
    Socket.callbacks.pop()
  }

  static removeLastReconnectCallback() {
    Socket.reconnectCallback.pop()
  }

  static setShare(val) {
    shareLocation = val
  }

  static start(token, share) {
    socketToken = token
    shareLocation = share
    Socket.connect()
  }

  static send(message) {
    if (Socket.ws) {
      Socket.ws.send(JSON.stringify(message))
    }
  }

  static async connect() {
    if (connecting || connected) {
      return
    } else {
      connecting = true
    }
    const deviceId = await DeviceInfo.getUniqueId()
    Socket.ws = new WebSocket(wsUrl, null, {
      headers: {
        Authorization: 'Bearer ' + socketToken,
        deviceid: deviceId,
      },
    })
    Socket.ws.onopen = () => {
      console.log('connected')
      connected = true
      connecting = false
      this.appStateListener = AppState.addEventListener(
        'change',
        nextAppState => {
          const message = {
            type: 'appState',
            params: {
              state: nextAppState,
            },
          }
          if (Socket.ws) {
            Socket.ws.send(JSON.stringify(message))
          }
        },
      )
      this.shareLoc()
      this.schedule = setInterval(this.shareLoc, 10000)
      for (const callback of Socket.reconnectCallback) {
        callback()
      }
    }
    Socket.ws.onmessage = m => {
      const data = JSON.parse(m.data)
      let supports = false
      for (const callback of Socket.callbacks) {
        if (callback['supports'](data)) {
          supports = true
          callback['execute'](data)
          break
        }
      }
      // if (!supports && data.type === 'CHAT_MESSAGE') {
      //   Socket.notificationRef.add(data.data)
      // }
    }
    Socket.ws.onclose = e => {
      connected = false
      connecting = false
      console.log('closed')
      clearInterval(this.schedule)
      if (this.appStateListener) {
        this.appStateListener.remove()
      }
      Socket.ws = null
      if (socketToken) {
        console.log('reconnecting')
        setTimeout(() => Socket.connect(), 1000)
      }
    }
    Socket.ws.onerror = e => {
      console.log('error', e, typeof e)
    }
  }

  static async shareLoc() {
    if (!shareLocation) {
      return
    }
    const perms = await Location.getForegroundPermissionsAsync()
    if (perms.granted) {
      Location.getCurrentPositionAsync().then(pos => {
        const acc = pos?.coords?.accuracy
        const latitude = pos?.coords?.latitude
        const longitude = pos?.coords?.longitude
        const latitudeDelta = (acc * 1.0) / 111111
        const division = 111111 * Math.cos(latitude)
        const longitudeDelta = Math.abs((acc * 1.0) / division)

        const message = {
          type: 'location',
          params: {
            lng: longitude,
            lat: latitude,
            lngDelta: longitudeDelta,
            latDelta: latitudeDelta,
          },
        }
        if (Socket.ws) {
          Socket.ws.send(JSON.stringify(message))
        }
      })
    }
  }

  static disconnect() {
    socketToken = null
    Socket.ws?.close()
  }
}
export default Socket
