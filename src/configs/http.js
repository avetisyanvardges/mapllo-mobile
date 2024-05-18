import axios from 'axios'
import {apiUrl, authUrl} from './constants'
import store from '../configs/store'
import {logout} from '../slices/authReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthHttpClient = axios.create({
  baseURL: authUrl,
})

const HttpClient = axios.create({
  baseURL: apiUrl,
})

AuthHttpClient.interceptors.request.use(async config => {
  var token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

HttpClient.interceptors.request.use(async config => {
  var token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

HttpClient.interceptors.response.use(
  response => {
    // Modify the response data
    // For example, you can add a custom property to the response object
    return response
  },
  error => {
    if (error?.response?.status === 403) {
      AsyncStorage.removeItem('token')
      // SecureStore.deleteItemAsync('token')
      store.dispatch(logout())
    }
    // Handle any error that occurred during the request
    return Promise.reject(error)
  },
)

export default HttpClient
