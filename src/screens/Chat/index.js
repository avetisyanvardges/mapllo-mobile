import {Button, StatusBar, StyleSheet, View} from 'react-native'
import * as React from 'react'
import {useState} from 'react'
import ChatList from './chatList'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

export default function Chats({}) {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.cont}>
      <View style={[styles.container, {marginTop: insets.top}]}>
        {/*<SearchBar setChatResults={setSearchChatResults} setMessageResults={setSearchChatMessageResults}/>*/}
        <ChatList />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  container: {
    marginHorizontal: 20,
    flex: 1,
  },
})
