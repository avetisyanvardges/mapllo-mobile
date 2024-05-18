import {useNavigation} from '@react-navigation/native'
import React, {memo, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Animated,
  Linking,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'

import MLoader from '../../components/MLoader'
import MText from '../../components/MText'
import {isToday, isYesterday} from '../../configs/constants'
import Checkmark from '../../icons/Checkmark'
import DeletedAva from '../../icons/DeletedAva'
import DoubleCheckmark from '../../icons/DoubleCheckmark'

function ChatItem({
  item,
  previousItem,
  nextItemDate,
  onSwipeStart,
  onSwipeEnd,
  onSelected,
  event,
}) {
  const profileId = useSelector(state => state.auth.id)
  const {t} = useTranslation()
  const offset = useRef(new Animated.Value(0)).current
  const system = item.chatMessage.sender === null
  const nav = useNavigation()

  const shouldPrintDate =
    item.chatMessage.createdAt &&
    nextItemDate?.getDate() !== new Date(item.chatMessage.createdAt).getDate()
  const datePrint = new Date(item.chatMessage.createdAt)
  let date
  if (shouldPrintDate && isToday(datePrint)) {
    date = t('today')
  } else if (shouldPrintDate && isYesterday(datePrint)) {
    date = t('yesterday')
  } else {
    date = datePrint.toLocaleDateString()
  }

  if (system) {
    const params = {...item.chatMessage.message.split(',')}
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        {shouldPrintDate && (
          <View>
            <MText style={styles.dateStyle}>{date}</MText>
          </View>
        )}
        <View style={{marginVertical: 10}}>
          <MText bold style={styles.systemText}>
            {t(params[0], params)}
          </MText>
        </View>
      </View>
    )
  }

  const own = profileId === item.chatMessage.sender
  const alignment = own
    ? {justifyContent: 'flex-end'}
    : {justifyContent: 'flex-start'}
  const renderDateAndStatus = () => {
    const date = new Date(item.chatMessage.createdAt)
      .toLocaleTimeString('ru-RU')
      .slice(0, 5)
    if (item.chatMessage.sending) {
      return (
        <View style={styles.dateStatus}>
          <MLoader size={20} />
        </View>
      )
    } else if (item.chatMessage.viewed) {
      return (
        <View style={styles.dateStatus}>
          <MText style={styles.date}>{date}</MText>
          {profileId === item.chatMessage.sender && (
            <DoubleCheckmark size={15} />
          )}
        </View>
      )
    } else {
      return (
        <View style={styles.dateStatus}>
          <MText style={styles.date}>{date}</MText>
          {profileId === item.chatMessage.sender && <Checkmark size={15} />}
        </View>
      )
    }
  }

  const max = 80
  const panResponderMove = (event, gestureState) => {
    onSwipeStart()
    const val = own
      ? Math.min(0, Math.max(-max, gestureState.dx))
      : Math.max(Math.min(max, gestureState.dx), 0)
    offset.setValue(val)
  }

  const panResponderEnd = (event, gestureState) => {
    const off = Math.abs(gestureState.dx)
    if (off >= max) {
      onSelected()
    }
    onSwipeEnd()
    Animated.spring(offset, {
      useNativeDriver: true,
      toValue: 0,
      duration: 300,
    }).start()
  }

  const shouldSetPanResponderCapture = (event, gestureState) => {
    return (
      gestureState.dy < 10 &&
      ((gestureState.dx > 0 && !own) || (gestureState.dx < 0 && own))
    )
  }
  const p = event?.allUsers.filter(p => p.id === item.chatMessage.sender)
  const sender = p?.length >= 1 ? p[0] : null

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: shouldSetPanResponderCapture,
    onPanResponderGrant: (event, gestureState) => {},
    onPanResponderMove: panResponderMove,
    onPanResponderRelease: panResponderEnd,
    onPanResponderTerminationRequest: (event, gestureState) => false,
    onPanResponderTerminate: panResponderEnd,
  })

  const renderTextMessage = () => {
    return (
      <MText style={{color: '#2C2C2C', fontSize: 14}}>
        {item.chatMessage.message}
      </MText>
    )
  }

  const handleLinkPress = url => {
    if (!url.startsWith('http')) {
      Linking.openURL('https://' + url)
    } else {
      Linking.openURL(url)
    }
  }

  const isURL = word => {
    // Regular expression pattern to match URLs
    const urlPattern =
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{2,5})?([\/\w.-]*)*\/?$/i
    return urlPattern.test(word)
  }

  const isEmoji = text => {
    const emojiPattern =
      /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{1F30D}-\u{1F567}]/u
    return text.match(/./gu).length <= 3 && emojiPattern.test(text)
  }

  const renderTextWithLinks = text => {
    const words = text.split(' ')
    let textBuilder = ''
    const items = []
    let i = 0
    for (const word of words) {
      if (isURL(word)) {
        const text = textBuilder
        textBuilder = ''
        if (text.length > 0) {
          items.push(
            <MText key={i++} style={{color: '#2C2C2C', fontSize: 14}}>
              {text + ' '}
            </MText>,
          )
        }
        items.push(
          <MText
            key={i++}
            style={{
              color: 'blue',
              fontSize: 14,
              textDecorationLine: 'underline',
            }}
            onPress={() => handleLinkPress(word)}>
            {word}
          </MText>,
        )
      } else {
        textBuilder += word + ' '
      }
    }
    items.push(
      <MText key={i++} style={{color: '#2C2C2C', fontSize: 14}}>
        {textBuilder}
      </MText>,
    )
    return items
  }

  return (
    <View style={styles.cont} {...panResponder?.panHandlers}>
      {shouldPrintDate && (
        <View style={{marginBottom: 13}}>
          <MText style={styles.dateStyle}>{date}</MText>
        </View>
      )}
      <Animated.View
        style={[
          styles.container,
          alignment,
          {transform: [{translateX: offset}]},
        ]}>
        {sender && sender.id !== profileId && event &&
          (previousItem?.chatMessage?.sender !== sender?.id ? (
            <TouchableOpacity
              onPress={() => nav.push('ProfileView', {id: sender.id})}>
              {sender.avatarUrl ? (
                <FastImage
                  style={{width: 50, height: 50, borderRadius: 10}}
                  source={{uri: sender.avatarUrl}}
                  resizeMode="cover"
                />
              ) : (
                <DeletedAva style={{width: 50, height: 50}} />
              )}
            </TouchableOpacity>
          ) : (
            <View style={{width: 50}} />
          ))}
        <View
          style={[
            styles.message,
            isEmoji(item.chatMessage.message)
              ? {}
              : own
                ? {backgroundColor: '#fff', borderWidth: 1}
                : {backgroundColor: '#F3F3F3'},
          ]}>
          {item.replyMessage && (
            <TouchableOpacity style={styles.reply}>
              <MText style={{fontSize: 14}}>
                {item.replyMessage.chatMessage.message}
              </MText>
            </TouchableOpacity>
          )}
          {sender?.id !== profileId &&
            event &&
            previousItem?.chatMessage?.sender !== sender?.id && (
              <MText style={{fontSize: 12, marginBottom: 5, color: '#818195'}}>
                {item.username}
              </MText>
            )}
          {isEmoji(item.chatMessage.message) ? (
            <MText style={{fontSize: 40}}>{item.chatMessage.message}</MText>
          ) : (
            renderTextWithLinks(item.chatMessage.message)
          )}
          <View style={styles.status}>{renderDateAndStatus()}</View>
        </View>
      </Animated.View>
    </View>
  )
}

export default memo(ChatItem)

const styles = StyleSheet.create({
  systemText: {
    fontSize: 16,
    color: '#818195',
    textAlign: 'center',
  },
  reply: {
    borderLeftColor: '#A347FF',
    borderLeftWidth: 1,
    paddingLeft: 5,
    maxHeight: 50,
    overflow: 'hidden',
  },
  dateStyle: {
    color: '#818195',
  },
  cont: {
    alignItems: 'center',
    marginVertical: 5,
  },
  date: {
    fontSize: 8,
    marginRight: 2,
  },
  dateStatus: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  status: {
    position: 'absolute',
    bottom: 2,
    right: 3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  message: {
    flexShrink: 1,
    borderColor: '#E3E3E3',
    minWidth: 70,
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 15,
    marginHorizontal: 10,
    paddingRight: 25,
    paddingLeft: 10,
  },
})
