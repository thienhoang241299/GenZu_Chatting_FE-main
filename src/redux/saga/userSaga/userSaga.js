import {
  setBlockUser,
  setConversation,
  setConversationFirst,
  setFriends,
  setIdConversation,
  setListBlockUsers,
  setLsConversation,
  setLsGroupChat,
  setLsPersonalChats,
} from '@/redux/Slice/userSlice'
import { getConversations } from '@/services/messageService'
import userService from '@/services/userService'
import { all } from 'axios'
import { call, fork, put, spawn, takeEvery, takeLatest } from 'redux-saga/effects'
// Export hàm `fetchIdConversation`
function* fetchIdConversation() {
  console.log('firstConversationId')
  try {
    const response = yield call(getConversations)
    const firstConversationId = response?.data[0]?._id
    yield put(setLsConversation(response.data))
    yield put(setLsPersonalChats(response.data.filter((value) => value.isGroupChat == false)))
    yield put(setLsGroupChat(response.data.filter((value) => value.isGroupChat == true)))
    yield put(setIdConversation(firstConversationId)) // Sử dụng put
    yield put(
      setConversationFirst({ lsConversation: response.data, idConversation: firstConversationId }),
    ) // Sử dụng put
  } catch (error) {
    console.error('Lỗi khi lấy idConversation:', error)
  }
}
function* fetchConversation() {
  console.log('check conver')
  try {
    const response = yield call(getConversations)
    yield put(setLsConversation(response.data))
    yield put(setLsPersonalChats(response.data.filter((value) => value.isGroupChat == false)))
    yield put(setLsGroupChat(response.data.filter((value) => value.isGroupChat == true)))
    yield put(setIdConversation(response.data[0]?._id))
  } catch (error) {
    console.error('Lỗi khi lấy idConversation:', error.message)
  }
}
function* fetchLsFriends() {
  console.log('check fr')
  try {
    const response = yield call(userService.getAllFriends)
    console.log(response)
    yield put(setFriends(response))
  } catch (error) {
    console.log('error fetch friends in Saga', error)
  }
}
function* fetchConversationAndFriends() {
  console.log('check conver and friend')
  try {
    yield fork(fetchConversation)
    yield fork(fetchLsFriends)
  } catch (error) {
    console.error('Lỗi khi gọi fetchConversationAndFriends:', error.message)
  }
}

function* getUserBlocked() {
  try {
    const { data } = yield call(userService.getUserBlocked)
    console.log('get user block:', data)
    yield put(setListBlockUsers(data))
  } catch (error) {
    console.error('Lỗi khi get user blocked!!!', error)
    throw error
  }
}
function* handleBlockUser(action) {
  try {
    console.log('handleBlockUser:', action.payload)
    // let response
    switch (action.payload.type) {
      case 'block':
        const response = yield call(userService.blockUser, action.payload.user.id)
        console.log('response :', response.data.data)
        yield put(setListBlockUsers(response.data.data.blockedUsers))
        yield put(setBlockUser(action.payload.user.id))

        break
      case 'unBlock':
        const { data } = yield call(userService.unblockUser, action.payload.user.id)
        console.log('response :', data)

        yield put(setListBlockUsers(data.blockedUsers))
        yield put(setBlockUser(''))
        break
      default:
        break
    }
    // const {data} = response
    // console.log('data:', data)
  } catch (error) {
    console.error('Lỗi khi chặn người dùng này!', error)
    throw error
  }
}
function* authSaga() {
  yield takeLatest('user/getIdConversation', fetchIdConversation)
  yield takeLatest('user/getLsConversation', fetchConversation)
  yield takeLatest('user/getFriends', fetchLsFriends)
  yield takeEvery('user/getFriendsAndConversation', fetchConversationAndFriends)
  yield takeLatest('user/handleBlockUser', handleBlockUser)
  yield takeLatest('user/getUserBlocked', getUserBlocked)
}

export default authSaga
