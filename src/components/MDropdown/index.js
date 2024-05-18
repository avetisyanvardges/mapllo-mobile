import React, {useState} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import MText from '../MText'
import ArrowBottomIcon from '../../icons/ArrowBottomIcon'
import {Divider} from '@rneui/base'

export default function MDropdown({values, val, setVal}) {
  const [show, setShow] = useState(false)

  return (
    <TouchableOpacity
      style={[
        styles.input,
        show ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0} : {},
      ]}
      onPress={() => setShow(s => !s)}>
      <MText bold style={styles.inputText}>
        {val.text}
      </MText>
      <ArrowBottomIcon />
      {show && (
        <View style={styles.overlay}>
          {values
            .filter(v => v.val !== val.val)
            .map((item, index) => (
              <View
                key={item.val}
                style={[
                  styles.suggestionWrapper,
                  index === values.length - 2
                    ? {borderBottomLeftRadius: 10, borderBottomRightRadius: 10}
                    : {},
                ]}>
                {index === 0 && <Divider />}
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => setVal(item)}>
                  <MText>{item.text}</MText>
                </TouchableOpacity>
                <Divider />
              </View>
            ))}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  suggestionWrapper: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  suggestion: {
    height: 40,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
  },
  input: {
    backgroundColor: '#F3F3F3',
    width: '100%',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  inputText: {
    color: '#818195',
  },
})
