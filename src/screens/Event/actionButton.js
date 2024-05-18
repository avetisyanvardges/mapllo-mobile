import {StyleSheet, TouchableOpacity, View} from 'react-native'
import MText from '../../components/MText'
import * as React from 'react'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import {leaveEvent, participate} from '../../configs/api'
import {useSelector} from 'react-redux'

export default function ActionButton({user, event, updateStatus}) {
  const nav = useNavigation()
  const {t} = useTranslation()
  const profileId = useSelector(state => state.auth.id)

  const leave = () => {
    leaveEvent(event.id).then(r => {
      if (r.status === 200) {
        updateStatus(null)
      }
    })
  }

  const leaveEventButton = () => (
    <TouchableOpacity
      style={[
        styles.activeButton,
        {backgroundColor: 'rgba(16, 16, 34, 0.4)', marginTop: 7},
      ]}
      onPress={leave}>
      <MText boldbold style={styles.activeButtonText}>
        {t('leave_event')}
      </MText>
    </TouchableOpacity>
  )

  const eventChatButton = () => (
    <TouchableOpacity
      style={[styles.activeButton, {backgroundColor: '#A347FF'}]}
      onPress={() =>
        nav.push('ChatView', {
          chatId: event.chatId,
          eventId: event.id,
        })
      }>
      <MText boldbold style={styles.activeButtonText}>
        {t('event_chat')}
      </MText>
    </TouchableOpacity>
  )

  const applicationInProgressButton = () => (
    <View
      style={[styles.activeButton, {backgroundColor: 'rgba(16, 16, 34, 0.4)'}]}>
      <MText boldbold style={styles.activeButtonText}>
        {t('application_in_progress')}
      </MText>
    </View>
  )

  const sendApplication = () => {
    participate(event.id).then(r => {
      if (r.status === 200) {
        updateStatus('APPLICATION')
      }
    })
  }

  const sendApplicationButton = () => (
    <TouchableOpacity
      style={[styles.activeButton, {backgroundColor: '#A347FF'}]}
      onPress={sendApplication}>
      <MText boldbold style={styles.activeButtonText}>
        {t('send_application')}
      </MText>
    </TouchableOpacity>
  )

  const sendMessage = () => {}

  const sendMessageButton = () => (
    <TouchableOpacity
      style={[styles.activeButton, {backgroundColor: '#F3267D'}]}
      onPress={sendMessage}>
      <MText boldbold style={styles.activeButtonText}>
        {t('send_message')}
      </MText>
    </TouchableOpacity>
  )

  let result
  if (event.ownerId === profileId) {
    if (event?.type === 'EVENT') {
      return <>{eventChatButton()}</>
    } else {
      return <></>
    }
  }

  if (event?.type === 'DATING') {
    result = sendMessageButton()
  } else if (event?.type === 'EVENT') {
    if (event.participantStatus === 'ACCEPTED') {
      result = (
        <View style={{flexDirection: 'column'}}>
          {eventChatButton()}
          {leaveEventButton()}
        </View>
      )
    } else if (event.participantStatus === 'APPLICATION') {
      result = applicationInProgressButton()
    } else {
      result = sendApplicationButton()
    }
  }
  return result
}

const styles = StyleSheet.create({
  activeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  activeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
})
