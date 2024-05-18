import {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native'

import MText from '../MText'

export default function MSwitch({feedType, setFeedType}) {
  const mountType = feedType === 'people' ? 90 : feedType === 'events' ? 0 : 0
  const off = useRef(new Animated.Value(mountType)).current
  const {t} = useTranslation()

  const update = (val, type) => {
    Animated.spring(off, {
      toValue: val,
      duration: 200,
      useNativeDriver: true,
    }).start()
    setFeedType(type)
  }

  return (
      <View style={styles.feedSwitch}>
        <View
            style={{position: 'absolute', zIndex: 10, top: 0}}
            pointerEvents="box-none">
          <Animated.View
              style={[
                styles.feedSwitchActive,
                {transform: [{translateX: off}]},
                {
                  borderTopLeftRadius: off.interpolate({
                    inputRange: [0, 80],
                    outputRange: [8, 0],
                  }),
                  borderBottomLeftRadius: off.interpolate({
                    inputRange: [0, 80],
                    outputRange: [8, 0],
                  }),
                  borderTopRightRadius: off.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, 8],
                  }),
                  borderBottomRightRadius: off.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, 8],
                  }),
                },
              ]}>
            <MText style={styles.feedSwitchItemTextActive}>{t(feedType)}</MText>
          </Animated.View>
        </View>
        <View style={styles.feedSwitchElementsContainer}>
          <View style={styles.feedSwitchElements}>
            <TouchableOpacity onPress={() => update(0, 'events')}>
              <View style={styles.feedSwitchItem}>
                {feedType === 'people' && (
                    <MText style={styles.feedSwitchItemText}>{t('events')}</MText>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => update(80, 'people')}>
              <View style={styles.feedSwitchItem}>
                {feedType === 'events' && (
                    <MText style={styles.feedSwitchItemText}>{t('people')}</MText>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  feedSwitchContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  feedSwitch: {
    // margin: 20,
    top: 2,
  },
  feedSwitchActive: {
    backgroundColor: '#fff',
    width: 82,
  },
  feedSwitchElementsContainer: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(16, 16, 34, 0.4)',
    borderRadius: 8,
    width: 160,
  },
  feedSwitchElements: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedSwitchItem: {
    paddingVertical: 4,
    paddingLeft: 14,
    paddingRight: 15,
  },
  feedSwitchItemText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  feedSwitchItemTextActive: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#818195',
    textAlign: 'center',
    fontSize: 15,
  },
})
