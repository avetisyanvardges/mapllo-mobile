import {createSlice} from '@reduxjs/toolkit'

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    id: null,
    userName: null,
    name: null,
    city: null,
    birthday: null,
    gender: null,
    showOnlineOnMap: null,
    motivations: null,
    photos: null,
    about: null,
    instagram: null,
    vk: null,
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token
      state.id = action.payload.id
      state.userName = action.payload.userName
      state.name = action.payload.name
      state.city = action.payload.city
      state.birthday = action.payload.birthday
      state.gender = action.payload.gender
      state.showOnlineOnMap = action.payload.showOnlineOnMap
      state.photos = action.payload.photos
      state.motivations = action.payload.motivations
      state.about = action.payload.about
      state.vk = action.payload.vk
      state.instagram = action.payload.instagram
    },
    updateProfile: (state, action) => {
      state.userName = action.payload.userName
      state.name = action.payload.name
      state.birthday = action.payload.birthday
      state.gender = action.payload.gender
      state.motivations = action.payload.motivations
      state.about = action.payload.about
      state.vk = action.payload.vk
      state.instagram = action.payload.instagram
    },
    updatePhotos: (state, action) => {
      state.photos = action.payload.photos
    },
    updateShowOnlineOnMap: (state, action) => {
      state.showOnlineOnMap = action.payload.showOnlineOnMap
    },
    logout: (state, action) => {
      state.token = null
      state.id = null
    },
  },
})
export const {
  authenticate,
  logout,
  updateShowOnlineOnMap,
  updatePhotos,
  updateProfile,
} = authReducer.actions

export default authReducer.reducer
