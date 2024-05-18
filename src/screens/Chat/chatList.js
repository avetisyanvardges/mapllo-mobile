import {isEmpty} from 'lodash'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native'
import SwipeableFlatList from 'react-native-swipeable-list'
import {useSelector} from 'react-redux'

import ChatListItem from './chatListItem'
import MText from '../../components/MText'
import EnvelopeIcon from '../../icons/EnvelopeIcon'

export default function ChatList() {
  let chats = Object.values(useSelector(state => state.chats.chats) || [])
  const profileId = useSelector(state => state.auth.id)

  chats.sort(function(a, b) {
    const hasNew1 = a.messages.some(m => !m.chatMessage.viewed && m.chatMessage.sender !== profileId)
    const hasNew2 = b.messages.some(m => !m.chatMessage.viewed && m.chatMessage.sender !== profileId)
    if (hasNew1 && !hasNew2) {
      return -1
    } else if (hasNew2 && !hasNew1) {
      return 1
    } else {
      const d1 = new Date(a.lastMessageDate)
      const d2 = new Date(b.lastMessageDate)
      return d2 - d1
    }
  });
  const {t} = useTranslation()
  return (
    <SwipeableFlatList
      data={Object.values(chats)}
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      preventSwipeRight
      maxSwipeDistance={90}
      keyExtractor={(item, index) => item.id}
      renderItem={({item}) => <ChatListItem item={item} />}
      contentContainerStyle={{flex: isEmpty(chats) ? 1 : 0}}
      ListEmptyComponent={() => {
        return (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <EnvelopeIcon />
            <MText
              style={{
                width: 100,
                marginTop: 24,
                textAlign: 'center',
                color: '#818195',
                fontSize: 16,
              }}>
              {t('no_messages')}
            </MText>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  createEventCircle: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#A347FF',
    shadowRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  createDatingCircle: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#F3267D',
    shadowRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  online: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#35D055',
    borderRadius: 10,
    width: 10,
    height: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  chatItem: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 22,
  },
  name: {
    color: '#818195',
    fontSize: 12,
  },
  date: {
    color: '#818195',
    fontSize: 10,
  },
  last: {
    fontSize: 16,
    marginTop: 5,
  },
  systemLast: {
    color: '#818195',
  },
  unread: {
    backgroundColor: '#F3267D',
    borderRadius: 50,
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
  },
})
