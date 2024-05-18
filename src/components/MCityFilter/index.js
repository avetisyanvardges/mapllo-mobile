import React from 'react'
import {Modal, View} from 'react-native'

import {normalize} from '../../assets/normalize'
import MCityFilterInput from '../MCityFilterInput'

const MCityFilter = () => {
  return (
    <Modal transparent animationType="fade" visible style={{zIndex: 999}}>
      <View style={{marginTop: 18, marginHorizontal: normalize(20)}}>
        <MCityFilterInput
          style={{width: '100%'}}
          value={city}
          setValue={setCity}
          placeId={placeId}
          setPlaceId={setPlaceId}
          filters
          setFocused={setCityFilterFocused}
          focused={cityFilterFocused}
          setExpanded={setExpanded}
        />
      </View>
    </Modal>
  )
}

export default MCityFilter
