import {StyleSheet, View} from 'react-native';
import UnauthorizedStack from "./src/screens/UnauthorizedStack";
import React, {useEffect, useState} from "react";
import * as SplashScreen from "expo-splash-screen";
import {useDispatch, useSelector} from "react-redux";
import {getOwnProfile, verifyToken} from "./src/configs/api";
import {authenticate} from "./src/slices/authReducer";
import AuthorizedStack from "./src/screens/AuthorizedStack";
import Socket from "./src/configs/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Main() {
  const profileId = useSelector(state => state.auth.id)
  const dispatch = useDispatch()
  const [authFlowFinish, setAuthFlowFinish] = useState(false)

  useEffect(() => {
    if (authFlowFinish) {
      SplashScreen.hideAsync()
    }
  }, [authFlowFinish])

  useEffect(() => {
    AsyncStorage.getItem('token')
    .then(t => {
      if (t) {
        verifyToken(t)
        .then(() => dispatch(authenticate({token: t})))
        .then(() => getOwnProfile())
        .then((r) => {
          if(r.data){
            Socket.start(t, r.data.showOnlineOnMap)
          }
          dispatch(authenticate({token: t, ...r.data}))
        })
        .finally(() => setAuthFlowFinish(true))
      } else {
        setAuthFlowFinish(true)
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      {authFlowFinish && (
        profileId ? (<AuthorizedStack />) :(<UnauthorizedStack />)
      )}
    </View>)

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
});
