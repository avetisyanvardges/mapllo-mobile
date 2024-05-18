import {Animated} from 'react-native'
import MaplloIcon from '../../icons/MaplloIcon'
import {useEffect, useRef} from 'react'

export default function MLoader({size = 40, style, color = '#A347FF'}) {
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              rotateY: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        },
        style,
      ]}>
      <MaplloIcon size={size} color={color} />
    </Animated.View>
  )
}
