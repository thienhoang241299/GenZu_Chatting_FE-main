// src/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  socketConnected: false,
  typing: false,
  isTyping: false,
  loadMore: false,
  listSearch: '',
  page: 2,
  minPage: 0,
  isCreateNewConversation: null,
}
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload
    },
    connectSocket: (state, action) => {},
    leaveRoomSlice: (state, action) => {},
    setLoadMore: (state, action) => {
      return {
        ...state,
        loadMore: action.payload,
      }
    },
    plusPage: (state) => {
      return {
        ...state,
        page: state.page + 1,
      }
    },
    minusPage: (state) => {
      return {
        ...state,
        minPage: state.minPage - 1,
      }
    },
    setPage: (state, action) => {
      return {
        ...state,
        page: action.payload,
      }
    },
    resetChat: () => {
      return initialState
    },
    createNewConversation: (state, action) => {},
    searchMessageByKeyword: (state, action) => {},
    searchMessageById: (state, action) => {},
    setListSearch: (state, action) => {
      return {
        ...state,
        listSearch: action.payload.data,
      }
    },
    setLsPage: (state, action) => {
      return { ...state, minPage: action.payload - 1 }
    },
    getMessageMoreBottom: (state, action) => {},
    setIsCreateNewConversation: (state, action) => {
      return {
        ...state,
        isCreateNewConversation: action.payload,
      }
    },
    watchMessageSlice: (state, action) => {},
    typingSlice: (state,action) => {},
  },
})

export const {
  setLoadMore,
  setLsPage,
  typingSlice,
  setIsCreateNewConversation,
  getMessageMoreBottom,
  watchMessageSlice,
  setPage,
  setListSearch,
  setLoading,
  minusPage,
  setSocketConnected,
  searchMessageById,
  setTyping,
  searchMessageByKeyword,
  setIsTyping,
  connectSocket,
  plusPage,
  leaveRoomSlice,
  resetChat,
  createNewConversation,
} = chatSlice.actions

export default chatSlice.reducer
