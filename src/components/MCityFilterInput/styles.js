import React from 'react'
import {StyleSheet} from 'react-native'

import {normalize} from '../../assets/normalize'

const Styles = () => {
  return StyleSheet.create({
    suggestionContainer: {
      position: 'absolute',
      backgroundColor: '#f3f3f3',
      borderColor: '#f3f3f3',
      justifyContent: 'flex-end',
      width: '100%',
      borderRadius: 10,
    },
    suggestionCurrentItem: {
      backgroundColor: '#F3F3F3',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderColor: '#ccc',
      borderRadius: 10,
    },
    suggestionItem: {
      backgroundColor: '#f3f3f3',
      paddingVertical: 10,
      marginHorizontal: 5,
    },
    suggestionItemDivider: {
      borderColor: '#e3e3e3',
      borderTopWidth: 1,
    },
    inputContainer: {
      backgroundColor: '#f3f3f3',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    inputContainerBordered: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    error: {
      color: 'red',
      paddingHorizontal: 8,
    },
    info: {
      color: 'green',
      paddingHorizontal: 8,
    },
    placeholder: {
      color: '#818195',
    },
    textInput: {
      flex: 1,
      fontWeight: '300',
    },
  })
}

export {Styles}
