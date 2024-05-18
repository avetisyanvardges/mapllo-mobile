import {StyleSheet, View} from 'react-native'
import React from 'react'
import MText from '../MText'

export default class MPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {messages: []}
    this.length = this.props.length ? this.props.length : 2500
  }

  add(message) {
    if (this.props.onlyOne) {
      this.setState(state => ({messages: [message]}))
    } else {
      this.setState(state => ({messages: [...state.messages, message]}))
    }
    setTimeout(() => {
      this.setState(state => ({
        messages: state.messages.filter(item => item !== message),
      }))
    }, this.length)
  }

  toAnimation(m, i) {
    return (
      <View key={i}>
        <View style={[styles.popup, styles['type_' + m.type]]}>
          <MText bold style={[styles.message, styles['message_' + m.type]]}>
            {m.text}
          </MText>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.popupContainer]} pointerEvents={'none'}>
        {this.state.messages.map((m, i) => this.toAnimation(m, i))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    zIndex: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  popup: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    minHeight: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  type_error: {
    backgroundColor: '#F3267D',
  },
  type_normal: {
    backgroundColor: '#fff',
  },
  message: {
    color: '#fff',
    textAlign: 'center',
  },
  message_normal: {
    color: '#818195',
  },
})
