import {
    Animated,
    Dimensions,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import * as Haptics from 'expo-haptics'
import {logout} from '../../slices/authReducer'
import {useDispatch, useSelector} from 'react-redux'
import Profile from '../Profile'
import FastImage from 'react-native-fast-image'
import Map from '../Map'
import CompasSimpleIcon from '../../icons/CompasSimpleIcon'
import CreateEventIcon from '../../icons/CreateEventIcon'
import Feed from '../Feed'
import FeedIcon from '../../icons/FeedIcon'
import MessageIcon from '../../icons/MessageIcon'
import Chats from '../Chat'
import Socket from '../../configs/socket'
import {getChats} from '../../configs/api'
import {useNavigation} from '@react-navigation/native'
import CreateDating from '../CreateDating'
import CreateEvent from '../CreateEvent'
import {useSafeAreaInsets,} from 'react-native-safe-area-context'
import MapEfficient from '../Map/mapEfficient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {deviceInfo} from "../../assets/deviceInfo";

const Tab = createBottomTabNavigator()


const sharedRoutes = {
  events: 'EventView',
  users: 'ProfileView',
  posters: 'PosterView',
}

export default function Menu() {
  const nav = useNavigation()


  useEffect(() => {
    Socket.nav = nav
  }, [])

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        doIfLinked(url)
      }
    })
    Linking.addEventListener('url', event => {
      if (event?.url) {
        doIfLinked(event.url)
      }
    })
  }, [])

  const doIfLinked = url => {
    if(deviceInfo.ios) {
      const [prefix] = url?.split(':');
      let regexpUrl;
      if (prefix === 'https') {
        regexpUrl = `https://mapllo.com/`;
      } else {
        regexpUrl = 'mapllo://';
      }
      const [screen, id] = url?.replace(regexpUrl, '')?.split('/');
      nav.push(sharedRoutes[screen], {id})
    }else {
      const query = url.split('?')[1]
      const paramsRaw = query.split('&')
      const params = paramsRaw.map(p => p.split('='))
      const paramsTyped = params.reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})
      const path = url.substring(18).split('?')[0]
      if (path === 'Menu') {
        nav.push(paramsTyped.screen, {id: paramsTyped.id})
      }
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
      }}>
      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        screenOptions={{tabBarShowLabel: false, headerShown: false}}
        sceneContainerStyle={{backgroundColor: '#fff'}}>
        <Tab.Screen name="Map" component={MapEfficient} />
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="CreateEvent" component={CreateEventStub} />
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Profile" component={Profile} />
        {/* <Tab.Screen name='Create_Event' component={CreateEvent} /> */}
        <Tab.Screen name="Create_Dating" component={CreateDating} />
      </Tab.Navigator>
    </View>
  )
}

export function MyTabBar(props) {
  const state = props.state
  const descriptors = props.descriptors
  const navigation = props.navigation
  const insets = useSafeAreaInsets()

  let isAbs = false
  return (
    <SafeAreaView style={{backgroundColor: isAbs ? 'rgba(0,0,0,0.5)' : '#fff'}}>
      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key]
          const isFocused = state.index === index
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name
          // if (label === 'CreateEvent') {
          //   return <CreateEventButton isAbs={isAbs} isFocused={state.index === 5} options={options} navigation={navigation} key={index}/>
          // }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true})
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          const badge = active => {
            switch (label) {
              case 'Profile': {
                return <ProfileBadge active={active} isAbs={isAbs} />
              }
              case 'Map': {
                return <MapBadge active={active} isAbs={isAbs} />
              }
              case 'Feed': {
                return <FeedBadge active={active} isAbs={isAbs} />
              }
              case 'Chats': {
                return <ChatBadge active={active} isAbs={isAbs} />
              }
              case 'CreateEvent': {
                return (
                  <CreateEventButton
                    isFocused={state.index === 5}
                    options={options}
                    navigation={navigation}
                    key={index}
                  />
                )
                // return <CreateEventBadge active={active} isAbs={isAbs}/>
              }
              default: {
                return null
              }
            }
          }
          const b = badge(isFocused)
          if (!b) {
            return null
          }

          return (
            <View style={[styles.tabItem, {paddingTop: 17, paddingBottom: !insets.bottom ? 17 : 0}]} key={index}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}>
                {b}
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const CreateEventButton = ({isAbs, isFocused, options, navigation}) => {
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false)
  const scaleAnim = useRef(new Animated.Value(0)).current

  const onCreateEventPress = () => {
    setShowCreateEventPopup(e => !e)
  }
  useEffect(() => {
    if (showCreateEventPopup) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showCreateEventPopup])

  return (
    <View style={styles.avatarBox}>
      {/* <Animated.View style={[styles.createEventBox, {transform: [{scale: scaleAnim},
          {translateY: scaleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -130]
            })}]}]}>
        <TouchableOpacity style={styles.createEventCircle} onPress={() => {
          setShowCreateEventPopup(false)
          navigation.navigate('Create_Event')
        }}>
          <PeopleIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createDatingCircle} onPress={() => {
          setShowCreateEventPopup(false)
          navigation.navigate('Create_Dating')
        }}>
          <HeartIcon/>
        </TouchableOpacity>
      </Animated.View>
      {showCreateEventPopup && (
        <TouchableOpacity
          onPress={onCreateEventPress}
          style={styles.createEventBoxOverlay}>
        </TouchableOpacity>
      )} */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={isFocused ? {selected: true} : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={() => navigation.navigate('Create_Event')}>
        <CreateEventIcon active={isFocused} isAbs={isAbs} />
      </TouchableOpacity>
    </View>
  )
}

const Lg = () => {
  const dispatch = useDispatch()

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          Haptics.selectionAsync()
            .then(() => AsyncStorage.removeItem('token'))
            .then(() => dispatch(logout()))
        }}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
const ChatBadge = ({isAbs, active}) => {
  const chats = useSelector(state => state.chats.chats)
  const profileId = useSelector(state => state.auth.id)

  const hasMessages = chats && Object.values(chats).some(c => c.messages.some(m => !m.chatMessage.viewed && m.chatMessage.sender !== profileId))

  return (
    <View style={styles.avatarBox}>
      <MessageIcon active={active} isAbs={isAbs} />
      {hasMessages && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: -2,
            borderRadius: 10,
            width: 10,
            height: 10,
            backgroundColor: '#F3267D',
          }}></View>
      )}
    </View>
  )
}

const FeedBadge = ({isAbs, active}) => {
  return (
    <View style={styles.avatarBox}>
      <FeedIcon active={active} isAbs={isAbs} />
    </View>
  )
}

const MapBadge = ({isAbs, active}) => {
  return (
    <View style={styles.avatarBox}>
      <CompasSimpleIcon
        active={active}
        size={32}
        transparent={isAbs}
        inverted={!isAbs}
      />
    </View>
  )
}

const ProfileBadge = ({active}) => {
  const photos = useSelector(state => state.auth.photos)
  const st = [styles.avatarStyle]
  if (active) {
    st.push(styles.avatarActive)
  }
  return (
    <View style={styles.avatarBox}>
      <FastImage
        style={st}
        source={{uri: photos[0]?.uri}}
        resizeMode={'cover'}
      />
    </View>
  )
}

const CreateEventStub = () => {
  return <View></View>
}
const styles = StyleSheet.create({
  avatarBox: {},
  avatarActive: {
    borderWidth: 2,
    borderColor: '#A347FF',
  },
  avatarStyle: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  createEventBoxOverlay: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    bottom: 0,
    position: 'absolute',
    zIndex: -1,
  },
  createEventBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
  },
  createEventCircle: {
    backgroundColor: '#A347FF',
    borderRadius: 50,
    shadowOpacity: 1,
    shadowColor: '#A347FF',
    shadowRadius: 10,
  },
  createDatingCircle: {
    backgroundColor: '#F3267D',
    padding: 19,
    borderRadius: 50,
    shadowOpacity: 1,
    shadowColor: '#F3267D',
    shadowRadius: 10,
  },
})
