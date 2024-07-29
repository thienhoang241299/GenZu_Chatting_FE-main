// Import các actions cần thiết để cập nhật state trong Redux store.
import {
  minusPage,
  plusPage,
  setIsCreateNewConversation,
  setIsTyping,
  setListSearch,
  setLoadMore,
  setLsPage,
  setPage,
  setSocketConnected,
} from '@/redux/Slice/chatSlice'
import {
  setMessage,
  setNewMessage,
  setTranslationMessage,
  setEmojiOnMessage,
  setDeleteHistoryMessage,
  setMessagesMore,
  updateMessage,
  setMessagesMoreBottom,
  updateGroupChatInStoreMessageSlice,
} from '@/redux/Slice/messageSlice'
import {
  addMemberToGroup,
  deleteGroupById,
  setChangeBackground,
  setFriendRequestNotification,
  setFriendRequestReply,
  updateConversationByGroupId,
  setNewFriendRequestNotification,
  setNewLsConversation,
  setNewLsFriends,
  updateGroupMembers,
  deleteMemberFromGroupInStore,
  updateConversationGroupChat,
  deleteMemberInGroup,
  updateGroupChat,
  updateConversation,
  updateGroupChatInStore,
  exchangeAdminGroup,
  setDeleteGroupMember,
} from '../../Slice/userSlice'

// Import các hàm tiện ích và service để xử lý cookie, dịch thuật, và tương tác với API.
import { getCookie } from '@/services/Cookies'
import { translateText } from '@/services/TranslationService'
import {
  getMessages,
  sendMessageApi,
  addEmoji,
  updateEmoji,
  deleteEmoji,
  deleteConversation,
  recallMessage,
  createNewConversationService,
  changeBackground,
  getMessagesSearch,
} from '@/services/messageService'

// Import thư viện socket.io-client để tạo kết nối WebSocket.
import { io } from 'socket.io-client'

// Import các effect từ redux-saga để xử lý logic bất đồng bộ.
import { eventChannel } from 'redux-saga'
import { call, put, take, takeLatest } from 'redux-saga/effects'

// Biến toàn cục để lưu trữ socket connection.
var socket

/**
 * Tạo một event channel để lắng nghe các sự kiện từ socket.io.
 * @param {Socket} socket - Socket.io connection.
 * @param {string} idConversation - ID của cuộc trò chuyện hiện tại.
 * @returns {EventChannel} Event channel để lắng nghe các sự kiện socket.io.
 */
function createSocketChannel(socket, idConversation) {
  return eventChannel((emit) => {
    // Đăng ký lắng nghe các sự kiện socket.io.
    socket.on('connected', () => emit(setSocketConnected(true)))
    socket.on('typing', () => {
      console.log('is typing')
      emit(setIsTyping(true))
    })
    socket.on('stop_typing', () => emit(setIsTyping(false)))
    socket.on('validation', (data) => {
      console.log('validation', data)
    })
    socket.on('notification', (data) => {
      console.log('notifi', data)
      if (data.success && data.actionCode === 3006 || data.actionCode === 3007 || data.actionCode === 3011) {
        const groupId = data.data._id
        const updatedConversation = data.data.users
        emit(updateConversationByGroupId({ groupId, updatedConversation }))
      } else if (data.success && data.actionCode === 3004) {
        emit(deleteGroupById(data.data))
        emit(setDeleteGroupMember())
      } else if (data.success && data.actionCode === 2001) {
        emit(deleteGroupById(data.data))
      } else if (data.success && data.actionCode === 3012) {
        emit(deleteGroupById(data.data))
      }
    })
    socket.on('response group', (res) => {
      console.log('response group', res)
      if (res.success && res.messageCode === 3001) {
        emit(setNewLsConversation(res.data))
      } else if (res.success && res.messageCode === 3004) {
        emit(deleteGroupById(res.data))
      } else if (res.success && res.messageCode === 3006) {
        const groupId = res.data._id
        const updatedConversation = res.data.users
        emit(updateConversationByGroupId({ groupId, updatedConversation }))
      } else if (res.success && res.messageCode === 3007) {
        const groupId = res.data._id
        const updatedConversation = res.data.users
        emit(updateConversationByGroupId({ groupId, updatedConversation }))
      } else if (res.success && res.messageCode === 3012) {
        emit(deleteGroupById(res.data))
      }
      else if (res.success && res.messageCode === 3011) {
        emit(deleteGroupById(res.data))
      }
       else if (res.success && res.messageCode === 3023) {
        const conversationId = res.data._id
        const updatedData = res.data
        emit(updateGroupChatInStore({ conversationId, updatedData }))
      } else if (res.success && res.messageCode === 3002) {
        // update group in redux here
        const conversationId = res.data?._id
        const updatedData = res.data
        const updateConversation = {
          avatar: res.data.avatar,
          background: res.data.background,
          chatName: res.data.chatName,
          _id: res.data._id,
          isGroupChat: res.data.isGroupChat,
        }
        emit(updateGroupChatInStore({ conversationId, updatedData }))
        emit(updateConversationGroupChat({ conversationId, updatedData: updateConversation }))
      }
    })
    socket.on('delete group', (res) => {
      console.log('delete', res)
      emit(deleteConversation(res))
    })
    socket.on('delete member', (res) => {
      console.log('delete member')
      emit(deleteMemberInGroup(res))
    })
    socket.on('add member', (res) => {
      console.log('add member', res)
      emit(addMemberToGroup(res))
    })
    socket.on('update group', (res) => {
      console.log('update group', res)
      emit(updateGroupChat(res))
    })

    socket.on('message received', (message) => {
      // Kiểm tra xem tin nhắn có thuộc về cuộc trò chuyện hiện tại hay không.
      if (
        message?.data?.conversation?._id == idConversation ||
        message?.conversation?._id === idConversation
      ) {
        // Dispatch action để cập nhật state với tin nhắn mới.
        emit(setNewMessage(message.data ? message.data : message))
      }
    })
    socket.on('response send message', (res) => {
      emit(setNewMessage(res.data))
    })

    // Lắng nghe các sự kiện liên quan đến lời mời kết bạn.
    socket.on('received request', (newRequest) => {
      console.log('new req', newRequest)
      emit(setFriendRequestNotification(newRequest))
    })
    socket.on('received reply', (newReply) => {
      console.log('new reply', newReply)
      emit(setNewFriendRequestNotification(newReply))
      if (newReply.status == 'accepted') {
        emit(setNewLsFriends(newReply.receiver))
      }
    })
    // Lắng nghe các sự kiện liên quan tới emoji
    socket.on('emoji received', (emoji) => {
      console.log('co emoji moi', emoji)
      emit(setEmojiOnMessage(emoji))
    })
    // Lắng nghe sự kiện đã đọc thông báo.
    socket.on('isRead', (read) => {
      console.log(read)
    })
    socket.on('recall received', (message) => {
      console.log(message)
      emit(updateMessage(message.data.data))
    })
    socket.on('accessed chat', (conversation) => {
      emit(setNewLsConversation(conversation.conversation))
      console.log(conversation)
    })
    socket.on('new message received', (message) => {
      emit(updateConversation(message))
      console.log(message)
    })

    socket.on('changed background', (background) => {
      console.log('background', background)
      emit(setChangeBackground(background))
    })
    // Trả về hàm unsubscribe để hủy đăng ký lắng nghe các sự kiện khi event channel bị đóng.
    return () => {
      socket.off('connected')
      socket.off('typing')
      socket.off('stop_typing')
      socket.off('message received')
      socket.off('isRead')
      socket.off('emoji received')
      socket.off('received reply')
      socket.off('received request')
      socket.off('recall received')
      socket.off('new message received')
      socket.off('changed background')
    }
  })
}

/**
 * Saga để xử lý kết nối socket.io.
 * @param {object} action - Redux action.
 */
function* handleSocketConnect(action) {
  // Tạo kết nối socket.io.
  socket = io(import.meta.env.VITE_ENDPOINT, {
    extraHeaders: { Authorization: `Bearer ${JSON.parse(getCookie('userLogin')).accessToken}` },
  })
  // Lấy thông tin người dùng từ cookie.
  const user = JSON.parse(getCookie('userLogin')).user

  // Gửi sự kiện 'setup' và 'join chat' đến server.
  socket.emit('setup', user)
  console.log('check join chat')
  setTimeout(() => {
    socket.emit('join chat', action.payload.idConversation)
  }, 1000)
  socket.emit('login', user._id)
  // Tạo event channel để lắng nghe các sự kiện socket.io.
  const socketChannel = yield call(createSocketChannel, socket, action.payload.idConversation)

  // Lắng nghe các action từ event channel và dispatch chúng đến Redux store.
  while (true) {
    const action = yield take(socketChannel)
    yield put(action)
  }
}
function* leaveRoom(action) {
  console.log('leave room')
  const userLeave = {
    user: JSON.parse(getCookie('userLogin'))?.user?._id,
    conversation: action.payload.idConversation,
  }

  yield call([socket, 'emit'], 'leave chat', userLeave)
}
/**
 * Saga để lấy danh sách tin nhắn từ API.
 * @param {object} action - Redux action.
 */
function* fetchMessages(action) {
  try {
    // Gọi API để lấy danh sách tin nhắn.
    const response = yield call(() => {
      return getMessages(action.payload.idConversation)
    })
    // Dispatch action để cập nhật state với danh sách tin nhắn.
    // console.log(response.Messages[0])
    yield call(watchMessageSocket, response?.Messages[0])
    yield put(setMessage(response))
  } catch (error) {
    console.error('Lỗi khi lấy lsMessages:', error)
  }
}
function* fetchMessagesMore(action) {
  console.log(action.payload)
  try {
    // Gọi API để lấy danh sách tin nhắn.
    const response = yield call(() => {
      return getMessages(action.payload.idConversation, action.payload.page)
    })
    // Dispatch action để cập nhật state với danh sách tin nhắn.
    yield put(setMessagesMore(response))
    yield put(plusPage())
    yield put(setLoadMore(false))
  } catch (error) {
    console.error('Lỗi khi lấy lsMessages:', error)
  }
}
function* fetchMessagesMoreBottom(action) {
  console.log(action.payload)
  try {
    // Gọi API để lấy danh sách tin nhắn.
    console.log(action.payload.page)
    const response = yield call(() => {
      return getMessages(action.payload.idConversation, action.payload.page)
    })
    // Dispatch action để cập nhật state với danh sách tin nhắn.
    console.log(response.Messages)
    yield put(setMessagesMoreBottom(response))
    yield put(minusPage())
    yield put(setLoadMore(false))
  } catch (error) {
    console.error('Lỗi khi lấy lsMessages:', error)
  }
}
/**
 * Saga để gửi lời mời kết bạn.
 * @param {object} action - Redux action.
 */
function* sendAddFriendRequest(action) {
  // Gửi sự kiện 'friend request' đến server.
  console.log('send add friend req')
  yield call([socket, 'emit'], 'friend request', action.payload)
}

/**
 * Saga để gửi thông báo đã đọc.
 * @param {object} action - Redux action.
 */
function* sendReadNotification(action) {
  // Gửi sự kiện 'read request' đến server.
  yield call([socket, 'emit'], 'read request', action.payload)
}

/**
 * Saga để phản hồi lời mời kết bạn.
 * @param {object} action - Redux action.
 */
function* replyAddFriendRequest(action) {
  // Gửi sự kiện 'accept request' đến server.
  console.log('accepted')
  yield call([socket, 'emit'], 'accept request', action.payload)
}
/**
 * Saga để handle cac action chat
 */
function* typingSaga(action) {
  yield call([socket, 'emit'], 'typing', action.payload)
}
/**
 * Saga để gửi tin nhắn.
 * @param {object} action - Redux action.
 */
function* sendMessageSaga(action) {
  // Tạo object chứa thông tin tin nhắn.
  const inforChat = {
    message: action.payload.message,
    isSpoiled: action.payload.isSpoiled,
    messageType: action.payload.messageType ? action.payload.messageType : 'text',
    styles: action.payload.styles,
    emojiBy: action.payload.emojiBy,
    replyMessage: action.payload.replyMessage || null,
  }

  try {
    // Gửi sự kiện 'stop_typing' đến server.
    yield call([socket, 'emit'], 'stop_typing', action.payload.idConversation.idConversation)

    // Gọi API để gửi tin nhắn.
    const data = yield call(sendMessageApi, inforChat, action.payload.idConversation.idConversation)

    // Gửi sự kiện 'new message' đến server.
    yield call([socket, 'emit'], 'new message', data.data)
    console.log('send message success')

    // Dispatch action để cập nhật state với tin nhắn mới.
    yield put(setNewMessage(data.data))
  } catch (error) {
    console.error('Failed to send message', error)
  }
}

function* sendMessageGroupSaga(action) {
  const inforChat = {
    message: action.payload.message,
    isSpoiled: action.payload.isSpoiled,
    conversationId: action.payload.idConversation?.idConversation,
    messageType: action.payload.messageType ? action.payload.messageType : 'text',
    styles: action.payload.styles,
    emojiBy: action.payload.emojiBy,
    replyMessage: action.payload.replyMessage || null,
  }

  try {
    yield call([socket, 'emit'], 'send message', inforChat)

    // Gửi sự kiện 'stop_typing' đến server.
    yield call([socket, 'emit'], 'stop_typing', action.payload.idConversation.idConversation)

    // Gửi sự kiện 'new message' đến server.
    console.log('send message success')

    // Dispatch action để cập nhật state với tin nhắn mới.
  } catch (error) {
    console.error('Failed to send message', error)
  }
}

/**
 * Saga để dịch văn bản.
 * @param {object} action - Redux action.
 */
function* translationTextSaga(action) {
  try {
    // Gọi service để dịch văn bản.
    const message = yield call(() => {
      return translateText(
        action.payload.id,
        JSON.parse(getCookie('userLogin'))?.user?.languageTranslate,
      )
    })

    // Dispatch action để cập nhật state với văn bản đã dịch.
    yield put(setTranslationMessage({ message: message, id: action.payload.id }))
  } catch (error) {
    console.log('Translation Error:', error)
  }
}

/**
 * Saga để xử lý emoji trên tin nhắn.
 * @param {object} action - Redux action.
 */

function* setEmoji(action) {
  try {
    let apiCall
    const { type, ...rest } = action.payload // Tách type và các thuộc tính khác

    // Dùng switch-case để chọn API call dựa trên "type"
    switch (type) {
      case 'ADD':
        apiCall = yield call(addEmoji, rest.id_message, rest.emoji)
        apiCall.data.type = type
        yield call([socket, 'emit'], 'add emoji', apiCall.data)
        break
      case 'UPDATE':
        apiCall = yield call(updateEmoji, rest.id_emoji, rest.emoji)
        // set du lieu cho viec gui xu kien update len server
        apiCall.data.type = type
        apiCall.data.conversation = action.payload.idConversation
        apiCall.data._id = action.payload.id_message
        apiCall.data.data.sender = { _id: apiCall.data.data.sender }
        yield call([socket, 'emit'], 'edit emoji', apiCall.data)
        break
      default: // Default là "DELETE"
        apiCall = yield call(deleteEmoji, rest.id_message, rest.id_emoji)
        // set du lieu cho viec gui xu kien delete len server
        apiCall.data.type = type
        apiCall.data.conversation = action.payload.idConversation
        apiCall.data._id = action.payload.id_message
        apiCall.data.data.sender = { _id: apiCall.data.data.sender }
        yield call([socket, 'emit'], 'delete emoji', apiCall.data)
    }

    // Gọi API một lần duy nhất
    const { data } = apiCall
    // Dispatch action với payload ban đầu
    yield put(setEmojiOnMessage(data))
  } catch (error) {
    console.error('Lỗi khi xử lý emoji:', error)
  }
}

function* deleteHistoryMessage(action) {
  try {
    const { data } = yield call(deleteConversation, action.payload.idConversation)
    yield put(setDeleteHistoryMessage(action.payload.idConversation))
  } catch (error) {
    console.error('Lỗi khi xóa cuộc hội thoại:', error)
  }
}

function* changeBgConversation(action) {
  try {
    const { data } = yield call(
      changeBackground,
      action.payload.background,
      action.payload.idConversation,
    )
    yield put(setChangeBackground(data.data.conversationUpdate))
    yield call([socket, 'emit'], 'change background', data.data.conversationUpdate)
    yield call([socket, 'emit'], 'new message', data.data.message)
  } catch (error) {
    console.error('Lỗi khi xóa cuộc hội thoại:', error)
  }
}
function* watchMessageSocket(action) {
  try {
    yield call([socket, 'emit'], 'watch message', action.payload)
  } catch (error) {
    console.log(error)
  }
}
function* recallMessageSaga(action) {
  console.log(action.payload)
  try {
    const response = yield call(recallMessage, action.payload)
    console.log(response)
    yield call([socket, 'emit'], 'recall', response)
    yield put(updateMessage(response.data.data))
  } catch (error) {
    console.log(error)
  }
}
function* createGroupChatSaga(action) {
  try {
    yield call([socket, 'emit'], 'create group', action.payload)
  } catch (error) {
    console.log(error)
  }
}

function* exchangeAdminGroupSaga(action) {
  try {
    yield call([socket, 'emit'], 'exchange admin group', action.payload)
  } catch (error) {
    console.log(error)
  }
}

function* updateGroupChatSaga(action) {
  try {
    yield call([socket, 'emit'], 'update group', action.payload)
  } catch (error) {
    console.log(error)
  }
}

function* deleteGroupChatSaga(action) {
  try {
    yield call([socket, 'emit'], 'delete group', action.payload)
  } catch (error) {
    console.log(error)
  }
}

function* deleteMemberInGroupSaga(action) {
  try {
    yield call([socket, 'emit'], 'delete member', action.payload)
  } catch (error) {
    console.log(error)
  }
}

function* addNewMemberToGroupSaga(action) {
  try {
    yield call([socket, 'emit'], 'add member', action.payload)
  } catch (error) {
    console.log(error)
  }
}
function* LogoutSaga(action) {
  try {
    yield call([socket, 'emit'], 'logout', action.payload)
  } catch (error) {
    console.log(error)
  }
}
function* createNewConversationSaga(action) {
  console.log(action.payload)
  const response = yield call(createNewConversationService, action.payload)
  yield put(setNewLsConversation(response.data))
  console.log(response.data)
  yield call([socket, 'emit'], 'access chat', {
    conversation: response.data,
    userId: JSON.parse(getCookie('userLogin')).user?._id,
  })

  yield put(setIsCreateNewConversation(response.data._id))
}
function* searchMessageByKeyword(action) {
  console.log(action.payload)
  const response = yield call(
    getMessagesSearch,
    action.payload.idConversation,
    action.payload.keyword,
  )
  yield put(setListSearch(response))
  console.log(response)
}

function* searchMessageById(action) {
  console.log(action.payload)
  const response = yield call(getMessages, action.payload.idConversation, action.payload.page)
  console.log(response)
  yield put(setPage(response.currentPage.page + 1))
  yield put(setLsPage(response.currentPage.page))
  yield put(setMessage(response))
}
/**
 * Root saga để theo dõi tất cả các action và chạy các saga tương ứng.
 */
export default function* chatSaga() {
  yield takeLatest('user/setReadNotification', sendReadNotification)
  yield takeLatest('chat/searchMessageById', searchMessageById)
  yield takeLatest('message/sendMessageGroup', sendMessageGroupSaga)
  yield takeLatest('message/recallMessageSlice', recallMessageSaga)
  yield takeLatest('user/sendReplyFriendRequest', replyAddFriendRequest)
  yield takeLatest('user/alertFriendRequest', sendAddFriendRequest)
  yield takeLatest('message/translationMessage', translationTextSaga)
  yield takeLatest('chat/connectSocket', handleSocketConnect)
  yield takeLatest('message/getMessagesById', fetchMessages)
  yield takeLatest('message/getMessagesMore', fetchMessagesMore)
  yield takeLatest('chat/getMessageMoreBottom', fetchMessagesMoreBottom)
  yield takeLatest('user/createGroupChat', createGroupChatSaga)
  yield takeLatest('user/deleteGroupChat', deleteGroupChatSaga)
  yield takeLatest('user/exchangeAdminGroup', exchangeAdminGroupSaga)
  yield takeLatest('user/addNewMemberToGroup', addNewMemberToGroupSaga)
  yield takeLatest('user/updateGroupChat', updateGroupChatSaga)
  yield takeLatest('user/removeMemberFromGroup', deleteMemberInGroupSaga)
  yield takeLatest('user/leaveGroup', deleteMemberInGroupSaga)
  yield takeLatest('message/sendMessage', sendMessageSaga)
  yield takeLatest('message/deleteConversation', deleteHistoryMessage)
  yield takeLatest('message/handleEmojiOnMessage', setEmoji)
  yield takeLatest('user/logoutSlice', LogoutSaga)
  yield takeLatest('chat/leaveRoomSlice', leaveRoom)
  yield takeLatest('chat/createNewConversation', createNewConversationSaga)
  yield takeLatest('user/handleChangeBackground', changeBgConversation)
  yield takeLatest('chat/searchMessageByKeyword', searchMessageByKeyword)
  yield takeLatest('chat/typingSlice', typingSaga)
  // yield takeLatest('chat/watchMessageSlice', watchMessageSocket)
}
