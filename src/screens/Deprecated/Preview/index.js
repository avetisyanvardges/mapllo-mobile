import {Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View,} from 'react-native'
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon'
import * as React from 'react'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import * as Haptics from 'expo-haptics'
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated';
// import {Gesture} from "react-native-gesture-handler";
// import {GestureDetector} from "react-native-gesture-handler/src/handlers/gestures/GestureDetector";
import {manipulateAsync} from 'expo-image-manipulator'
import MText from '../../../components/MText'

// const AnimatedImage = Animated.createAnimatedComponent(Image);
// const AnimatedView = Animated.createAnimatedComponent(View);

export default function Preview({route}) {
  const uri = route.params?.img?.uri
  const width = route.params?.img?.width
  const height = route.params?.img?.height
  const nav = useNavigation()
  const {t} = useTranslation()
  // const start = useSharedValue({x: 0, y: 0})
  // const translate = useSharedValue({x: 0, y: 0})
  // const scale = useSharedValue(1)
  // const savedScale = useSharedValue(1)

  const ratio = height / 500
  const adaptedHeight = height / ratio
  const adaptedWidth = width / ratio

  const imageSize = StyleSheet.create({
    width: adaptedWidth,
    height: adaptedHeight,
  })

  // const previewAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {translateX: translate.value.x},
  //       {translateY: translate.value.y},
  //     ],
  //   };
  // });
  // const previewInnerFrameAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {scale: scale.value}
  //     ],
  //   };
  // });

  // const dragGesture = Gesture.Pan()
  // .onUpdate((e) => {
  //   const newX = e.translationX / scale.value + start.value.x
  //   const newY = e.translationY / scale.value + start.value.y
  //   const yOffset = (adaptedHeight / 2 * (scale.value - 1)) / scale.value
  //   const xOffset = ((adaptedWidth / 2 * (scale.value)) - 116) / scale.value
  //   const finalY = (newY + yOffset > 0 && newY - yOffset < 0) ? newY : translate.value.y
  //   const finalX = (newX + xOffset > 0 && newX - xOffset < 0) ? newX : translate.value.x
  //   translate.value = {
  //     x: finalX,
  //     y: finalY
  //   };
  // })
  // .onEnd(() => {
  //   start.value = {
  //     x: translate.value.x,
  //     y: translate.value.y,
  //   };
  // });

  // const pinchGesture = Gesture.Pinch()
  // .onUpdate((e) => {
  //   const newScale = e.scale * savedScale.value
  //   const newX = translate.value.x * newScale
  //   const newY = translate.value.y * newScale
  //   const yOffset = (250 * (newScale - 1))
  //   const xOffset = (188 * (newScale)) - 116
  //   if (newY > 0 && yOffset < newY && newScale >= 1) {
  //     translate.value = {
  //       x: translate.value.x,
  //       y: translate.value.y - newY + yOffset
  //     };
  //   }
  //   if (newY < 0 && yOffset < newY * -1 && newScale >= 1) {
  //     translate.value = {
  //       x: translate.value.x,
  //       y: translate.value.y - yOffset + newY * -1
  //     };
  //   }
  //   if (newX > 0 && xOffset < newX && newScale >= 1) {
  //     translate.value = {
  //       x: translate.value.x - newX + xOffset,
  //       y: translate.value.y
  //     };
  //   }
  //   if (newX < 0 && xOffset < newX * -1 && newScale >= 1) {
  //     translate.value = {
  //       x: translate.value.x - xOffset + newX * -1,
  //       y: translate.value.y
  //     };
  //   }
  //   if (newScale < 4 && newScale >= 1) {
  //     scale.value = newScale
  //   }
  // })
  // .onEnd(() => {
  //   savedScale.value = scale.value;
  // });

  // const composed = Gesture.Simultaneous(dragGesture, pinchGesture)

  const next = async () => {
    await Haptics.selectionAsync()
    const newImage = await manipulateAsync(uri, [
      {
        crop: {
          originX:
            width / 2 - (116 * ratio) / scale.value - translate.value.x * ratio,
          originY:
            (height - height / scale.value) / 2 - translate.value.y * ratio,
          height: height / scale.value,
          width: (231 * ratio) / scale.value, // / scale.value
        },
      },
    ])
    nav.navigate('Register', {croppedPhoto: newImage, photo: route.params.img})
  }

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => nav.goBack()}
        style={styles.backArrowContainer}>
        <ArrowLeftIcon />
      </TouchableOpacity>
      <SafeAreaView style={{justifyContent: 'space-between', flex: 1}}>
        <View style={styles.container}>
          <View style={styles.hintContainer}>
            <MText style={styles.hint}>
              {t('UnauthorizedStack.Preview.hint')}
            </MText>
          </View>
          <View style={styles.previewFrame}>
            {/*<GestureDetector gesture={composed}>*/}
            {/*<AnimatedView style={[styles.previewInnerFrame, previewInnerFrameAnimatedStyle]}>*/}
            {/*  <AnimatedImage source={{uri: uri}} style={[styles.preview, previewAnimatedStyle, imageSize]}/>*/}
            {/*</AnimatedView>*/}
            {/*</GestureDetector>*/}
          </View>
          <View style={styles.smallPreviewFrame}>
            <Image source={{uri: uri}} style={styles.smallPreview} />
          </View>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={() => next()}>
          <MText style={styles.nextButtonText}>
            {t('UnauthorizedStack.Register.next')}
          </MText>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  nextButton: {
    height: 38,
    marginBottom: 10,
    backgroundColor: '#A347FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  nextButtonText: {
    color: '#fff',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFrame: {
    height: 500,
    width: 231,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewInnerFrame: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  preview: {
    position: 'absolute',
    zIndex: -1,
  },
  smallPreviewFrame: {
    position: 'absolute',
    bottom: -39,
    right: 39,
    height: 77,
    width: 77,
    borderRadius: 18,
    overflow: 'hidden',
  },
  smallPreview: {
    position: 'absolute',
    zIndex: -1,
    height: 77,
    width: 77,
  },
  hintContainer: {
    marginTop: 60,
    width: 132,
    marginBottom: 18,
  },
  hint: {
    textAlign: 'center',
  },
  backArrowContainer: {
    backgroundColor: 'rgb(94,110,144)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    top: 70,
    left: 20,
    width: 32,
    height: 32,
    zIndex: 1,
  },
})
