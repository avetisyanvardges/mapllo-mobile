import {FlatList, Modal, StatusBar, StyleSheet, TouchableOpacity, View,} from 'react-native'
import FastImage from 'react-native-fast-image'
import MText from '../MText'
import {useTranslation} from 'react-i18next'
import * as React from 'react'
import {useState} from 'react'
import {Dialog} from '@rneui/themed'
import PersonIcon from '../../icons/PersonIcon'
import {Divider} from '@rneui/base'
import {useSelector} from 'react-redux'
import SwipeableFlatList from 'react-native-swipeable-list'
import TrashIcon from '../../icons/TrashIcon'
import {acceptEventApplication, expellEvent, rejectEventApplication,} from '../../configs/api'
import {useNavigation} from '@react-navigation/native'
import DeletedAva from '../../icons/DeletedAva'

export default function MParticipants({
  event,
  applications,
  participants,
  removeUser,
  acceptUser,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const profileId = useSelector(state => state.auth.id)
  const nav = useNavigation()

  const expell = userId => {
    expellEvent(event.id, userId).then(r => {
      if (r.status === 200) {
        removeUser(userId)
      }
    })
  }
  const reject = userId => {
    rejectEventApplication(event.id, userId).then(r => {
      if (r.status === 200) {
        removeUser(userId)
      }
    })
  }
  const accept = user => {
    acceptEventApplication(event.id, user.id).then(r => {
      if (r.status === 200) {
        removeUser(user.id)
        acceptUser({...user, status: 'ACCEPTED'})
      }
    })
  }

  const {t} = useTranslation()

  const renderItem = ({item, index}) => {
    const application = item.status === 'APPLICATION'
    return (
      <>
        <View
          key={item.username}
          onStartShouldSetResponder={() => true}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false)
                nav.push('ProfileView', {id: item.id})
              }}>
              {item.avatarUrl ? (
                <FastImage
                  source={{uri: item.avatarUrl}}
                  style={{width: 50, height: 50, borderRadius: 15}}
                  resizeMode={'cover'}
                />
              ) : (
                <DeletedAva style={{width: 50, height: 50}} />
              )}
            </TouchableOpacity>
            <View style={{marginLeft: 10}}>
              <MText>{item.username}</MText>
            </View>
          </View>
          {profileId === item.id ? (
            <></>
          ) : application ? (
            <TouchableOpacity
              onPress={() => accept(item)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 15,
                backgroundColor: '#A347FF',
                borderRadius: 10,
              }}>
              <MText boldbold style={{color: '#fff'}}>
                {t('accept_application')}
              </MText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                nav.push('ChatView', {id: item.id})
                setModalVisible(false)
              }}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 15,
                backgroundColor: '#A347FF',
                borderRadius: 10,
              }}>
              <MText boldbold style={{color: '#fff'}}>
                {t('send_message')}
              </MText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => (application ? reject(item.id) : expell(item.id))}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: -410,
              width: 400,
              paddingLeft: 25,
              backgroundColor: '#F3267D',
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TrashIcon size={30} />
          </TouchableOpacity>
        </View>
        {index === applications.length - 1 && participants.length > 0 && (
          <Divider />
        )}
      </>
    )
  }
  const renderQuickActions = ({item}) => {
    return <View style={{}}></View>
  }

  const list = () => {
    if (event.ownerId === profileId) {
      return (
        <SwipeableFlatList
          data={[...applications, ...participants]}
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 400}}
          preventSwipeRight={true}
          keyExtractor={item => item.username}
          maxSwipeDistance={90}
          renderQuickActions={renderQuickActions}
          renderItem={renderItem}
        />
      )
    } else {
      return (
        <FlatList
          data={[...applications, ...participants]}
          showsVerticalScrollIndicator={false}
          style={{maxHeight: 400}}
          renderItem={renderItem}
        />
      )
    }
  }

  const shortParticipants = participants.slice(0, 6)

  const pWidth =
    30 +
    (shortParticipants.length > 0 ? (shortParticipants.length - 1) * 15 : 0)
  const hasApplications = applications.length > 0
  return (
    <>
      <Dialog
        overlayStyle={{borderRadius: 20, padding: 10}}
        visible={modalVisible}
        onBackdropPress={() => setModalVisible(false)} >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <PersonIcon />
          <MText style={{marginLeft: 10, color: '#818195'}}>
            {t(participants.length > 0 ? 'participants' : 'no_participants', {
              amount: participants.length,
              count: participants.length,
            })}
          </MText>
        </View>
        {participants.length > 0 ||
          (applications.length > 0 && <Divider style={{marginVertical: 10}} />)}
        {list()}
      </Dialog>
      <TouchableOpacity
        style={{height: 30}}
        onPress={() => setModalVisible(true)}>
        {shortParticipants.length === 0 &&
        event.ownerId === profileId &&
        !hasApplications ? (
          <PersonIcon />
        ) : (
          <View
            style={{
              position: 'relative',
              height: shortParticipants.length > 0 ? 30 : 0,
              width: pWidth,
              alignItems: 'center',
            }}>
            {hasApplications && (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  position: 'absolute',
                  backgroundColor: '#A347FF',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <MText
                  style={{color: '#fff', fontSize: 16, textAlign: 'center'}}>
                  {applications.length}
                  {applications.length > 6 ? '+' : ''}
                </MText>
              </View>
            )}
            {shortParticipants.map((i, index) => {
              const realIndex = hasApplications ? index + 1 : index
              var shift = realIndex * 20
              return i.avatarUrl ? (
                <FastImage
                  key={i.id}
                  source={{uri: i.avatarUrl}}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    position: 'absolute',
                    left: shift,
                  }}
                  resizeMode={'cover'}
                />
              ) : (
                <DeletedAva
                  size={30}
                  style={{borderRadius: 15, position: 'absolute', left: shift}}
                />
              )
            })}
          </View>
        )}
        {participants.length > 6 && (
          <View style={[styles.moreContainer, {left: 140}]}>
            <MText bold style={styles.more}>
              {t('more')}
            </MText>
          </View>
        )}
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  modal: {},
  modalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
  },
  more: {
    color: '#fff',
  },
})
