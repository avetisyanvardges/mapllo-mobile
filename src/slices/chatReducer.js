import { createSlice } from '@reduxjs/toolkit'

export const authReducer = createSlice({
  name: 'chat',
  initialState: {
    chats: null,
    messages: null
  },
  reducers: {
    viewMessages: (state, action) => {
      const viewedMessages = action.payload
      viewedMessages.forEach(viewedMessage => {
        const id = viewedMessage.id
        const chatId = viewedMessage.chatId
        const newChats = { ...state.chats }
        console.log('view message', id, 'of chat', chatId)
        newChats[chatId] = {
          ...newChats[chatId],
          'messages': state.chats[chatId].messages.map(m => {
            if (m.chatMessage.id === id) {
              return {
                ...m,
                'chatMessage': { ...m.chatMessage, 'viewed': true }
              }
            } else {
              return m
            }
          })
        }
        state.chats = newChats
      });
    },
    updateChatMessages: (state, action) => {
      const newMessages = action.payload.messages
      const prepend = action.payload.prepend

      const grouppedMessagesByChatId = newMessages.reduce((acc, message) => {
        if (!acc[message.chatMessage.chatId]) {
          acc[message.chatMessage.chatId] = [];
        }
        acc[message.chatMessage.chatId].push(message);
        return acc;
      }, {});

      const result = { ...state.chats };
      Object.keys(grouppedMessagesByChatId).forEach(key => {
        if (result[key]) {
          const oldMessages = result[key].messages
          const newMessages = grouppedMessagesByChatId[key].reverse().filter(m => !oldMessages.some(old => old.chatMessage.id == m.chatMessage.id))
          const concat = prepend ? oldMessages.concat(newMessages) : newMessages.concat(oldMessages)
          result[key] = { ...result[key], 'messages': concat };
        } else {
          throw new Error('received message from a not updated chat')
        }
      });
      state.chats = result
    },
    initChat: (state, action) => {
      state.chats = { ...state.chats, [action.payload.id]: action.payload }
    },
  },
})
export const {
  updateChatMessages,
  viewMessages,
  initChat
} = authReducer.actions

export default authReducer.reducer
