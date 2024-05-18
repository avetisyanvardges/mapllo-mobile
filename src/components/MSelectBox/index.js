import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import MText from '../MText'

export default function MSelectBox({text, active, switchActive, style}) {
  const containerStyles = [styles.container]
  const textStyles = [styles.text]
  if (active) {
    containerStyles.push(styles.containerActive)
    textStyles.push(styles.textActive)
  } else {
    containerStyles.push(styles.containerInactive)
  }
  return (
    <TouchableOpacity style={[containerStyles, style]} onPress={switchActive}>
      <MText style={textStyles}>{text}</MText>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInactive: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
  },
  containerActive: {
    backgroundColor: '#A347FF',
    borderWidth: 1,
    borderColor: '#A347FF',
  },
  text: {
    color: 'black',
    fontSize: 12,
  },
  textActive: {
    color: 'white',
  },
})
