import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/authReducer'
import chatReducer from '../slices/chatReducer'

export default configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer
  },
})
