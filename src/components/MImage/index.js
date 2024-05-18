import LottieView from 'lottie-react-native'
import {useState} from 'react'
import * as React from 'react'
import {View} from 'react-native'
import FastImage from 'react-native-fast-image'

import StarIcon from '../../icons/StarIcon'

const images = {
  m: require('../../../assets/lottie/M.json'),
  ava: require('../../../assets/lottie/ava.json'),
  frame_1_m: require('../../../assets/lottie/frame_1_M.json'),
  frame_1: require('../../../assets/lottie/frame_1.json'),
  frame_2_m: require('../../../assets/lottie/frame_2_M.json'),
  frame_2: require('../../../assets/lottie/frame_2.json'),
  m_emoj: require('../../../assets/lottie/M_Emoj.json'),
}

export default function MImage({
  source,
  style,
  resizeMode,
  img,
  small = false,
  onLoad,
}) {
  const [loading, setLoading] = useState(true)

  const anim = (
    <LottieView
      style={{flex: 1, backgroundColor: '#D7D7D7'}}
      source={images[img]}
      autoPlay
      loop
    />
  )

  return (
    <FastImage
      onLoadEnd={() => setLoading(false)}
      onLoad={onLoad}
      source={source}
      style={style}
      resizeMode={resizeMode}>
      {loading &&
        (small ? (
          <View
            style={{
              flex: 1,
              backgroundColor: '#D7D7D7',
              paddingHorizontal: 120,
            }}>
            {anim}
          </View>
        ) : (
          anim
        ))}
    </FastImage>
  )
}
