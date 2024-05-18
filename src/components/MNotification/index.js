import * as Haptics from 'expo-haptics'
import React from 'react'
import {
  Animated,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import {runOnJS} from 'react-native-reanimated'
import {withSafeAreaInsets} from 'react-native-safe-area-context'

import {normalize} from '../../assets/normalize'
import i18n from '../../configs/i18n'
import Socket from '../../configs/socket'
import MText from '../MText'

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

class MNotification extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {messages: [{"chatAvatarUrl": "https://mapllo.com/fs/IMAGE/94c88fbd-a049-4e1d-af9b-4b6d470338a5", "chatEventId": "61c885bb-471e-4288-9392-08932166ae7e", "chatMessage": {"chatId": "07384d86-ed7b-4dac-b95b-b5ef53d28d03", "createdAt": "2023-07-01T21:41:29.096154041Z", "id": "b7f49468-fde0-4249-9e97-0964ba94de58", "message": "This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the This is the ", "replyTo": null, "sender": "de9373d7-b847-4adc-b95b-7dc7039c16d3", "viewed": false}, "chatUserId": null, "replyMessage": null, "username": "admin"}]};
    this.state = {messages: [], lastPress: null}
    this.anim = new Animated.Value(-300)
    this.insets = this.props.insets
    this.t = this.props.t
    this.username = this.props.username
  }

  returnBack = () => {
    Animated.spring(this.anim, {
      toValue: -300,
      speed: 5,
      useNativeDriver: true,
    }).start()
  }

  add(chat, message) {
    Haptics.selectionAsync()
    if (this.return) {
      clearInterval(this.return)
    }
    this.return = setTimeout(this.returnBack, 5000)
    Animated.spring(this.anim, {
      toValue: 0,
      speed: 5,
      useNativeDriver: true,
    }).start()

    this.setState({messages: [{chat, message}]})
    setTimeout(() => {
      this.setState(state => ({
        messages: state.messages.filter(item => item.message !== message),
        lastPress: null,
      }))
    }, 6000)
  }

  hide(message) {
    if (this.return) {
      clearInterval(this.return)
    }
    this.returnBack()
    if (message) {
      this.setState(state => ({
        messages: state.messages.filter(item => item.message !== message),
        lastPress: null,
      }))
    }
  }

  panGesture = Gesture.Pan().onUpdate(e => {
    if (e.translationY < 0) {
      if (this.hide) {
        runOnJS(this.hide)()
      }
    }
  })

  toAnimation(mes, i) {
    const message = mes.message
    const chat = mes.chat
    const m = message.chatMessage
    const userId = message.chatMessage.sender
    const eventId = chat.eventId
    const param = {}
    let id
    if (userId) {
      param.id = userId
      id = userId
    }
    if (eventId) {
      param.eventId = eventId
      param.chatId = chat.id
      id = m.chatId
    }

    let text
    if (!m.sender) {
      const params = {...m.message.split(',')}
      text = i18n.t(params[0], params)
    } else {
      text = m.message
    }
    return (
      <GestureHandlerRootView key={m.id}>
        <GestureDetector gesture={this.panGesture}>
          <Animated.View
            key={i}
            style={[
              styles.popup,
              {transform: [{translateY: this.anim}]},
              {minHeight: 70 + this.insets.top},
            ]}
            l>
            <Pressable
              style={[
                styles.messageBox,
                {
                  marginTop: this.insets.top,
                },
              ]}
              disabled={this.state.lastPress && this.state.lastPress === id}
              onPress={() => {
                this.setState(s => ({...s, lastPress: id}))
                Socket.nav.push('ChatView', param)
              }}>
              <FastImage
                source={{uri: chat.avatarUrl}}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 15,
                  marginRight: 20,
                }}
                resizeMode="cover"
              />
              <View style={{flex: 1}}>
                {message.username && (
                  <MText bold style={[styles.sender]}>
                    {message.username}
                  </MText>
                )}
                <MText numberOfLines={2}>{text}</MText>
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    )
  }

  render() {
    return (
      <View style={[styles.popupContainer]} pointerEvents="box-none">
        {this.state.messages
          .filter(m => m.message.username !== this.username)
          .map((m, i) => this.toAnimation(m, i))}
      </View>
    )
  }
}

export default withSafeAreaInsets(MNotification)

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  popup: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  messageBox: {
    marginHorizontal: 20,
    height: 60,
    maxHeight: 60,
    paddingBottom: normalize(10),
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sender: {
    color: '#2c2c2c',
    fontSize: 18,
  },
  message: {
    color: '#2c2c2c',
  },
})
