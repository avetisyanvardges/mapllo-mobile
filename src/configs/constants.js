const mobileInternet = false
const ip = mobileInternet ? '172.20.10.6' : '192.168.1.192'

const baseUrl = 'https://mapllo.com'

// const dev = __DEV__
const dev = false
export const authUrl = dev ? 'http://' + ip + ':8010' : baseUrl + '/auth'
export const wsUrl = dev ? 'http://' + ip + ':8011/ws' : baseUrl + '/api/ws'
export const apiUrl = dev ? 'http://' + ip + ':8011' : baseUrl + '/api'
export const fsUrl = dev ? 'http://' + ip + ':8011' : baseUrl + '/fs'

export const sharePosterUrl = baseUrl + '/posters/'
export const shareEventUrl = baseUrl + '/events/'
export const shareUserUrl = baseUrl + '/users/'

export const expoClientId =
  '164202578941-bbq9n42bh6mk7m2u0se0cbrn6b3cvn0i.apps.googleusercontent.com'

export const isYesterday = date => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid argument: you must provide a "date" instance')
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export const isToday = date => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid argument: you must provide a "date" instance')
  }

  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
