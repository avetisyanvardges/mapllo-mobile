import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import DeletedAva from '../../icons/DeletedAva'
import PeopleIcon from '../../icons/PeopleIcon'
import HeartIcon from '../../icons/HeartIcon'
import MText from '../../components/MText'
import React from 'react'
import MImage from '../../components/MImage'
import { useSelector } from 'react-redux'

function ChatListItem({item}) {
  const {t} = useTranslation()
  const nav = useNavigation()
  const profileId = useSelector(state => state.auth.id)

  let lastMessage = item.messages[0]

  const date = new Date(lastMessage.chatMessage.createdAt).toLocaleTimeString().slice(0, 5)
  const system = lastMessage.chatMessage.sender === null

  let text
  if (system) {
    const params = {...lastMessage.chatMessage.message.split(',')}
    text = t(params[0], params).substring(0, 47)
  } else {
    text = lastMessage.chatMessage.message.substring(0, 47)
  }
  if (text.length === 47) {
    text = text + '...'
  }

  const newMessages = item.messages.filter(m => !m.chatMessage.viewed && m.chatMessage.sender !== profileId)
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        nav.push('ChatView', {
          chatId: item.id,
          userId: item.userId,
          eventId: item.eventId,
          username: item.name,
          online: item.online,
          avatar: item.avatarUrl,
        })
      }
      style={[
        styles.chatItem,
        newMessages.length > 0 ? {backgroundColor: '#F3F3F3'} : {},
      ]}>
      <View>
        {item.avatarUrl ? (
          <MImage
            style={[styles.avatar]}
            source={{uri: item.avatarUrl}}
            resizeMode={'cover'}
            img={'ava'}
          />
        ) : (
          <DeletedAva
            size={60}
            style={{width: 60, height: 60, borderRadius: 15}}
          />
        )}
        {item.online && <View style={styles.online} />}
        {item.eventType === 'EVENT' && (
          <View style={styles.createEventCircle}>
            <PeopleIcon size={15} />
          </View>
        )}
        {item.eventType === 'DATING' && (
          <View style={styles.createDatingCircle}>
            <HeartIcon size={15} />
          </View>
        )}
      </View>
      <View style={{flex: 1, marginHorizontal: 20}}>
        {item.name && (
          <MText bold style={styles.name}>
            {item.name}
          </MText>
        )}
        <MText style={[styles.last, system ? styles.systemLast : {}]}>
          {text}
        </MText>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <MText style={styles.date}>{date}</MText>
        {newMessages.length > 0 ? (
          <View style={styles.unread}>
            <MText style={styles.unreadText} boldbold>
              {newMessages.length}
            </MText>
          </View>
        ) : (
          <View style={{height: 20}}></View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default ChatListItemMemo = React.memo(ChatListItem)

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
