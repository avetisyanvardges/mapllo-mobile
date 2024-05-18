import LottieView from 'lottie-react-native'
import * as React from 'react'
import {useState} from 'react'
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import EventListFeed from './eventsListFeed'
import UserListFeed from './usersListFeed'
import {deviceInfo} from '../../assets/deviceInfo'
import MSwitch from '../../components/MSwitch'

export default function Feed({route}) {
  const insets = useSafeAreaInsets()
  const [feedType, setFeedType] = useState('events')
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  const feed = () => {
    let res
    if (feedType === 'events') {
      res = (
        <EventListFeed
          route={route}
          menuExpanded={menuExpanded}
          setMenuExpanded={setMenuExpanded}
          filterExpanded={filterExpanded}
          setFilterExpanded={setFilterExpanded}
          onLoad={() => setLoading(false)}
        />
      )
    } else if (feedType === 'people') {
      res = <UserListFeed onLoad={() => setLoading(false)} />
    }
    return (
      <>
        {res}
        {loading ? (
          feedType === 'people' ? (
            <LottieView
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'rgb(215,215,215)',
              }}
              source={require('../../../assets/lottie/frame_1_M.json')}
              autoPlay
              loop
            />
          ) : (
            <LottieView
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'rgb(215,215,215)',
              }}
              source={require('../../../assets/lottie/frame_2_M.json')}
              autoPlay
              loop
            />
          )
        ) : null}
      </>
    )
  }

  const isEvents = feedType === 'events'
  return (
    <View style={{flex: 1}}>
      {!menuExpanded && !filterExpanded && (
        <View
          style={[
            styles.feedSwitchContainer,
            {top: insets.top + 18, left: 22},
          ]}>
          <SafeAreaView>
            <MSwitch
              feedType={feedType}
              setFeedType={t => {
                setLoading(true)
                setFeedType(t)
              }}
            />
          </SafeAreaView>
        </View>
      )}
      {feed()}
      {/* <View style={{flex: 1, position: 'absolute', zIndex: isEvents ? 1 : -1, width: '100%', height: '100%'}}>
        <EventListFeed route={route} menuExpanded={menuExpanded} setMenuExpanded={setMenuExpanded} filterExpanded={filterExpanded} setFilterExpanded={setFilterExpanded}/>
      </View>
      <View style={{flex: 1, position: 'absolute', zIndex: isEvents ? -1 : 1, width: '100%', height: '100%'}}>
        <UserListFeed/>
      </View>
      <View style={{flex: 1, position: 'absolute', zIndex: 0, width: '100%', height: '100%', backgroundColor: 'white'}}>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  feedSwitchContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  feedSwitch: {
    margin: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    width: 160,
  },
  feedSwitchActive: {
    borderRadius: 15,
    backgroundColor: '#fff',
    height: 34,
    width: 80,
  },
  feedSwitchElements: {
    position: 'absolute',
    top: 0,
    paddingHorizontal: 10,
    borderRadius: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 160,
  },
  feedSwitchItemText: {
    color: '#fff',
    textAlign: 'center',
  },
  feedSwitchItemTextActive: {
    color: '#818195',
    textAlign: 'center',
  },
})
