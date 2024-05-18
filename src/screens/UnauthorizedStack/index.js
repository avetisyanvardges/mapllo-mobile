import * as React from 'react'
import {useSelector} from 'react-redux'
import Login from './Login'
import Register from './Register'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Preview from '../Deprecated/Preview'
import MImageLibrary from '../../components/MImageLibrary'

const Stack = createNativeStackNavigator()

export default function UnauthorizedStack() {
  const authToken = useSelector(state => state.auth.token)
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {authToken == null ? (
        <Stack.Screen name={'Login'} component={Login} />
      ) : (
        <>
          <Stack.Screen name={'Register'} component={Register} />
          <Stack.Screen name={'Preview'} component={MImageLibrary} />
        </>
      )}
    </Stack.Navigator>
  )
}
