import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native'
import 'react-native-get-random-values'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import ChatItem from './ChatItem'
import MBack from '../../components/MBack'
import MParticipants from '../../components/MParticipants'
import MText from '../../components/MText'
import {
  getChat,
  getChats,
  sendMessageToChat,
  viewMessage,
} from '../../configs/api'
import Socket from '../../configs/socket'
import ArrowLeftIcon from '../../icons/ArrowLeftIcon'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'

import ArrowRightIcon from '../../icons/ArrowRightIcon'
import CancelIcon from '../../icons/CancelIcon'

import { all } from 'axios'

import ReplyIcon from '../../icons/ReplyIcon'
import {
  updateChatMessages,
  updateChats,
  viewMessages,
} from '../../slices/chatReducer'
import { currentChatId, setCurrentChatId } from '../AuthorizedStack/chatUpdater'

const pageSize = 20

export default function Chat({
  chatId,
  title,
  online,
  withOnline,
  avatarUrl,
  onAvatarClick,
  event,
}) {
  const chatMessages = useSelector(state => state.chats?.chats?.[chatId]?.messages) || []
  const [hasMoreMessages, setHasMoreMessages] = useState(chatMessages.length >= pageSize)

  const [eventInternal, setEventInternal] = useState(event)
  const profileId = useSelector(state => state.auth.id)
  const username = useSelector(state => state.auth.userName)
  const { t } = useTranslation()
  const [sendingMessages, setSendingMessages] = useState([])
  const [message, setMessage] = useState()
  const [typing, setTyping] = useState(false)
  const [lastTyping, setLastTyping] = useState()
  const [scrollEnabled, setScrollEnabled] = useState(true)
  const [selected, setSelected] = useState()
  const insets = useSafeAreaInsets()
  const listRef = useRef()
  const typingStarted = useRef()
  const dispatch = useDispatch()

  const focused = useIsFocused()

  useEffect(() => {
    if (focused) {
      setCurrentChatId(chatId)
    } else {
      setCurrentChatId(null)
    }
    return () => setCurrentChatId(null)
  }, [focused])

  useEffect(() => {
    if (chatMessages.length > 0 && sendingMessages.length > 0) {
      const chatMessagesIds = chatMessages.map(m => !m.chatMessage.id)
      setSendingMessages(s => s.filter(s =>chatMessagesIds.includes(s.chatMessage.id)))
    }

    const notViewedMessages = chatMessages.filter(m => !m.chatMessage.viewed && m.chatMessage.sender !== profileId)
    if (notViewedMessages.length > 0) {
      notViewedMessages.forEach(m => viewMessage(m.chatMessage.id))
      dispatch(viewMessages(notViewedMessages.map(m => m.chatMessage)))
    }
  }, [chatMessages])

  useEffect(() => {
    if (message && (!lastTyping || new Date().getTime() - lastTyping > 2000)) {
      setLastTyping(new Date().getTime())
      Socket.send({ type: 'typing', params: { chatId } })
    }
  }, [message])

  useEffect(() => {
    Socket.addCallback({
      supports: m => {
        return (
          m.type === 'TYPING' &&
          m.data.chatId === chatId &&
          m.data.userId !== profileId
        )
      },
      execute: m => {
        setTyping(true)
        typingStarted.current = new Date().getTime()
        setTimeout(() => {
          if (new Date().getTime() - typingStarted.current > 5000) {
            setTyping(false)
          }
        }, 5000)
      },
    })
    Socket.addCallback({
      supports: m => {
        return m.type === 'VIEWED' && m.data.chatId === chatId
      },
      execute: m => {
        dispatch(viewMessages(m.data.messageIds.map(id => ({chatId: chatId, id: id}))))
      },
    })

    return () => {
      Socket.removeLastCallback()
      Socket.removeLastCallback()
    }
  }, [])

  const allMessages = [
    ...sendingMessages,
    ...(chatMessages ? chatMessages.slice() : []),
  ]

  const renderItem = ({ item, index }) => {
    return (
      <ChatItem
        item={item}
        key={item.chatMessage.id}
        previousItem={
          allMessages.length >= index + 2 ? allMessages[index + 1] : null
        }
        nextItemDate={
          index === allMessages.length - 1
            ? null
            : new Date(allMessages[index + 1].chatMessage.createdAt)
        }
        onSwipeStart={() => scrollEnabled && setScrollEnabled(false)}
        onSwipeEnd={() => !scrollEnabled && setScrollEnabled(true)}
        onSelected={() => setSelected({ item, index })}
        event={eventInternal}
      />
    )
  }
  
  const downloadNext = async () => {
    if (!hasMoreMessages) {
      return
    }
    const lastMessage = chatMessages[chatMessages.length - 1]
    const response = await getChat(chatId, lastMessage.chatMessage.id, pageSize, true)
    if (response.data.length == 0) {
      setHasMoreMessages(false)
    } else {
      const messages = response.data.reverse()
      dispatch(updateChatMessages({messages, prepend: true}));
    }
  }

  const sendMessage = async () => {
    const m = message?.trim()
    if (!m || m === '') {
      return
    }
    setMessage(null)
    setSelected(null)
    const toSend = {
      id: uuidv4(),
      chatId,
      message,
      sending: true,
      sender: profileId,
      replyTo: selected?.item?.chatMessage?.id,
    }
    const nested = { chatMessage: toSend, username }
    setSendingMessages(m => [{ ...nested }, ...m])
    await sendMessageToChat(toSend)
    const sendingMessagesFiltered = sendingMessages.filter(
      m => m.id != toSend.id,
    )
    setSendingMessages(m => [
      {
        chatMessage: { ...toSend, sending: null, createdAt: new Date() },
        username,
      },
      ...sendingMessagesFiltered,
    ])
  }
  const withPreWarning = allMessages.length === 0 && !eventInternal
  const withPostWarning =
    allMessages.length === 1 && allMessages[0].chatMessage.sender === profileId

  const chatList = () => {
    return (
      <>
        <FlatList
          ref={listRef}
          data={allMessages}
          renderItem={renderItem}
          scrollEnabled={scrollEnabled}
          onEndReached={downloadNext}
          inverted
        />
        {withPostWarning && (
          <View>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                padding: 20,
                marginHorizontal: 20,
                borderRadius: 20,
                marginVertical: 20,
              }}>
              <MText style={{ color: '#2C2C2C', textAlign: 'center' }}>
                {t('chat_post_warning')}
              </MText>
            </View>
          </View>
        )}
      </>
    )
  }

  const warning = (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onTouchEnd={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: '#F3F3F3',
          padding: 20,
          marginHorizontal: 20,
          borderRadius: 20,
        }}>
        <MText style={{ color: '#2C2C2C', textAlign: 'center' }}>
          {t('chat_warning')}
        </MText>
      </View>
    </View>
  )

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <MBack absolute={false} />
            <View style={styles.centerHeader}>
              {!eventInternal ? (
                <>
                  <MText bold style={styles.title}>
                    {title}
                  </MText>
                  {typing && <MText style={styles.typing}>{t('typing')}</MText>}
                  {!typing && withOnline && (
                    <MText style={styles.online}>
                      {online ? t('online') : t('offline')}
                    </MText>
                  )}
                </>
              ) : (
                <MParticipants
                  event={eventInternal}
                  applications={eventInternal.participants.filter(
                    p => p.status === 'APPLICATION',
                  )}
                  participants={eventInternal.participants.filter(
                    p => p.status === 'ACCEPTED',
                  )}
                  removeUser={userId =>
                    setEventInternal(e => ({
                      ...e,
                      participants: e.participants.filter(p => p.id !== userId),
                    }))
                  }
                  acceptUser={user =>
                    setEventInternal(e => ({
                      ...e,
                      participants: [user, ...e.participants],
                    }))
                  }
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.avatarHeader}
              onPress={onAvatarClick}>
              <FastImage
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.chat}>
            {withPreWarning ? warning : chatList()}
          </View>
          {eventInternal?.deleted ? (
            <></>
          ) : (
            <>
              {selected && (
                <View style={styles.replyContainer}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                    <ReplyIcon />
                  </View>
                  <ScrollView
                    style={styles.replyScroll}
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                      style={styles.reply}
                      onPress={() =>
                        listRef.current.scrollToIndex({
                          index: selected.index,
                          animated: true,
                        })
                      }>
                      <MText style={{ color: '#a347ff' }}>
                        {t('reply') + ' ' + selected.item.username}
                      </MText>
                      <MText style={{ color: '#2C2C2C' }}>
                        {selected.item.chatMessage.message}
                      </MText>
                    </TouchableOpacity>
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setSelected(null)}
                    style={{ padding: 5 }}>
                    <CancelIcon color="#A347FF" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.send}>
                <View style={styles.sendInput}>
                  <TextInput
                    autoCapitalize={false}
                    multiline
                    autoComplete="off"
                    editable={!withPostWarning}
                    style={{ paddingLeft: 10, fontWeight: '300' }}
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    withPostWarning || !message
                      ? { backgroundColor: '#818195' }
                      : {},
                  ]}
                  onPress={sendMessage}
                  disabled={withPostWarning}>
                  <ArrowRightIcon />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  replyScroll: {
    maxHeight: 200,
  },
  replyContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  reply: {
    borderLeftColor: '#E3E3E3',
    borderLeftWidth: 1,
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: '#F3267D',
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 7.81,
    paddingLeft: 12.67,
    paddingRight: 11.7,
  },
  sendInput: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    minHeight: 31,
    paddingBottom: 4,
    justifyContent: 'center',
    maxHeight: 200,
    flex: 1,
    marginRight: 12,
  },
  send: {
    paddingTop: 13,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  avatarHeader: {},
  centerHeader: {
    alignItems: 'center',
    flex: 1,
  },
  online: {
    fontSize: 10,
    color: '#818195',
  },
  typing: {
    fontSize: 10,
    color: '#818195',
  },
  chat: {
    flex: 1,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
  },
  backArrowContainer: {
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
  },
})
