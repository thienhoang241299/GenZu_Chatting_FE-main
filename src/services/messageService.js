import axiosClient from '@/utils/axiosClient'

export const getConversations = () => {
  return axiosClient.get('/conversations')
}

export const getMessages = async (messageId, page = 1) => {
  try {
    const response = await axiosClient.get(
      `/messages/getMessagePagination?id=${messageId}&limit=40&page=${page}`,
    )
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}
// search list message theo keyword
export const getMessagesSearch = async (conversationId, keyword) => {
  try {
    const response = await axiosClient.get(
      `/messages/searchMessage?id=${conversationId}&search=${keyword}`,
    )
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi search tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}
// lay 40 tin nhan gan tin nhan dich

export const sendMessageApi = async (message, id) => {
  try {
    const response = await axiosClient.post(`/messages/send?id=${id}`, message)
    return response.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}

export const addEmoji = async (messageId, emoji) => {
  try {
    const response = await axiosClient.post(`/messages/emoji?id=${messageId}`, {
      emoji,
    })
    return response.data
  } catch (error) {
    console.error('lỗi add emoji vao db', error)
    throw error
  }
}

export const updateEmoji = (emojiId, newEmoji) => {
  return axiosClient.patch(`/messages/emoji?id=${emojiId}`, {
    newEmoji,
  })
}

export const deleteEmoji = (messageId, emojiId) => {
  return axiosClient.delete(`/messages/emoji?emojiId=${emojiId}&messageId=${messageId}`)
}

export const deleteConversation = (idConversation) => {
  return axiosClient.delete(`/conversations?id=${idConversation}`)
}

export const deleteMessageOnesite = (idMessage) => {
  return axiosClient.patch(`/messages/deleteMessageByOneSide?id=${idMessage.idMessage}`)
}
export const recallMessage = (idMessage) => {
  return axiosClient.delete(`messages/recall?id=${idMessage}`)
}
export const createNewConversationService = async (idUser) => {
  try {
    const response = await axiosClient.post(`/conversations`, { userId: idUser })
    return response.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}

export const changeBackground = (background, idConversation) => {
  try {
    return axiosClient.patch(`/conversations/background?id=${idConversation}`, background)
  } catch (error) {
    console.error('Lỗi khi thay đổi background cuộc hội thoại:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}
export const fetchLsImage = async (idConversation) => {
  try {
    const response = await axiosClient.get(`messages/images/${idConversation}`)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}
export const fetchLsVideo = async (idConversation) => {
  try {
    const response = await axiosClient.get(`messages/videos/${idConversation}`)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn qua API:', error)
    throw error // Ném lỗi để saga có thể bắt
  }
}
