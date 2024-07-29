import { all } from 'redux-saga/effects'

import authSaga from './saga/userSaga/userSaga'
import chatSaga from './saga/chatSaga/chatSaga'

export default function* rootSaga() {
  yield all([
    chatSaga(),
    authSaga(),
    // other sagas
  ])
}
