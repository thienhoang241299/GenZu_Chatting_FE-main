// store.js

import messageSlice from './Slice/messageSlice'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'

import userSlice from './Slice/userSlice'
import rootSaga from './saga'
import chatSlice from './Slice/chatSlice'

// disalbe thunk and add redux-saga middleware
const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: {
    message: messageSlice,
    user: userSlice,
    chat: chatSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga)

export default store
