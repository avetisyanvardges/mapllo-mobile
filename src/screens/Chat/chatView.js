import {useNavigation} from '@react-navigation/native'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import Chat from './chat'
import {getChatWith, getEvent, getProfile} from '../../configs/api'

export default function ChatView({route}) {
  const id = route.params.id
  const user = route.params.user
  const chatIdProp = route.params.chatId
  const username = route.params.username
  const online = route.params.online
  const avatar = route.params.avatar
  const userId = route.params.userId
  const eventId = route.params.eventId
  const {parentRoute} = route.params
  const nav = useNavigation()
  const [chatId, setChatId] = useState(chatIdProp)
  const [data, setData] = useState()

  const {t} = useTranslation()

  useEffect(() => {
    if (id) {
      getProfile(id).then(r => {
        const u = r.data
        setData({title: u.userName, avatar: u.photos[0].uri, online: u.online})
      })
      getChatWith(id).then(r => {
        setChatId(r.data)
      })
    }
    if (user) {
      getChatWith(user.id).then(r => {
        setChatId(r.data)
      })
      setData({
        title: user.userName,
        avatar: user.photos[0].uri,
        online: user.online,
      })
    } else if (eventId) {
      getEvent(eventId).then(r => {
        setChatId(r.data.chatId)
        setData({avatar: r.data.avatarUrl, online: false, event: r.data})
      })
    } else {
      setData({title: username, avatar, online})
    }
  }, [])

  if (!data) {
    return <></>
  }
  if (!chatId) {
    return <></>
  }
  return (
    <Chat
      chatId={chatId}
      title={data.title}
      avatarUrl={data.avatar}
      online={data.online}
      withOnline={!eventId}
      event={data.event}
      onAvatarClick={() => {
        if (eventId) {
          getEvent(eventId).then(r => {
            nav.push('EventView', {id: r.data.id, event: r.data})
          })
        } else {
          if (parentRoute !== 'ProfileView') {
            nav.push('ProfileView', {
              id: user?.id || userId || id,
              parentRoute: 'ChatView',
            })
          }
        }
      }}
    />
  )
}
