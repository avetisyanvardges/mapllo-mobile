import {useNavigation} from '@react-navigation/native'
import {Divider} from '@rneui/base'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {useSelector} from 'react-redux'

import {normalize} from '../../assets/normalize'
import MExpandButton from '../../components/MExpandButton'
import MText from '../../components/MText'
import {complainTo, deleteEventCall, hideEntity} from '../../configs/api'
import DotsIcon from '../../icons/DotsIcon'
import PenIcon from '../../icons/PenIcon'

const backgroundColor = 'rgba(16, 16, 34, 0.4)'

export default function EventMenu({
  expanded,
  setExpanded,
  event,
  popupRef,
  hideElement,
  editSheetRef,
  route,
  deleteModalVisible,
  setDeleteModalVisible,
  filterExpanded,
}) {
  const {t} = useTranslation()
  const profileId = useSelector(state => state.auth.id)
  const nav = useNavigation()

  const complain = () => {
    complainTo('EVENT', event.id).then(r => {
      const status = r.status
      if (status === 200) {
        popupRef.current.add({text: t('complain_accepted'), type: 'normal'})
      } else if (status === 202) {
        popupRef.current.add({
          text: t('complain_already_accepted'),
          type: 'normal',
        })
      }
      setExpanded(false)
    })
  }
  React.useEffect(() => {
    if (!expanded) {
      setDeleteModalVisible(false)
    }
  }, [expanded])

  useEffect(() => {
    if (filterExpanded) {
      setExpanded(false)
    }
  }, [filterExpanded])

  const deleteEvent = () => {
    deleteEventCall(event.id)
    setExpanded(false)
    hideElement()
  }

  const hide = () => {
    hideEntity('EVENT', event.id).then(r => {
      const status = r.status
      let message
      if (status === 200) {
        message = t('event_hidden')
        popupRef.current.add({text: message, type: 'normal'})
      }
      hideElement()
      setExpanded(false)
    })
  }
  if (profileId === event?.ownerId) {
    return (
      <>
        <MExpandButton
          smallWidth={35}
          width={220}
          height={115}
          expanded={expanded}
          setExpanded={setExpanded}
          backgroundColor="rgba(16,16,34,0.4)"
          button={
            <View style={styles.smallButton}>
              <PenIcon size={16} />
            </View>
          }>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                setExpanded(false)
                editSheetRef.current.show()
              }}
              style={styles.item}>
              <MText bold style={styles.editListItem}>
                {t('Profile.editInfo')}
              </MText>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => {
                setExpanded(false)
                nav.push('Camera', {
                  media: {path: event.avatarUrl},
                  next: 'update_the_event',
                  eventData: event,
                })
              }}
              style={styles.item}>
              <MText bold style={styles.editListItem}>
                {t('Profile.editPhoto')}
              </MText>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(true)}
              style={styles.item}>
              <MText bold style={styles.editListItem}>
                {t('delete_event')}
              </MText>
            </TouchableOpacity>
          </View>
        </MExpandButton>
        {deleteModalVisible && expanded && (
          <View style={styles.deleteModal}>
            <TouchableOpacity
              style={styles.deleteModalButton}
              onPress={() => {
                setDeleteModalVisible(false)
                deleteEvent()
              }}>
              <MText style={{color: '#818195'}}>{t('yes')}</MText>
            </TouchableOpacity>
            <Divider orientation="vertical" />
            <TouchableOpacity
              style={styles.deleteModalButton}
              onPress={() => {
                setDeleteModalVisible(false)
              }}>
              <MText style={{color: '#818195'}}>{t('no')}</MText>
            </TouchableOpacity>
          </View>
        )}
      </>
    )
  }

  return (
    <MExpandButton
      smallWidth={35}
      width={220}
      height={75}
      expanded={expanded}
      setExpanded={setExpanded}
      backgroundColor={backgroundColor}
      button={
        <View style={styles.smallButton}>
          <DotsIcon />
        </View>
      }>
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={complain}>
          <MText bold>{t('complain')}</MText>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <TouchableOpacity style={styles.item} onPress={hide}>
          <MText bold>{t('hide_from_feed')}</MText>
        </TouchableOpacity>
      </View>
    </MExpandButton>
  )
}

const styles = StyleSheet.create({
  deleteModalButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  deleteModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: normalize(5),
    marginTop: normalize(5),
    flexDirection: 'row',
    zIndex: 1,
  },
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 28,
  },
  divider: {
    marginVertical: 5,
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
})
