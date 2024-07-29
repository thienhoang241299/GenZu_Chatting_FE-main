import axiosClient from '@/utils/axiosClient'

const createGroupChat = async (infoGroup) => {
  try {
    const response = await axiosClient.post('/conversations/group', infoGroup)
    return response.data
  } catch (error) {
    console.error('failed to create group', error)
  }
}

export default { createGroupChat }
