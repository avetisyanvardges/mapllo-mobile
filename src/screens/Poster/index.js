import {useIsFocused, useNavigation} from '@react-navigation/native'
import {LinearGradient} from 'expo-linear-gradient'
import * as React from 'react'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Linking,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import ReadMore from 'react-native-read-more-text'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import Video from 'react-native-video'
import ViewMoreText from 'react-native-view-more-text'
import {useSelector} from 'react-redux'

import MFavourite from '../../components/MFavourite'
import MImage from '../../components/MImage'
import MPosterLikes from '../../components/MPosterLikes'
import MText from '../../components/MText'
import {addToFav, likePoster, unlikePoster} from '../../configs/api'
import {sharePosterUrl} from '../../configs/constants'
import CompasSimpleIcon from '../../icons/CompasSimpleIcon'
import InstagramIcon from '../../icons/InstagramIcon'
import PlayIcon from '../../icons/PlayIcon'
import ShareIcon from '../../icons/ShareIcon'
import TelegramIcon from '../../icons/TelegramIcon'
import WhatsAppIcon from '../../icons/WhatsAppIcon'
export default function Poster({
  active,
  poster,
  popup,
  height,
  fullScreen = true,
  topPadding = 50,
}) {
  const profileId = useSelector(state => state.auth.id)
  const photos = useSelector(state => state.auth.photos)
  const name = useSelector(state => state.auth.name)
  const username = useSelector(state => state.auth.userName)
  const [paused, setPaused] = useState(false)
  const [showVideoPlay, setShowVideoPlay] = useState(!!poster.videoUrl)
  const videoRef = useRef()

  const [posterNested, setPosterNested] = useState(poster)
  const nav = useNavigation()
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()

  const wantToVisit = () => {
    likePoster(posterNested.id).then(r => {
      setPosterNested({
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
      setPosterNested({
        ...poster,
        liked: false,
        likes: posterNested.likes.filter(like => like.userId !== profileId),
      })
    })
  }

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
    Share.share({message}, {dialogTitle: t('join'), subject: t('join')})
  }
  const toggleFav = () => {
    addToFav('POSTER', posterNested.id).then(r => {
      const isFav = r.data
      setPosterNested({...posterNested, favourite: isFav})
      if (isFav) {
        popup.current.add({text: t('added_to_fav'), type: 'normal'})
      } else {
        popup.current.add({text: t('removed_from_fav'), type: 'normal'})
      }
    })
  }

  if (poster.deleted) {
    return (
      <View
        style={[
          fullScreen ? {flex: 1} : {height},
          {
            backgroundColor: '#999999',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <MText bold style={{color: '#fff', fontSize: 16}}>
          {t('deleted_poster')}
        </MText>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            margin: 20,
          }}>
          <MFavourite fav={poster.favourite} toggleFav={toggleFav} />
        </View>
      </View>
    )
  }

  const posterUrl = posterNested?.url?.startsWith('http')
    ? posterNested?.url
    : 'https://' + posterNested.url

  return (
    <View style={[styles.container, {height}]}>
      <View style={styles.imageCont}>
        {poster.videoUrl && (!active || paused || showVideoPlay) && (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              shadowOpacity: 0.3,
              shadowColor: '#000',
              shadowRadius: 10,
            }}>
            <PlayIcon />
          </View>
        )}
        {poster.videoUrl ? (
          <Video
            ref={videoRef}
            preferredForwardBufferDuration={20}
            volume={1}
            repeat={false}
            onEnd={() => {
              videoRef.current.seek(0)
            }}
            onLoad={() => setShowVideoPlay(false)}
            paused={!active || paused || !isFocused}
            poster={poster.avatarUrl}
            automaticallyWaitsToMinimizeStalling
            source={{uri: poster.videoUrl}}
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
            small
          />
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          justifyContent: 'space-between',
        }}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.29)',
            'rgba(0, 0, 0, 0.00)',
          ]}
          end={{x: 0.5, y: 1}}
          start={{x: 0.5, y: 0}}
          locations={[-0.0754, 0.1666, 0.873]}
          style={{height: '28%'}}>
          <View />
        </LinearGradient>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.30)',
            'rgba(0, 0, 0, 0.29)',
            'rgba(0, 0, 0, 0.00)',
          ]}
          end={{x: 0.5, y: 0.5}}
          start={{x: 0.5, y: 1.5}}
          locations={[-0.0754, 0.1666, 0.873]}
          style={styles.overlay}
          pointerEvents="box-none">
          <Pressable
            style={[styles.cont, {paddingTop: insets.top + topPadding}]}
            onPress={() => setPaused(p => !p)}
            disabled={!poster.videoUrl}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'space-around',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {posterNested.url && (
                  <Pressable
                    onPress={() => Linking.openURL(posterUrl)}
                    style={{padding: 5, zIndex: 999}}>
                    <MText
                      bold
                      style={{
                        color: '#fff',
                        textDecorationLine: 'underline',
                        fontSize: 14,
                      }}>
                      {posterNested.urlText}
                    </MText>
                  </Pressable>
                )}
                {fullScreen && (
                  <View style={[styles.dateBox]}>
                    <MText bold style={styles.dateText}>
                      {dateStr()}
                    </MText>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                bottom: fullScreen ? insets.bottom : 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <View style={{justifyContent: 'flex-end', flex: 1}}>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 17,
                    }}>
                    {posterNested.telegram && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://t.me/' + posterNested.telegram,
                          )
                        }>
                        <TelegramIcon style={{marginRight: 15}} />
                      </TouchableOpacity>
                    )}
                    {posterNested.whatsapp && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://wa.me/' + posterNested.whatsapp,
                          )
                        }>
                        <WhatsAppIcon size={25} style={{marginRight: 15}} />
                      </TouchableOpacity>
                    )}
                    {posterNested.instagram && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            'https://instagram.com/' + posterNested.instagram,
                          )
                        }>
                        <InstagramIcon size={25} style={{marginRight: 15}} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {!posterNested.liked && (
                    <TouchableOpacity
                      onPress={() => wantToVisit()}
                      style={{
                        padding: 5,
                        paddingHorizontal: 10,
                        backgroundColor: '#FFA012',
                        marginBottom: 17,
                        borderRadius: 8,
                      }}>
                      <MText
                        boldbold
                        style={{color: '#fff', textAlign: 'center'}}>
                        {t('want_to_go')}
                      </MText>
                    </TouchableOpacity>
                  )}
                  {posterNested.likes.length > 0 && (
                    <View style={{marginBottom: 17}}>
                      <MPosterLikes
                        likes={posterNested.likes}
                        width={300}
                        unlikeAction={unlikeAction}
                      />
                    </View>
                  )}
                  <MText boldbold style={styles.posterName}>
                    {posterNested.name}
                  </MText>
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
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: 20,
                  justifyContent: 'flex-end',
                }}>
                <MFavourite
                  fav={posterNested.favourite}
                  toggleFav={toggleFav}
                />
                <TouchableOpacity style={styles.share} onPress={share}>
                  <ShareIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compas}
                  onPress={() => nav.push('Locator', {poster: posterNested})}>
                  <CompasSimpleIcon size={36} />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  compas: {
    marginTop: 37,
  },
  posterText: {
    color: '#fff',
    fontSize: 40,
  },
  posterContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    top: -40,
  },
  share: {
    width: 36,
    height: 36,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16,16,34,0.4)',
    marginTop: 13,
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
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3267D',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
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
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  posterName: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 7,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    justifyContent: 'space-between',
  },
  cont: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 20,
  },
  imageCont: {
    height: '100%',
  },
  backgroundImage: {
    height: '100%',
  },
  container: {
    width: '100%',
  },
  previewContainer: {
    height: 520,
    width: 250,
    borderRadius: 30,
  },
})
