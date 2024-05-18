import * as React from 'react'
import {useEffect, useRef} from 'react'
import {FlatList, StyleSheet, View} from 'react-native'

import Dots from './components/dot'
import {normalize} from '../../assets/normalize'

export default function MProgressBar({maxStep, stepNumber, style, dotted}) {
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      if (stepNumber > 0 && stepNumber < maxStep - 1 && maxStep > 3) {
        listRef?.current?.scrollToIndex({animated: true, index: stepNumber - 1})
      }
    }
  }, [stepNumber])
  return (
    <View style={[styles.stepContainer, style]}>
      {dotted ? (
        <View
          style={{
            width: normalize(50),
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'hidden',
            marginRight: normalize(10),
          }}>
          <FlatList
            ref={listRef}
            horizontal
            data={Array.from(Array(maxStep).keys())}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={60}
            renderItem={({item}) => {
              const focused = stepNumber === item
              return <Dots item={item} focused={focused} />
            }}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500))
              wait.then(() => {
                listRef?.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                })
              })
            }}
          />
        </View>
      ) : (
        <>
          {Array.from(Array(maxStep).keys()).map((k, i) => {
            const isCorner = i === 0 || i === maxStep - 1
            const classes = [styles.step]
            if (!isCorner) classes.push(styles.stepMargin)
            if (i === 0 && maxStep === 2) {
              classes.push(styles.firstItemMargin)
            }
            if (stepNumber === i) classes.push(styles.stepActive)
            return <View key={k} style={classes} />
          })}
        </>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  step: {
    flex: 1,
    height: 5,
    backgroundColor: '#5C6E90',
    borderRadius: 3,
  },
  stepMargin: {
    marginHorizontal: 10,
  },
  firstItemMargin: {
    marginRight: 20,
  },
  stepActive: {
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
