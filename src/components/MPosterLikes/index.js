import {useNavigation} from '@react-navigation/native'
import {Divider} from '@rneui/base'
import {Dialog} from '@rneui/themed'
import * as React from 'react'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import SwipeableFlatList from 'react-native-swipeable-list'
import {useSelector} from 'react-redux'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import {unlikePoster} from '../../configs/api'
import DeletedAva from '../../icons/DeletedAva'
import PersonIcon from '../../icons/PersonIcon'
import TrashIcon from '../../icons/TrashIcon'
import ChatListItem from '../../screens/Chat/chatListItem'
import MText from '../MText'

export default function MPosterLikes({unlikeAction, likes, width = 230}) {
  const [modalVisible, setModalVisible] = useState(false)
  const profileId = useSelector(state => state.auth.id)
  const nav = useNavigation()
  const {t} = useTranslation()

  const renderItem = ({item, index}) => {
    return (
      <View
        key={item.id}
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
              nav.push('ProfileView', {id: item.userId})
            }}>
            {item.avatarUrl ? (
              <FastImage
                source={{uri: item.avatarUrl}}
                style={{width: 50, height: 50, borderRadius: 15}}
                resizeMode="cover"
              />
            ) : (
              <DeletedAva size={50} style={{borderRadius: 15}} />
            )}
          </TouchableOpacity>
          <View style={{marginLeft: 10}}>
            <MText bold>{item.username}</MText>
          </View>
        </View>
        <TouchableOpacity
          onPress={unlikeAction}
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
    )
  }

  const renderQuickActions = ({item}) => {
    if (profileId === item?.userId) {
      return <View />
    }
  }

  return (
    <View>
      <Dialog
        overlayStyle={{
          borderRadius: 20,
          padding: 10,
          width,
          height: 500,
          marginBottom: deviceInfo?.small_screen
            ? normalize(68)
            : normalize(82),
        }}
        visible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <PersonIcon />
          <MText style={{marginLeft: 10, color: '#818195'}}>
            {t('human', {
              amount: likes.length,
              count: likes.length,
            })}
          </MText>
        </View>
        <Divider style={{marginTop: 10}} />
        <SwipeableFlatList
          keyExtractor={item => item.id}
          data={likes}
          renderItem={renderItem}
          renderQuickActions={renderQuickActions}
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          preventSwipeRight
          maxSwipeDistance={90}
        />
      </Dialog>
      <TouchableOpacity
        style={{height: 30, minWidth: 15 + likes.slice(0, 5).length * 20}}
        onPress={() => setModalVisible(true)}>
        {likes.slice(0, 5).map((i, index) => {
          const shift = index * 20
          return (
            <View key={i.userId} style={{position: 'relative'}}>
              {i.avatarUrl ? (
                <FastImage
                  source={{uri: i.avatarUrl}}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 14,
                    position: 'absolute',
                    left: shift,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <DeletedAva
                  size={30}
                  style={{borderRadius: 14, position: 'absolute', left: shift}}
                />
              )}
            </View>
          )
        })}
        {likes.length > 5 && (
          <View style={styles.moreContainer}>
            <MText bold style={styles.more}>
              {t('allDots')}
            </MText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  more: {
    color: '#fff',
  },
  moreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 120,
  },
})
