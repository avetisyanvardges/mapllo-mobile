import {View} from 'react-native'
import React, {useState} from 'react'
import {Slider} from '@miblanchard/react-native-slider'
import MText from '../MText'
import {useTranslation} from 'react-i18next'

export default function MSlider({left, right, setVal}) {
  const [value, setValue] = useState([left, right])
  const {t} = useTranslation()
  return (
    <View>
      {value[0] === 18 && value[1] === 70 && (
        <View style={{position: 'absolute', left: 0, right: 0, top: -10}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <MText bold>{t('any')}</MText>
          </View>
        </View>
      )}
      <Slider
        step={1}
        renderAboveThumbComponent={(q, w) => {
          if (value[0] === 18 && value[1] === 70) {
            return <></>
          }
          return <MText bold>{value[q]}</MText>
        }}
        minimumValue={18}
        maximumValue={70}
        value={value}
        onValueChange={setValue}
        onSlidingComplete={() => setVal(value)}
        maximumTrackTintColor="#71EEFB"
        minimumTrackTintColor="#A347FF"
        thumbTintColor="#A347FF"
      />
    </View>
  )
}
