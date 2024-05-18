import {Animated, Pressable, StyleSheet, TouchableOpacity} from 'react-native'
import {useEffect, useRef} from 'react'

export default function MExpandButton({
  children,
  button,
  height,
  smallWidth,
  width,
  expanded,
  setExpanded,
  backgroundColor,
}) {
  const exp = useRef(new Animated.Value(0)).current
  const opac = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (expanded) {
      Animated.spring(exp, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start()
      Animated.spring(opac, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(exp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start()
      Animated.spring(opac, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [expanded])

  const expand = () => {
    const value = !expanded
    if (value === true) {
      setExpanded(value)
    }
  }

  const but = (
    <TouchableOpacity onPress={() => expand()} disabled={expanded}>
      <Animated.View
        style={[
          styles.background,
          {
            height: exp.interpolate({
              inputRange: [0, 1],
              outputRange: [smallWidth, height],
            }),
            width: exp.interpolate({
              inputRange: [0, 1],
              outputRange: [smallWidth, width],
            }),
            backgroundColor: exp.interpolate({
              inputRange: [0, 1],
              outputRange: [backgroundColor, 'rgba(255,255,255,1)'],
            }),
          },
          {borderRadius: expanded ? 10 : 20},
        ]}>
        <Animated.View
          style={{
            opacity: exp.interpolate({inputRange: [0, 1], outputRange: [1, 0]}),
          }}>
          {!expanded && button}
        </Animated.View>
        <Animated.View style={{opacity: opac}}>
          {expanded && children}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
  return <>
    {but}
    {expanded && (<Pressable onPress={() => setExpanded(false)} style={{zIndex: -1,  position: 'absolute', left: -9999, right: -9999, top: -9999, bottom: -9999}}/>)}
  </>
}
const styles = StyleSheet.create({
  background: {},
})
