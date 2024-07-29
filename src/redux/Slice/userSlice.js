import { createSlice } from '@reduxjs/toolkit'
import Fuse from 'fuse.js'
import userIcon from '../../assets/user_icon.jpg'
const initialState = {
  lsFriends: [],
  isDeleteGroupChat: false,
  lsSearchFriends: [],
  lsPersonalChats: [],
  lsGroupChats: [],
  lsConversation: null,
  editUser: false,
  idConversation: null,
  conversation: null,
  userBlocked: null,
  toastMessage: '',
  friendRequestNotification: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state) => {
      return { ...state }
    },
    searchFriends: (state, action) => {
      const lsAllFriends = JSON.parse(JSON.stringify(state.lsFriends))
      const fuse = new Fuse(lsAllFriends, {
        keys: ['info.fullName', 'info.email'],
        threshold: 0.5, // Ngưỡng tìm kiếm mờ
      })
      const result = fuse.search(action.payload)

      return {
        ...state,
        lsSearchFriends: result.map((res) => res.item),
      }
    },
    clearSearchFriends: (state, action) => {
      return {
        ...state,
        lsSearchFriends: [],
      }
    },
    removeFriend: (state, action) => {
      state.lsFriends = state.lsFriends.filter((friend) => friend.friendShip !== action.payload)
    },
    setFriends: (state, action) => {
      return {
        ...state,
        lsFriends: action.payload,
      }
    },
    setNewLsFriends: (state, action) => {
      return {
        ...state,
        lsFriends: [...state.lsFriends, action.payload],
      }
    },
    getFriends: (state, action) => {},
    updateUser: (state, action) => {
      return {
        ...state,
        editUser: action.payload,
      }
    },
    setIdConversation: (state, action) => {
      return {
        ...state,
        idConversation: action.payload,
      }
    },
    setIsDeleteGroupChat: (state, action) => {
      return {
        ...state,
        isDeleteGroupChat: true,
      }
    },
    setDeleteGroupMember: (state, action) => {
      return {
        ...state,
        conversation: state.lsConversation[0],
        isDeleteGroupChat: true,
      }
    },
    createGroupChat: (state, action) => {},
    deleteGroupChat: (state, action) => {},
    getIdConversation: (state, action) => {},
    getLsConversation: (state, action) => {},
    setLsConversation: (state, action) => {
      return {
        ...state,
        lsConversation: action.payload,
      }
    },
    setNewLsConversation: (state, action) => {
      const index = state.lsConversation?.findIndex((item) => item._id == action.payload._id)
      if (index == -1) {
        if (action.payload.isGroupChat) {
          return {
            ...state,
            lsConversation: [action.payload, ...state.lsConversation],
            lsGroupChats: [action.payload, ...state.lsGroupChats],
          }
        } else {
          return {
            ...state,
            lsConversation: [action.payload, ...state.lsConversation],
            lsPersonalChats: [action.payload, ...state.lsPersonalChats],
          }
        }
      }
    },
    updateConversation: (state, action) => {
      const index = state.lsConversation.findIndex(
        (item) => item._id == action.payload.conversation._id,
      )
      state.lsConversation[index] = action.payload.conversation
      if (!action.payload.conversation.isGroupChat) {
        const indexLsChat = state.lsPersonalChats.findIndex(
          (item) => item._id == action.payload.conversation._id,
        )
        console.log(indexLsChat)
        state.lsPersonalChats[indexLsChat] = action.payload.conversation
      } else {
        const indexLsChat = state.lsGroupChats.findIndex(
          (item) => item._id == action.payload.conversation._id,
        )
        console.log(indexLsChat)
        state.lsGroupChats[indexLsChat] = action.payload.conversation
      }
    },
    updateConversationGroupChat: (state, action) => {
      const { conversationId, updatedData } = action.payload

      if (state.conversation._id === conversationId) {
        state.conversation = {
          ...state.conversation,
          ...updatedData,
        }
      }
    },
    updateConversationByGroupId: (state, action) => {
      const { groupId, updatedConversation } = action.payload
      const conversationIndex = state.lsGroupChats.findIndex(
        (conversation) => conversation._id === groupId,
      )

      if (conversationIndex !== -1) {
        state.lsGroupChats[conversationIndex] = {
          ...state.lsGroupChats[conversationIndex],
          users: updatedConversation,
        }
      } else {
        console.error('Conversation not found')
      }
    },
    setLsGroupChat: (state, action) => {
      return {
        ...state,
        lsGroupChats: action.payload,
      }
    },
    updateGroupMembers: (state, action) => {
      const { idConversation, users } = action.payload
      const groupChatIndex = state.lsGroupChats.findIndex((group) => group._id === idConversation)

      if (groupChatIndex !== -1) {
        state.lsGroupChats[groupChatIndex].users = users
      }
    },
    deleteMemberFromGroupInStore: (state, action) => {
      const { idUser, idConversation } = action.payload
      // Tìm group tương ứng với idConversation
      const group = state.lsGroupChats.find((group) => group._id === idConversation)
      if (group) {
        // Loại bỏ idUser khỏi danh sách members của group nếu có
        group.users = group.users.filter((userId) => userId !== idUser)
      } else {
        // Nếu không tìm thấy group, có thể xử lý lỗi hoặc thêm group mới
        console.error('Group not found')
      }
    },
    deleteGroupById: (state, action) => {
      const newLsGroupChats = state.lsGroupChats.filter(
        (groupChat) => groupChat._id !== action.payload,
      )
      state.lsGroupChats = newLsGroupChats
      state.conversation = state.lsGroupChats[0]
    },
    addNewMemberToGroup: (state, action) => {
      const { groupId, users } = action.payload
      // Tìm group tương ứng với idConversation
      const group = state.lsGroupChats.find((group) => group._id === groupId)
      // if (group) {
      //   // Thêm idUser vào danh sách members của group nếu chưa có
      //   if (!group.users.includes(users)) {
      //     group.users.push(users)
      //   }
      // } else {
      //   // Nếu không tìm thấy group, có thể xử lý lỗi hoặc thêm group mới
      //   console.error('Group not found')
      // }
    },
    updateGroupChat: (state, action) => {},
    removeMemberFromGroup: (state, action) => {
      const { groupId, memberId } = action.payload
      // Tìm group tương ứng với idConversation
      const groupIndex = state.lsGroupChats.findIndex((group) => group._id === groupId)

      if (groupIndex !== -1) {
        const group = state.lsGroupChats[groupIndex]
        // Loại bỏ idUser khỏi danh sách members của group nếu có
        group.users = group.users.filter((user) => user._id !== memberId)

        // Kiểm tra nếu chỉ còn 1 thành viên thì xóa nhóm
        if (group.users.length === 1) {
          state.lsGroupChats.splice(groupIndex, 1)
          state.isDeleteGroupChat = true
        }
      } else {
        // Nếu không tìm thấy group, có thể xử lý lỗi hoặc thêm group mới
        console.error('Group not found')
      }
    },
    exchangeAdminGroup: (state, action) => {},
    updateGroupChatInStore: (state, action) => {
      const { conversationId, updatedData } = action.payload

      const updatedIndex = state.lsGroupChats.findIndex((chat) => chat._id === conversationId)

      if (updatedIndex !== -1) {
        state.lsGroupChats[updatedIndex] = {
          ...state.lsGroupChats[updatedIndex],
          ...updatedData,
        }
      }
    },
    addMemberToGroup: (state, action) => {},
    setLatestConversation: (state, action) => {},
    deleteMemberInGroup: (state, action) => {},
    setLsPersonalChats: (state, action) => {
      return {
        ...state,
        lsPersonalChats: action.payload,
      }
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload
    },
    clearToastMessage: (state) => {
      state.toastMessage = null
    },
    alertFriendRequest: (state, action) => {},
    setReadNotification: (state, action) => {},
    sendReplyFriendRequest: (state, action) => {},
    leaveGroup: (state, action) => {},
    setFriendRequestNotification: (state, action) => {
      state.friendRequestNotification = action.payload
    },
    setNewFriendRequestNotification: (state, action) => {
      // return {
      //   ...state,
      //   friendRequestNotification: [...state.friendRequestNotification, action.payload],
      // }
      if (!Array.isArray(state.friendRequestNotification)) {
        state.friendRequestNotification = []
      }
      state.friendRequestNotification.push(action.payload)
    },
    setConversation: (state, action) => {
      return {
        ...state,
        conversation: state.lsConversation.find(
          (item) => item._id == action.payload.idConversation,
        ),
      }
    },
    setConversationFirst: (state, action) => {},
    clearUserSlice: () => initialState,
    loginSlice: (state, action) => {},
    logoutSlice: (state, action) => {},
    handleChangeBackground: (state, action) => {},
    setChangeBackground: (state, action) => {
      let conversation = JSON.parse(JSON.stringify(state.lsConversation)).find(
        (item) => item._id == action.payload._id,
      )

      let index = state.lsConversation.findIndex((item) => item._id == action.payload._id)
      const conversItem = {
        background: action.payload.background,
        avatar: conversation.avatar,
        deleteBy: conversation.deleteBy,
        blockUsers: conversation.blockUsers,
        _id: conversation._id,
        chatName: conversation.chatName,
        isGroupChat: conversation.isGroupChat,
        users: conversation.users,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        __v: conversation.__v,
        latestMessage: conversation.latestMessage,
      }
      const updatedLsConversation = JSON.parse(JSON.stringify(state.lsConversation)).map((item) => {
        console.log(item)
        return item
      })
      if (conversation) {
        updatedLsConversation[index] = conversItem
        conversation = conversItem
      }
      console.log(updatedLsConversation)
      return {
        ...state,
        conversation: conversation,
        lsConversation: updatedLsConversation,
      }
    },
    getFriendsAndConversation: () => {},
    handleBlockUser: (state, action) => {},
    getUserBlocked: (state, action) => {},
    setListBlockUsers: (state, action) => {
      return {
        ...state,
        lstBlockUsers: action.payload,
      }
    },
    setBlockUser: (state, action) => {
      return {
        ...state,
        userBlocked: action.payload,
      }
    },
  },
})

export const {
  setUser,
  clearSearchFriends,
  setUserInfo,
  searchFriends,
  updateUser,
  setNewLsFriends,
  setIdConversation,
  getFriendsAndConversation,
  getIdConversation,
  setLsConversation,
  updateConversation,
  getLsConversation,
  setLsGroupChat,
  setLsPersonalChats,
  updateGroupChatInStore,
  alertFriendRequest,
  sendReplyFriendRequest,
  setFriendRequestNotification,
  setNewFriendRequestNotification,
  setConversation,
  removeFriend,
  setConversationFirst,
  setToastMessage,
  clearToastMessage,
  setFriendRequestReply,
  setFriends,
  getFriends,
  clearUserSlice,
  loginSlice,
  logoutSlice,
  createGroupChat,
  updateGroupChat,
  addMemberToGroup,
  addNewMemberToGroup,
  deleteMemberInGroup,
  removeMemberFromGroup,
  leaveGroup,
  exchangeAdminGroup,
  setDeleteGroupMember,
  deleteMemberFromGroupInStore,
  updateGroupMembers,
  deleteGroupChat,
  deleteGroupById,
  setIsDeleteGroupChat,
  setNewLsConversation,
  updateConversationByGroupId,
  updateConversationGroupChat,
  handleChangeBackground,
  setChangeBackground,
  handleBlockUser,
  getUserBlocked,
  setListBlockUsers,
  setBlockUser,
} = userSlice.actions
export default userSlice.reducer
