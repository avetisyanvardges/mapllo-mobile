import HttpClient, {AuthHttpClient} from './http'

export const googleAuth = async token => {
  return AuthHttpClient.post('/login/google', token)
}

export const appleAuth = async body => {
  return AuthHttpClient.post('/login/apple', body)
}

export const verifyToken = async token => {
  return AuthHttpClient.post('/token/verify', token)
}

export const getProfile = async id => {
  return HttpClient.get('/profiles/' + id)
}
export const getPoster = async id => {
  return HttpClient.get('/posters/' + id)
}
export const getOwnProfile = async () => {
  return HttpClient.get('/profile/own')
}

export const switchShowOnline = async () => {
  return HttpClient.post('/profile/switchShowOnline')
}
export const createProfile = async body => {
  return HttpClient.post('/profiles', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const isUsernameFree = async username => {
  return HttpClient.get('/usernames/' + username)
}

export const getCityByCoords = async (lng, lat, language) => {
  return HttpClient.get(
    '/locations/city-by-coords?lng=' +
      lng +
      '&lat=' +
      lat +
      '&language=' +
      language,
  )
}

export const getAddressByCoords = async (lng, lat, language) => {
  return HttpClient.get(
    '/locations/address-by-coords?lng=' +
      lng +
      '&lat=' +
      lat +
      '&language=' +
      language,
  )
}

export const getAddressesByQuery = async (query, lat, lng) => {
  return HttpClient.get(
    '/locations/addresses-by-query?query=' +
      query +
      '&lat=' +
      lat +
      '&lng=' +
      lng,
  )
}
export const createEvent = async (body, photo, video) => {
  const formData = new FormData()
  formData.append('data', {
    string: JSON.stringify(body),
    type: 'application/json',
  })
  if (photo) {
    formData.append('avatar', {
      name: photo.fileName,
      uri: photo.uri,
      type: photo.type,
    })
  }
  if (video) {
    formData.append('video', {
      name: video.fileName,
      uri: video.uri,
      type: video.type,
    })
  }
  return HttpClient.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const getCitiesByQuery = async (query, language) => {
  //use this to get placeId
  return HttpClient.get(
    '/locations/cities-by-query?query=' + query + '&language=' + language,
  )
}

export const setNewAvatar = async avatarId => {
  return HttpClient.put('/profile/avatar/' + avatarId)
}

export const addNewPhoto = async photo => {
  const formData = new FormData()
  let mutatedName
  if (!photo.fileName) {
    const [fileName] = photo.uri.split('/').reverse()
    mutatedName = fileName
  } else {
    mutatedName = photo.fileName
  }
  formData.append('photo', {
    name: mutatedName,
    uri: photo.uri,
    type: 'image/jpeg',
  })
  return HttpClient.put('/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteProfilePhoto = async id => {
  return HttpClient.delete('/profile/photo/' + id)
}

export const updateProfileInfo = async data => {
  return HttpClient.put('/profile/info', data)
}

export const getAggregatedOptions = async () => {
  return HttpClient.get('/aggregated/options')
}
export const getAggregatedTiles = async body => {
  return HttpClient.post('/aggregated/search/tiles', body)
}
export const getAllOnlineProfiles = async () => {
  return HttpClient.get('/aggregated/profiles')
}
export const getAllPosters = async placeId => {
  return HttpClient.get(
    '/aggregated/posters' + (placeId ? '?placeId=' + placeId : ''),
  )
}
export const getFeedEvents = async (body, limit, offset) => {
  return HttpClient.post(
    '/events/feed/v1?limit=' + limit + '&offset=' + offset,
    body,
  )
}
export const getFeedUsers = async (body, limit, offset) => {
  return HttpClient.post(
    '/users/feed/v1?limit=' + limit + '&offset=' + offset,
    body,
  )
}
export const complainTo = async (entity, id) => {
  return HttpClient.post('/complains/' + entity + '/' + id)
}
export const hideEntity = async (entity, id) => {
  return HttpClient.post('/hides/' + entity + '/' + id)
}
export const deleteEventCall = async id => {
  return HttpClient.delete('/events/' + id)
}
export const addToFav = async (entity, id) => {
  return HttpClient.post('/favourites/' + entity + '/' + id)
}
export const toggleReaction = async (id, reaction) => {
  return HttpClient.post('/reactions/' + id + '/' + reaction)
}
export const participate = async id => {
  return HttpClient.post('/participants/' + id)
}
export const leaveEvent = async id => {
  return HttpClient.delete('/participants/' + id)
}
export const expellEvent = async (eventId, userId) => {
  return HttpClient.delete('/participants/expel/' + eventId + '/' + userId)
}
export const rejectEventApplication = async (eventId, userId) => {
  return HttpClient.delete('/participants/reject/' + eventId + '/' + userId)
}
export const acceptEventApplication = async (eventId, userId) => {
  return HttpClient.post('/participants/accept/' + eventId + '/' + userId)
}
export const getChatWith = userId => {
  return HttpClient.get('/chats/user/' + userId)
}
export const getChats = async () => {
  return HttpClient.get('/chats')
}
export const getChat = async (chatId, from, limit, view) => {
  let path = '/chats/' + chatId + '?limit=' + limit + '&view=' + view
  if (from) {
    path += '&from=' + from
  }
  return HttpClient.get(path)
}
export const sendMessageToChat = async message => {
  return HttpClient.post('/chats/message', message)
}
export const getEvent = async id => {
  return HttpClient.get('/events/' + id)
}
export const getEventCount = async () => {
  return HttpClient.get('/events/own/count')
}
export const likePoster = async id => {
  return HttpClient.post('/posters/' + id + '/like')
}
export const unlikePoster = async id => {
  return HttpClient.post('/posters/' + id + '/unlike')
}
export const getFavourites = async type => {
  return HttpClient.get('/favourites/' + type)
}
export const getSupportedVersions = async () => {
  return HttpClient.get('/version/rn')
}
export const updateLanguage = async lang => {
  return HttpClient.put('/profile/language/' + lang)
}
export const complain = async message => {
  return HttpClient.post('/complains', {message})
}
export const viewMessage = async id => {
  return HttpClient.post('/chats/message/' + id + '/viewed')
}
export const registerDevice = async (deviceId, token) => {
  return HttpClient.post('/devices/register', {deviceId, token})
}
export const deregisterDevice = async deviceId => {
  return HttpClient.delete('/devices/deregister/' + deviceId)
}
export const updateEvent = async (eventId, body) => {
  return HttpClient.put('/events/' + eventId, body)
}
export const updateEventAvatar = async (id, photo, video, useCurrentPhoto) => {
  const formData = new FormData()
  if (photo) {
    formData.append('avatar', {
      name: photo.fileName,
      uri: photo.uri,
      type: photo.type,
    })
  }
  if (video) {
    formData.append('video', {
      name: video.fileName,
      uri: video.uri,
      type: video.type,
    })
  }
  return HttpClient.put(
    '/events/' + id + '/media?useCurrentPhoto=' + useCurrentPhoto,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
export const getLocationByPlaceId = async placeId => {
  return HttpClient.get('/locations/placeId?placeId=' + placeId)
}

export const deleteOwnAccount = async () => {
  return AuthHttpClient.delete('/own')
}

export const getChatMessages = async (fromTs, limit) => {
  return HttpClient.get('/chats/messages?fromTs=' + fromTs + '&limit=' + limit)
}