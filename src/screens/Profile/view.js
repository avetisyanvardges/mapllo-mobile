import React, {useEffect, useRef, useState} from 'react'
import {View} from 'react-native'
import {useSelector} from 'react-redux'

import Profile from './index'
import {normalize} from '../../assets/normalize'
import MBack from '../../components/MBack'
import MPopup from '../../components/MPopup'
import {getProfile} from '../../configs/api'
import User from '../Event/user'

export default function ProfileView({route}) {
  const profileId = useSelector(state => state.auth.id)
  const userId = route.params.id
  const {parentRoute} = route.params
  const [user, setUser] = useState()
  const popupRef = useRef()

  console.log(userId, 'USER ID')
  useEffect(() => {
    if (userId !== profileId) {
      getProfile(userId).then(r => {
        setUser(r.data)
      })
    }
  }, [userId])

  if (!user && userId !== profileId) {
    return <View />
  }

  if (userId === profileId) {
    return (
      <>
        <MBack top={normalize(50)} left={20} />
        <Profile user={user} fullscreen />
      </>
    )
  } else {
    return (
      <>
        <MBack top={70} left={20} />
        <MPopup ref={popupRef} onlyOne />
        <User
          userInitial={user}
          popup={popupRef}
          fullscreen
          parentRoute={parentRoute}
        />
      </>
    )
  }
}
