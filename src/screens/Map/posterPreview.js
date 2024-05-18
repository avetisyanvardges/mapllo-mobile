import {useIsFocused, useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Animated,
  Linking,
  Share,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import ReadMore from 'react-native-read-more-text'
import Video from 'react-native-video'
import ViewMoreText from 'react-native-view-more-text'
import {useSelector} from 'react-redux'

import MImage from '../../components/MImage'
import MPosterLikes from '../../components/MPosterLikes'
import MText from '../../components/MText'
import {addToFav, likePoster, unlikePoster} from '../../configs/api'
import {sharePosterUrl} from '../../configs/constants'
import InstagramIcon from '../../icons/InstagramIcon'
import TelegramIcon from '../../icons/TelegramIcon'
import WhatsAppIcon from '../../icons/WhatsAppIcon'

export default function PosterPreview({
  poster,
  updatePoster,
  popup,
  deselect = () => {},
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const profileId = useSelector(state => state.auth.id)
  const photos = useSelector(state => state.auth.photos)
  const name = useSelector(state => state.auth.name)
  const username = useSelector(state => state.auth.userName)

  const focused = useIsFocused()
  const [show, setShow] = useState(false)
  const [posterNested, setPosterNested] = useState(poster)
  const nav = useNavigation()
  const {t} = useTranslation()

  const wantToVisit = () => {
    likePoster(posterNested.id).then(r => {
      updatePoster({
        ...posterNested,
        liked: true,
        likes: [
          ...posterNested.likes,
          {
            userId: profileId,
            avatarUrl: photos[0]?.uri,
            name,
            username,
          },
        ],
      })
    })
  }

  useEffect(() => {
    if (poster) {
      setPosterNested(poster)
    }
  }, [poster])

  const unlikeAction = () => {
    unlikePoster(posterNested.id).then(() => {
      updatePoster({
        ...posterNested,
        liked: false,
        likes: posterNested.likes.filter(like => like.userId !== profileId),
      })
    })
  }

  useEffect(() => {
    if (posterNested && poster) {
      setShow(true)
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else if (show) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShow(false)
      })
    }
  }, [posterNested, poster])

  const _renderTruncatedFooter = handlePress => (
    <MText style={{color: '#fff', marginTop: 5}} onPress={handlePress}>
      {t('more')}
    </MText>
  )
  const _renderRevealedFooter = handlePress => (
    <MText style={{color: '#fff', marginTop: 5}} onPress={handlePress}>
      {t('Profile.about.hide')}
    </MText>
  )

  const dateStr = () => {
    const date = new Date(posterNested.date)
    const yyyy = date.getFullYear()
    let mm = date.getMonth() + 1 // Months start at 0!
    let dd = date.getDate()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    return dd + '.' + mm + '.' + yyyy
  }

  const share = () => {
    const url = sharePosterUrl + posterNested.id
    const message = t('what_i_found') + '\n' + url
    Share.share({message}, {dialogTitle: message, subject: message})
  }
  const toggleFav = () => {
    addToFav('POSTER', posterNested.id).then(r => {
      const isFav = r.data
      updatePoster({...posterNested, favourite: isFav})
      if (isFav) {
        popup.current.add({text: t('added_to_fav'), type: 'normal'})
      } else {
        popup.current.add({text: t('removed_from_fav'), type: 'normal'})
      }
    })
  }

  return (
    <TouchableWithoutFeedback onPress={() => poster && deselect()}>
      <View style={styles.container} pointerEvents={poster ? 'auto' : 'none'}>
        {show ? (
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.previewContainer,
                {transform: [{scale: scaleAnim}]},
              ]}>
              <View style={styles.posterContainer}>
                <MText style={styles.posterText}>{t('poster')}</MText>
              </View>
              <View style={styles.cont}>
                <View style={styles.imageCont}>
                  {posterNested.videoUrl ? (
                    <Video
                      volume={1}
                      repeat
                      paused={!focused}
                      poster={posterNested.avatarUrl}
                      automaticallyWaitsToMinimizeStalling
                      source={{uri: posterNested.videoUrl}}
                      style={styles.backgroundImage}
                      posterResizeMode="cover"
                      resizeMode="cover"
                    />
                  ) : (
                    <MImage
                      source={{uri: posterNested.avatarUrl}}
                      style={styles.backgroundImage}
                      resizeMode="cover"
                      img="m"
                    />
                  )}
                </View>
                <View style={[styles.dateBox]}>
                  <MText bold style={styles.dateText}>
                    {dateStr()}
                  </MText>
                </View>
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.6)',
                    'transparent',
                    'transparent',
                    'transparent',
                    'rgba(0,0,0,0.6)',
                  ]}
                  style={styles.overlay}>
                  <View style={styles.topBar}>
                    <MText boldbold style={styles.posterName}>
                      {posterNested.name}
                    </MText>
                    <View>
                      <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={_renderTruncatedFooter}
                        renderViewLess={_renderRevealedFooter}>
                        <MText bold style={[styles.descriptionText]}>
                          {posterNested.description}
                        </MText>
                      </ViewMoreText>
                      {/*<ReadMore*/}
                      {/*  renderTruncatedFooter={_renderTruncatedFooter}*/}
                      {/*  renderRevealedFooter={_renderRevealedFooter}*/}
                      {/*  numberOfLines={2}>*/}
                      {/*  <MText bold style={[styles.descriptionText]}>*/}
                      {/*    {posterNested.description}*/}
                      {/*  </MText>*/}
                      {/*</ReadMore>*/}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {posterNested.telegram && (
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                'https://t.me/' + posterNested.telegram,
                              )
                            }>
                            <TelegramIcon />
                          </TouchableOpacity>
                        )}
                        {posterNested.whatsapp && (
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                'https://wa.me/' + posterNested.whatsapp,
                              )
                            }>
                            <WhatsAppIcon style={{marginHorizontal: 15}} />
                          </TouchableOpacity>
                        )}
                        {posterNested.instagram && (
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                'https://instagram.com/' +
                                  posterNested.instagram,
                              )
                            }>
                            <InstagramIcon size={20} />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => Linking.openURL(posterNested.url)}>
                          <MText
                            style={{
                              color: '#fff',
                              textDecorationLine: 'underline',
                            }}>
                            {posterNested.urlText}
                          </MText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                      nav.push('PosterView', {id: poster.id})
                    }}
                  />
                  <View style={styles.bottomBar}>
                    <View>
                      {!posterNested.liked && (
                        <TouchableOpacity
                          onPress={() => wantToVisit()}
                          style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            backgroundColor: '#FFA012',
                            marginBottom: posterNested.likes > 0 ? 20 : 0,
                            borderRadius: 8,
                          }}>
                          <MText bold style={{color: '#fff', fontSize: 12}}>
                            {t('want_to_go')}
                          </MText>
                        </TouchableOpacity>
                      )}
                      <View style={{marginTop: 12}}>
                        <MPosterLikes
                          likes={posterNested.likes}
                          unlikeAction={unlikeAction}
                        />
                      </View>
                    </View>
                    {/* <View>
              <TouchableOpacity style={styles.share} onPress={share}>
                <ShareIcon/>
              </TouchableOpacity>
              <MFavourite fav={posterNested.favourite} toggleFav={toggleFav}/>
            </View> */}
                  </View>
                </LinearGradient>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <></>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  posterText: {
    color: '#fff',
    fontSize: 30,
  },
  posterContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    top: -40,
  },
  share: {
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,16,34,0.4)',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#fff',
  },
  applyText: {
    color: '#fff',
    fontSize: 18,
  },
  applyButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateBox: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#F3267D',
    position: 'absolute',
    top: 30,
    right: -20,
    zIndex: 10,
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
  },
  ownerAvatar: {
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  ownerInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ownerName: {
    color: '#fff',
    marginLeft: 7,
  },
  topBar: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  bottomBar: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  posterName: {
    color: '#fff',
    fontSize: 20,
    width: 160,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 26,
    justifyContent: 'space-between',
  },
  cont: {
    flex: 1,
  },
  imageCont: {
    borderRadius: 26,
    overflow: 'hidden',
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewContainer: {
    height: 520,
    width: 250,
    borderRadius: 26,
  },
})
