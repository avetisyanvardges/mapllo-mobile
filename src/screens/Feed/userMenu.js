import * as React from 'react'
import {useState} from 'react'
import MExpandButton from '../../components/MExpandButton'
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native'
import MText from '../../components/MText'
import {Divider} from '@rneui/base'
import {useTranslation} from 'react-i18next'
import DotsIcon from '../../icons/DotsIcon'
import {complainTo, hideEntity} from '../../configs/api'
import {useSelector} from 'react-redux'
import PenIcon from '../../icons/PenIcon'

const backgroundColor = 'rgba(16, 16, 34, 0.4)'

export default function UserMenu({
  expanded,
  setExpanded,
  user,
  popupRef,
  hideElement,
}) {
  const {t} = useTranslation()
  const [hideModalVisible, setHideModalVisible] = useState(false)
  const profileId = useSelector(state => state.auth.id)

  const complain = () => {
    complainTo('USER', user.id).then(r => {
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
  const hide = () => {
    hideEntity('USER', user.id).then(r => {
      const status = r.status
      let message
      if (status === 200) {
        message = t('user_hidden')
        popupRef.current.add({text: message, type: 'normal'})
      }
      hideElement()
      setExpanded(false)
    })
  }
  if (profileId === user?.ownerId) {
    return (
      <TouchableOpacity
        style={[styles.smallButton, {backgroundColor: backgroundColor}]}>
        <PenIcon />
      </TouchableOpacity>
    )
  }

  return (
    <MExpandButton
      smallWidth={35}
      width={170}
      height={80}
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
        <TouchableOpacity
          style={styles.item}
          onPress={() => setHideModalVisible(true)}>
          <MText bold>{t('hide_from_feed')}</MText>
        </TouchableOpacity>
        {hideModalVisible && (
          <View style={styles.deleteModal}>
            <TouchableOpacity
              style={styles.deleteModalButton}
              onPress={() => {
                setHideModalVisible(false)
                setExpanded(false)
                hide()
              }}>
              <MText style={{color: '#818195'}}>{t('yes')}</MText>
            </TouchableOpacity>
            <Divider orientation={'vertical'} />
            <TouchableOpacity
              style={styles.deleteModalButton}
              onPress={() => {
                setHideModalVisible(false)
              }}>
              <MText style={{color: '#818195'}}>{t('no')}</MText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </MExpandButton>
  )
}

const styles = StyleSheet.create({
  deleteModalButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    height: 28,
  },
  deleteModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10000,
  },
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
})
